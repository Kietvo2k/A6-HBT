import { NextResponse } from "next/server";
import {
  GUESTBOOK_MESSAGE_LIMIT,
  GUESTBOOK_NAME_LIMIT,
  validateGuestbookInput,
} from "@/lib/guestbook";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type GuestbookRequestBody = {
  name?: string;
  message?: string;
  targetMemberId?: string | null;
  isAnonymous?: boolean;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        error:
          "Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | GuestbookRequestBody
    | null;

  const name = body?.name?.trim() ?? "";
  const message = body?.message?.trim() ?? "";
  const validationErrors = validateGuestbookInput(name, message);

  if (Object.keys(validationErrors).length > 0) {
    return NextResponse.json(
      {
        error:
          validationErrors.name ??
          validationErrors.message ??
          `Tên người gửi tối đa ${GUESTBOOK_NAME_LIMIT} ký tự và lời nhắn tối đa ${GUESTBOOK_MESSAGE_LIMIT} ký tự.`,
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("guestbook_messages").insert({
    sender_name: name,
    message,
    target_member_id: body?.targetMemberId ?? null,
    is_anonymous: Boolean(body?.isAnonymous),
    status: "pending",
    is_approved: false,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          "Supabase từ chối lưu lời nhắn. Hãy kiểm tra schema, RLS policy và env variables.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    pendingApproval: true,
  });
}
