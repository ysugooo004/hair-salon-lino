/**
 * hair salon Lino - main.js
 * ライブラリを使わない素の JavaScript です。
 *
 *  1. ドロワーメニュー（スマホ・タブレット）
 *  2. ダミー予約のお知らせ（サンプルサイト用のポップアップ）
 *  3. 絞り込みボタン（スタイル・お知らせ）
 *  4. スタイルのスライダー（スマホのみ・一時停止ボタン付き）
 *  5. スクロールでふわっと表示
 */
'use strict';

// 「動きを減らす」設定かどうか
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initDummyModal();
  document.querySelectorAll('.js-filter').forEach(initFilter);
  document.querySelectorAll('.js-slider').forEach(initSlider);
  initFadeIn();
});

/* ==========================================================
 * 1. ドロワーメニュー
 * ========================================================== */
function initDrawer() {
  const drawer = document.getElementById('drawer');
  const openButton = document.querySelector('.js-drawer-open');
  if (!drawer || !openButton) return;

  const closeButton = drawer.querySelector('.js-drawer-close');
  const pcQuery = window.matchMedia('(min-width: 1280px)');
  const focusableSelector = 'a[href], button:not([disabled])';

  const open = () => {
    drawer.hidden = false;
    // hidden を外した直後だとアニメーションしないため、次の描画で表示
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      closeButton.focus(); // 表示されてからフォーカスを移す
    });
    openButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
  };

  const close = ({ returnFocus = true } = {}) => {
    drawer.classList.remove('is-open');
    openButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    // フェードアウトが終わってから非表示にする
    window.setTimeout(() => {
      if (!drawer.classList.contains('is-open')) drawer.hidden = true;
    }, 250);
    if (returnFocus) openButton.focus();
  };

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', () => close());

  // メニュー内のリンクを押したら閉じる（ページ内リンク用）
  drawer.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => close({ returnFocus: false }));
  });

  drawer.addEventListener('keydown', (event) => {
    // Esc キーで閉じる
    if (event.key === 'Escape') {
      close();
      return;
    }
    // Tab キーでのフォーカスをメニューの中だけで回す（フォーカストラップ）
    if (event.key === 'Tab') {
      const items = [...drawer.querySelectorAll(focusableSelector)];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // PC幅になったら自動で閉じる
  pcQuery.addEventListener('change', (event) => {
    if (event.matches && !drawer.hidden) close({ returnFocus: false });
  });
}

/* ==========================================================
 * 2. ダミー予約のお知らせ
 *    data-dummy が付いたボタンを押すと、
 *    「サンプルサイトのため利用できません」を表示します。
 * ========================================================== */
function initDummyModal() {
  const modal = document.querySelector('.js-dummy-modal');
  if (!modal) return;

  const closeButton = modal.querySelector('.js-dummy-close');

  document.querySelectorAll('[data-dummy]').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        // <dialog> に対応していない古いブラウザ向け
        window.alert('サンプルサイトのため、予約・お問い合わせはご利用いただけません。');
      }
    });
  });

  closeButton.addEventListener('click', () => modal.close());

  // 背景（ポップアップの外側）をクリックしても閉じる
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

/* ==========================================================
 * 3. 絞り込みボタン
 *    <div class="js-filter" data-filter-target="対象のセレクタ"
 *         data-filter-status="件数を読み上げる要素">
 *      <button data-filter="all" aria-pressed="true">すべて</button>
 *    対象の要素には data-category="○○" を付けます。
 * ========================================================== */
function initFilter(group) {
  const buttons = group.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll(group.dataset.filterTarget);
  const status = document.querySelector(group.dataset.filterStatus);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

      let count = 0;
      items.forEach((item) => {
        const isMatch = filter === 'all' || item.dataset.category === filter;
        item.hidden = !isMatch;
        if (isMatch) count += 1;
      });

      // 読み上げソフト向けに、表示件数を知らせる
      if (status) status.textContent = `${button.textContent.trim()}：${count}件を表示しています`;

      // スライダーなどに「絞り込みが変わった」ことを伝える
      group.dispatchEvent(new CustomEvent('filter:change', { bubbles: true }));
    });
  });
}

