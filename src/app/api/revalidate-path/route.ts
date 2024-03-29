import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
// Example request
// http "localhost:3000/api/revalidate-path?pathToRevalidate=/api/time"
// http GET "localhost:3000/api/revalidate-path?pathToRevalidate=/api/pokemon/charizard"
// Zwykle rewaliduje sie sciezki na fromcie (nie api), ale z tego co probowalem to mozna i te.
// http GET "localhost:3000/api/revalidate-path?pathToRevalidate=/revalidation/path-revalidation"
export async function GET(request: NextRequest) {
  const pathToRevalidate = request.nextUrl.searchParams.get("pathToRevalidate");

  // remember that the referer header
  // is controlled by the client and can be changed or omitted by the client or proxy servers,
  //  so it is not always reliable for
  // security critical operations

  const referer = request.headers.get("referer");

  // OR
  // const headerList = headers();
  // const referer = headerList.get("referer"); // this is the incoming request URL

  // To revalidate pathToRevalidateParam (considered better)
  // if (pathToRevalidate) {

  // To revalidate basing on incoming request url
  if (referer) {
    const pathname =
      "/" + referer?.split("/").filter(Boolean).slice(2).join("/");

    revalidatePath(pathname);

    // Zeby zrewalidować wszystkie ścieki
    // revalidatePath("/", "layout");

    // revalidatePath(pathToRevalidate, "layout"); "layout lub page"
    // to jest przydatne glownie w dynamicznych sciezkach w folderach (nie api) gdzie
    // jest np. [slug]

    // Przykład z page
    // revalidatePath('/blog/[slug]', 'page')
    // or with route groups
    // revalidatePath('/(main)/post/[slug]', 'page')

    // This will revalidate any URL that matches the provided page file on the next page visit. This will not invalidate pages beneath the specific page. For example, /blog/[slug] won't invalidate /blog/[slug]/[author].

    // Przykład z layout
    // This will revalidate any URL that matches the provided layout file on the next page visit. This will cause pages beneath with the same layout to revalidate on the next visit. For example, in the above case, /blog/[slug]/[another] would also revalidate on the next visit.

    return Response.json({ revalidated: true, now: Date.now() });
  }
  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
