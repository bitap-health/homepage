/* スマホのヘッダーを「ロゴ＋メニューボタン」の1段にする。
 *
 * ヘッダーのHTMLは全ページに同じものが書かれているので、ボタンはここで差し込む。
 * 記事を増やしてもこのファイルを読み込んでいれば同じように動く。
 *
 * JSが動かない環境では js-nav が付かず、リンクが従来どおり並ぶだけになる。
 * ナビゲーションが消えてしまわないよう、隠す指定は js-nav の下にだけ書いてある。 */

document.documentElement.classList.add('js-nav');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const nav = header && header.querySelector('nav');
  const list = nav && nav.querySelector('.nav-links');
  if (!list) return;

  list.id = 'nav-links';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-controls', 'nav-links');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);

  const 切り替え = 開く => {
    header.classList.toggle('is-open', 開く);
    btn.setAttribute('aria-expanded', String(開く));
    btn.setAttribute('aria-label', 開く ? 'メニューを閉じる' : 'メニューを開く');
  };
  切り替え(false);

  btn.addEventListener('click', () => 切り替え(!header.classList.contains('is-open')));

  /* 行き先を選んだら閉じる。同じページ内のリンクだと画面が変わらないため */
  list.addEventListener('click', e => { if (e.target.closest('a')) 切り替え(false); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') 切り替え(false); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) 切り替え(false); });

  /* 画面が広がってボタン自体が消えたときに、開いた状態が残らないようにする */
  const 広い = matchMedia('(min-width: 901px)');
  広い.addEventListener('change', e => { if (e.matches) 切り替え(false); });
});