/* ==========================================================
 * 4. スタイルのスライダー（スマホ幅のときだけ動く）
 *    - 5秒ごとに自動で切り替え
 *    - 一時停止ボタン／前後ボタン／指でのスワイプに対応
 *    - 「動きを減らす」設定の人には自動再生しない
 * ========================================================== */
function initSlider(slider) {
  const track = slider.querySelector('.js-slider-track');
  const prevButton = slider.querySelector('.js-slider-prev');
  const nextButton = slider.querySelector('.js-slider-next');
  const pauseButton = slider.querySelector('.js-slider-pause');
  const dotsWrap = slider.querySelector('.js-slider-dots');
  const spQuery = window.matchMedia('(max-width: 767px)');
  const INTERVAL = 5000;

  let index = 0;
  let timer = null;
  let isPausedByUser = false; // 一時停止ボタンで止めた
  let isPausedByFocus = false; // キーボード操作中は止める

  const visibleItems = () => [...track.querySelectorAll('.js-slider-item')].filter((item) => !item.hidden);

  const renderDots = () => {
    dotsWrap.innerHTML = '';
    visibleItems().forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'p-style__dot' + (i === index ? ' is-active' : '');
      dotsWrap.appendChild(dot);
    });
  };

  const updateDots = () => {
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };

  const goTo = (newIndex, smooth = true) => {
    const items = visibleItems();
    if (items.length === 0) return;
    index = (newIndex + items.length) % items.length; // 最後の次は最初に戻る
    track.scrollTo({
      left: items[index].offsetLeft - track.offsetLeft,
      behavior: smooth && !prefersReducedMotion.matches ? 'smooth' : 'auto',
    });
    updateDots();
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (!spQuery.matches || isPausedByUser || isPausedByFocus || prefersReducedMotion.matches) return;
    timer = window.setInterval(() => goTo(index + 1), INTERVAL);
  };

  // 指でスワイプしたときに、今の位置を index に反映
  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const items = visibleItems();
      const left = track.scrollLeft;
      let nearest = 0;
      items.forEach((item, i) => {
        const distance = Math.abs(item.offsetLeft - track.offsetLeft - left);
        const best = Math.abs(items[nearest].offsetLeft - track.offsetLeft - left);
        if (distance < best) nearest = i;
      });
      index = nearest;
      updateDots();
    }, 100);
  });

  prevButton.addEventListener('click', () => {
    goTo(index - 1);
    start(); // 押したら自動再生のタイマーをリセット
  });

  nextButton.addEventListener('click', () => {
    goTo(index + 1);
    start();
  });

  pauseButton.addEventListener('click', () => {
    isPausedByUser = !isPausedByUser;
    pauseButton.setAttribute('aria-pressed', String(isPausedByUser));
    pauseButton.setAttribute('aria-label', isPausedByUser ? '自動再生を再開' : '自動再生を一時停止');
    start();
  });

  // キーボードで中のボタンを操作している間は止める
  slider.addEventListener('focusin', () => {
    isPausedByFocus = true;
    stop();
  });
  slider.addEventListener('focusout', (event) => {
    if (!slider.contains(event.relatedTarget)) {
      isPausedByFocus = false;
      start();
    }
  });

  // 絞り込みが変わったら、最初の1枚に戻す
  document.addEventListener('filter:change', () => {
    index = 0;
    renderDots();
    goTo(0, false);
    start();
  });

  // 画面幅が変わったとき（スマホ⇔タブレット以上）
  spQuery.addEventListener('change', () => {
    goTo(0, false);
    start();
  });

  // 別のタブを見ている間は止める
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // 「動きを減らす」設定の人は、一時停止状態から始める
  if (prefersReducedMotion.matches) {
    isPausedByUser = true;
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', '自動再生を再開');
  }

  renderDots();
  start();
}

/* ==========================================================
 * 5. スクロールでふわっと表示（.u-fade が付いた要素）
 * ========================================================== */
function initFadeIn() {
  const targets = document.querySelectorAll('.u-fade');
  if (targets.length === 0) return;

  // 対応していないブラウザでは、最初から表示しておく
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 一度表示したら監視をやめる
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
