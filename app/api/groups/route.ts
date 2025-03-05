import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Extract the token from the request headers
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1]; // Remove "Bearer " prefix

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Verify the token
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.error("Authentication error:", authError);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name } = await request.json();

    console.log("Inserting group with:", { name, user_id: user.id });

    const { data, error } = await supabase
      .from("groups")
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
