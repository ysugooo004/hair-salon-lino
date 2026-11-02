# hair salon Lino（架空の美容室サイト）

富山県高岡市にある「髪質改善・白髪ぼかし専門サロン」を想定した、ポートフォリオ用のWebサイトです。

**公開URL：https://yasu-web.com/works/lino/**

> ※ 本サイトは架空の店舗です。店舗情報・料金・お客様の声などはすべてダミーで、実際の予約や問い合わせはできません。

## 技術構成

- HTML / SCSS（FLOCSS ＋ BEM）/ JavaScript（ライブラリなし）
- SCSS のコンパイル：VS Code 拡張機能「Live Sass Compiler」（Dart Sass でも可）
- コード管理：GitHub
- 公開：レンタルサーバー（サブドメイン）

## ページ

| ファイル | ページ |
|---|---|
| `index.html` | トップページ |
| `menu.html` | メニュー・料金 |
| `news.html` | お知らせ一覧 |

## フォルダ構成

```
hair-salon-lino/
├─ index.html / menu.html / news.html
├─ assets/
│  ├─ scss/                 … 編集するのはここ
│  │  ├─ style.scss         … すべてを読み込む親ファイル
│  │  ├─ foundation/        … _settings（色・フォント・mixin）/ _reset / _base
│  │  ├─ layout/            … l-container / l-section / l-notice / l-header /
│  │  │                        l-drawer / l-footer / l-fixed-cta
│  │  └─ object/
│  │     ├─ component/      … c-button / c-heading / c-card など部品
│  │     ├─ project/        … _top（トップ）/ _menu-page / _news-page
│  │     └─ utility/        … u-visually-hidden / u-sp-only / u-fade など
│  ├─ css/style.css         … 自動生成（直接編集しない）
│  ├─ js/main.js            … ドロワー・スライダー・絞り込み・ダミー予約の案内
│  └─ images/               … 写真（WebP）・OGP画像・ファビコン
├─ .vscode/settings.json    … Live Sass Compiler の設定
└─ README.md
```

## 作業のしかた

1. VS Code でこのフォルダを開く
2. 画面下の「Watch Sass」をクリック（SCSS の自動変換が始まる）
3. `assets/scss/` 内のファイルを編集・保存 → `assets/css/style.css` が更新される
4. 確認はブラウザ（VS Code の Live Server など）で行う

### よく触る場所

| やりたいこと | 編集するファイル |
|---|---|
| 色・フォント・ブレイクポイントを変える | `assets/scss/foundation/_settings.scss` |
| ボタンの見た目を変える | `assets/scss/object/component/_button.scss` |
| トップの各セクションの見た目を変える | `assets/scss/object/project/_top.scss` |
| 料金・メニューを変える | `index.html`（おすすめ）と `menu.html` |
| お知らせを追加する | `news.html` に `<article>` を追加し、トップの一覧も更新 |

## 機能

- スマホ・タブレット（1280px未満）：ハンバーガーメニュー（Escキーで閉じる・フォーカスが外に出ない）
- スマホ（768px未満）：画面下に「電話／WEB予約」の固定バー
- スタイルギャラリー：スマホは5秒ごとに切り替わるスライダー（一時停止ボタン付き）、タブレット以上は一覧表示
- 絞り込み：スタイル（髪質改善／白髪ぼかし）、お知らせ（お休み／メニュー）
- 予約・電話・LINE・SNSのボタン：押すと「サンプルサイトのため利用できません」と表示
- よくある質問：アコーディオン（HTML標準の `<details>`）
- スクロールでふわっと表示（「動きを減らす」設定の人には動きなし）
- PCのみのホバー表現（マウス操作ができる端末だけに効く）

## 写真

