import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SecretLetterRequestBody = {
  senderName?: string;
  targetMemberId?: string | null;
  message?: string;
  isAnonymous?: boolean;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        error:
          "Supabase chưa được cấu hình. Hộp thư bí mật cần database để lưu và moderation.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | SecretLetterRequestBody
    | null;
  const senderName = body?.senderName?.trim() ?? "";
  const message = body?.message?.trim() ?? "";
  const isAnonymous = Boolean(body?.isAnonymous);

  if (!message || message.length > 800) {
    return NextResponse.json(
      {
        error: "Thư bí mật cần có nội dung và nên ngắn hơn 800 ký tự.",
      },
      { status: 400 },
    );
  }

  if (!isAnonymous && !senderName) {
    return NextResponse.json(
      {
        error: "Nếu không gửi ẩn danh, vui lòng điền tên người gửi.",
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("secret_letters").insert({
    sender_name: isAnonymous ? null : senderName,
    target_member_id: body?.targetMemberId ?? null,
    message,
    is_anonymous: isAnonymous,
    status: "pending",
    is_public: false,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          "Không thể gửi thư bí mật tới Supabase. Hãy kiểm tra schema và RLS policy.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    pendingApproval: true,
  });
}
