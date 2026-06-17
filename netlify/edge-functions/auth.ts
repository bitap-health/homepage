// サイト全体に Basic 認証（ID・パスワード）のゲートをかける Edge Function。
// 正式公開する際は、この netlify/edge-functions フォルダ（または netlify.toml の
// [[edge_functions]] 設定）を削除して push すれば、ゲートは完全に外れます。
//
// パスワードは Netlify の環境変数 SITE_PASSWORD から読み込みます（コードには書きません）。
// 環境変数が未設定の場合は、安全側に倒して全アクセスを拒否します（＝外部から中身が見えない）。

const USER = "bitap";

export default async (request: Request): Promise<Response | void> => {
  const password = Netlify.env.get("SITE_PASSWORD");

  const header = request.headers.get("authorization");
  if (password && header) {
    const expected = "Basic " + btoa(`${USER}:${password}`);
    if (header === expected) {
      // 認証成功 → 何も返さずに通常のサイト表示へ通す
      return;
    }
  }

  // 未認証 → ブラウザにログイン窓を出す（401）
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="BitaP preview", charset="UTF-8"',
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
};

export const config = { path: "/*" };
