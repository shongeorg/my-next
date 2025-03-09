"use server";

import { NextApiRequest } from "next";
import absoluteUrl from "next-absolute-url";

export async function fetchDataFromApi(req: NextApiRequest) {
  const { origin } = absoluteUrl(req);
  const absoluteApiUrl = `${origin}/api/posts`;

  const response = await fetch(absoluteApiUrl);
  return response.json();
}
