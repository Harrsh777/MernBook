import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export function supabaseServer() {
  const cookieStore = cookies();
  // Next.js requires dynamic APIs like cookies() to be read once,
  // then passed as a function into auth-helpers.
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
}


