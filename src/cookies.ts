import { Response } from "node-fetch";

/**
 * parseCookies
 *
 * @description Returns the cookies from the request in the right format
 *
 * @param response
 * @returns string
 */
function parseCookies(response: Response): string {
  const raw = response.headers.raw()["set-cookie"];
  return raw
    .map((entry: string) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(";");
}

export { parseCookies };
