import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("group_id", params.groupId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
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

    const { description, amount } = await request.json();

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          description,
          amount,
          group_id: params.groupId,
          user_id: user.id,
          user_email: user.email,
        },
      ])
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
