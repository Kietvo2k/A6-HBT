import { NextResponse } from "next/server";
import type { ReactionTargetType } from "@/types/yearbook";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReactionRequestBody = {
  targetType?: ReactionTargetType;
  targetId?: string;
  voterKey?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        error: "Supabase chưa được cấu hình nên chưa thể lưu reaction.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | ReactionRequestBody
    | null;
  const targetType = body?.targetType;
  const targetId = body?.targetId?.trim() ?? "";
  const voterKey = body?.voterKey?.trim() ?? "";

  if (!targetType || !targetId || !voterKey) {
    return NextResponse.json(
      {
        error: "Thiếu dữ liệu reaction cần thiết.",
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reactions").insert({
    target_type: targetType,
    target_id: targetId,
    reaction_type: "love",
    voter_key: voterKey,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.code === "23505"
            ? "Bạn đã thả tim cho mục này rồi."
            : "Không thể lưu reaction lúc này.",
      },
      { status: error.code === "23505" ? 409 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