Unsplash の無料写真（[Unsplash License](https://unsplash.com/license)：商用利用可・クレジット表記は任意）を、サイト用のサイズに切り抜いて WebP に変換して使っています。
人物はイメージ写真で、実在のスタッフ・お客様ではありません。
同じファイル名・同じ比率の写真に差し替えるだけで、別の写真にも変更できます。

| ファイル名 | 使用箇所 | サイズ（比率） |
|---|---|---|
| fv-pc.webp | FV（PC） | 1600×1067（3:2） |
| fv-sp.webp | FV（スマホ・タブレット） | 800×1000（4:5） |
| concept.webp / concept-sm.webp | コンセプト（スマホは軽い sm 版を表示） | 1200×900 / 600×450（4:3） |
| strength-01〜03.webp | 選ばれる理由 | 800×600（4:3） |
| flow-01〜05.webp | 施術の流れ | 800×500（16:10） |
| style-01〜04.webp | スタイルギャラリー | 600×800（3:4） |
| staff-owner.webp / staff-assistant.webp | スタッフ | 600×750（4:5） |
| access-exterior.webp / access-parking.webp | アクセス | 800×600（4:3） |
| news-autumn.webp | お知らせ一覧 | 800×600（4:3） |
| ogp.jpg | SNSシェア用画像 | 1200×630 |

### 写真素材の出典

| ファイル名 | 出典 | 撮影者 |
|---|---|---|
| fv-pc.webp / fv-sp.webp | [Unsplash](https://unsplash.com/photos/XFUx2xS781c) | Muhammad Ruqi Yaddin |
| concept.webp | [Unsplash](https://unsplash.com/photos/g0cSOCHaHiY) | Alexander Mass |
| strength-01.webp | [Unsplash](https://unsplash.com/photos/x1UvHQ-OWvw) | Lindsay Cash |
| strength-02.webp | [Unsplash](https://unsplash.com/photos/NYpC-nLLxQw) | mayank sharma |
| strength-03.webp | [Unsplash](https://unsplash.com/photos/KMvUcGanzPc) | Daniel |
| flow-01.webp | [Unsplash](https://unsplash.com/photos/PnDr2j28gXA) | Daniel |
| flow-02.webp | [Unsplash](https://unsplash.com/photos/SVj9PxypDtc) | Sasun Bughdaryan |
| flow-03.webp | [Unsplash](https://unsplash.com/photos/WXmHwPcFamo) | Adam Winger |
| flow-04.webp | [Unsplash](https://unsplash.com/photos/WCPg9ROZbM0) | Element5 Digital |
| flow-05.webp | [Unsplash](https://unsplash.com/photos/FkAZqQJTbXM) | Adam Winger |
| style-01.webp | [Unsplash](https://unsplash.com/photos/TcWwRcf92GY) | Lu |
| style-02.webp | [Unsplash](https://unsplash.com/photos/fOiLgFnfxcg) | "Jessie Dee" Dabrowski |
| style-03.webp | [Unsplash](https://unsplash.com/photos/VfOw1B-y_rQ) | Suhyeon Choi |
| style-04.webp | [Unsplash](https://unsplash.com/photos/KBoUUqE97r8) | Lera Kogan |
| staff-owner.webp | [Unsplash](https://unsplash.com/photos/N6Pfi3d8duc) | oktavianus mulyadi |
| staff-assistant.webp | [Unsplash](https://unsplash.com/photos/jGZITdFhmts) | Le Minh Phuong |
| access-exterior.webp | [Unsplash](https://unsplash.com/photos/ChE4whuEc9g) | T |
| access-parking.webp | [Unsplash](https://unsplash.com/photos/yvfp5YHWGsc) | John Matychuk |
| news-autumn.webp | [Unsplash](https://unsplash.com/photos/dnpa8k6TGRE) | Paul Siewert |

## 公開

- 公開URL：https://yasu-web.com/works/lino/
- 架空店舗のため、検索エンジンには載せない設定（`<meta name="robots" content="noindex">` と `.htaccess` の `X-Robots-Tag`）

### 本番用ビルド

```
npm install      # 最初の1回だけ
npm run build    # dist/ フォルダが作り直される
```

`dist/` には、圧縮したCSS・JavaScript、HTML、画像、`.htaccess` が入ります。
**この `dist/` の中身を**、サーバーの `yasu-web.com/public_html/works/lino/` にアップロードします。

### 更新の流れ

1. `assets/scss` や HTML を編集
2. `npm run build`
3. GitHub Desktop でコミット＆プッシュ
4. `dist/` の中身をFTPでアップロード（上書き）
