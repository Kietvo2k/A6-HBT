import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type VoteRequestBody = {
  categoryId?: string;
  targetMemberId?: string;
  voterKey?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        error: "Supabase chưa được cấu hình nên chưa thể lưu vote.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as VoteRequestBody | null;
  const categoryId = body?.categoryId?.trim() ?? "";
  const targetMemberId = body?.targetMemberId?.trim() ?? "";
  const voterKey = body?.voterKey?.trim() ?? "";

  if (!categoryId || !targetMemberId || !voterKey) {
    return NextResponse.json(
      {
        error: "Thiếu dữ liệu vote cần thiết.",
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("votes").insert({
    category_id: categoryId,
    target_member_id: targetMemberId,
    voter_key: voterKey,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.code === "23505"
            ? "Trình duyệt này đã vote cho category này rồi."
            : "Không thể lưu vote lúc này.",
      },
      { status: error.code === "23505" ? 409 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
