/**
 * 本番用ビルド（公開用フォルダ dist/ を作る）
 *
 *   npm install      … 最初の1回だけ（必要な道具をインストール）
 *   npm run build    … dist/ を作り直す
 *
 * やっていること
 *   1. dist/ を空にする
 *   2. SCSS → 圧縮したCSS（古いブラウザ向けの記述も自動で追加）
 *   3. JavaScript を圧縮
 *   4. HTML・画像・.htaccess をコピー
 * 元のファイル（assets/scss など）は変更しません。
 */
import fs from 'node:fs';
import path from 'node:path';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { minify } from 'terser';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const kb = (file) => `${(fs.statSync(file).size / 1024).toFixed(1)}KB`;

// 1. dist/ を空にする
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(dist, 'assets/js'), { recursive: true });

// 2. CSS
const { css } = sass.compile(path.join(root, 'assets/scss/style.scss'), { style: 'compressed' });
const prefixed = await postcss([autoprefixer]).process(css, { from: undefined });
const cssOut = path.join(dist, 'assets/css/style.css');
fs.writeFileSync(cssOut, prefixed.css);
console.log('CSS  ', kb(cssOut));

// 3. JavaScript
const js = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
const jsOut = path.join(dist, 'assets/js/main.js');
fs.writeFileSync(jsOut, (await minify(js, { compress: true, mangle: true })).code);
console.log('JS   ', kb(jsOut));

// 4. HTML・画像・.htaccess
//    CSS・JSのURLに日付を付けて、更新時に古いキャッシュが使われないようにする
const version = new Date().toISOString().slice(0, 16).replace(/\D/g, '');
for (const file of ['index.html', 'menu.html', 'news.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8')
    .replace('assets/css/style.css', `assets/css/style.css?v=${version}`)
    .replace('assets/js/main.js', `assets/js/main.js?v=${version}`);
  fs.writeFileSync(path.join(dist, file), html);
}
fs.cpSync(path.join(root, 'assets/images'), path.join(dist, 'assets/images'), {
  recursive: true,
  filter: (src) => !src.endsWith('.gitkeep'),
});
fs.copyFileSync(path.join(root, 'server/.htaccess'), path.join(dist, '.htaccess'));

console.log('dist/ を作成しました。この中身をサーバーの /works/lino/ にアップロードします。');
