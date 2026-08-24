// 公開サイトに出したくないファイルへのアクセスを 404 にする Edge Function。
//
// サイトの公開フォルダはリポジトリのルートなので、担当者向けのマニュアルや
// 記事の原稿（content.md）まで、URLを直接叩けば読めてしまう。
// それらを配信対象から外すのがこの関数の役割。
// GitHub上のファイルは消さないので、担当者の編集作業には影響しない。

const HIDDEN = [
  /\.md$/i,          // 担当者マニュアル・記事の原稿
  /^\/\.claude\//i,  // Claude Code の設定・Skill
  /^\/_template\//i, // 記事のひな形
  /^\/netlify/i,     // netlify.toml と Edge Function 自身
];

export default async (request: Request): Promise<Response | void> => {
  const path = decodeURIComponent(new URL(request.url).pathname);
  if (HIDDEN.some((re) => re.test(path))) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
    });
  }
  // 該当しなければ何も返さず、通常のサイト表示へ通す
};

export const config = { path: "/*" };
