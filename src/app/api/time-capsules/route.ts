import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TimeCapsuleRequestBody = {
  senderName?: string;
  message?: string;
  unlockDate?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        error: "Supabase chưa được cấu hình nên chưa thể khóa message vào time capsule.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | TimeCapsuleRequestBody
    | null;
  const senderName = body?.senderName?.trim() ?? "";
  const message = body?.message?.trim() ?? "";
  const unlockDate = body?.unlockDate?.trim() ?? "";

  if (!senderName || !message || !unlockDate) {
    return NextResponse.json(
      {
        error: "Time capsule cần tên, lời nhắn và ngày mở.",
      },
      { status: 400 },
    );
  }

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  if (unlockDate < todayIso) {
    return NextResponse.json(
      {
        error: "Ngày mở cần từ hôm nay trở đi.",
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("time_capsules").insert({
    sender_name: senderName,
    message,
    unlock_date: unlockDate,
    status: "locked",
  });

  if (error) {
    return NextResponse.json(
      {
        error: "Không thể lưu time capsule vào Supabase.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
