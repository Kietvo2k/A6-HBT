"use client";

import { startTransition, useEffect, useState } from "react";
import { HeartHandshake, NotebookPen, SendHorizontal } from "lucide-react";
import type { GuestbookMessage } from "@/data/siteData";
import {
  GUESTBOOK_MESSAGE_LIMIT,
  GUESTBOOK_NAME_LIMIT,
  validateGuestbookInput,
} from "@/lib/guestbook";
import { readLocalStorage, writeLocalStorage } from "@/lib/localStorage";
import type {
  CollectionDataState,
  GuestbookSubmissionMode,
} from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import SectionHeading from "./SectionHeading";

type GuestbookSectionProps = {
  initialMessages: GuestbookMessage[];
  dataState: CollectionDataState;
  submissionMode: GuestbookSubmissionMode;
};

type FormState = {
  name: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const GUESTBOOK_STORAGE_KEY = "yearbook-phase2-guestbook-local-fallback";

export default function GuestbookSection({
  initialMessages,
  dataState,
  submissionMode,
}: GuestbookSectionProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages);
  const [form, setForm] = useState<FormState>({ name: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    submissionMode === "database"
      ? "Viết một lời nhắn nho nhỏ. Tin nhắn mới sẽ được lưu vào database và chờ duyệt trước khi hiện công khai."
      : "Supabase chưa sẵn sàng, lời nhắn mới sẽ được lưu tạm trên trình duyệt để bạn tiếp tục test flow.",
  );

  useEffect(() => {
    if (submissionMode !== "local-fallback") {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const storedMessages = readLocalStorage<GuestbookMessage[]>(
        GUESTBOOK_STORAGE_KEY,
        initialMessages,
      );

      setMessages(storedMessages);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialMessages, submissionMode]);

  useEffect(() => {
    if (submissionMode !== "local-fallback") {
      return;
    }

    writeLocalStorage(GUESTBOOK_STORAGE_KEY, messages);
  }, [messages, submissionMode]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitGuestbookMessage();
  };

  const submitGuestbookMessage = async () => {
    const trimmedName = form.name.trim();
    const trimmedMessage = form.message.trim();
    const nextErrors = validateGuestbookInput(trimmedName, trimmedMessage);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage(
        "Còn một vài ô cần chỉnh lại trước khi lời nhắn được gửi đi.",
      );
      return;
    }

    setIsSubmitting(true);

    const newMessage: GuestbookMessage = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      if (submissionMode === "database") {
        const response = await fetch("/api/guestbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            message: trimmedMessage,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            payload?.error ??
              "Không thể gửi lời nhắn tới Supabase. Vui lòng kiểm tra cấu hình hoặc RLS policy.",
          );
        }

        setForm({ name: "", message: "" });
        setErrors({});
        setStatusMessage(
          "Lời nhắn đã được gửi vào database và đang chờ duyệt. Khi `is_approved = true`, nó sẽ xuất hiện công khai trong sổ lưu bút.",
        );
        return;
      }

      startTransition(() => {
        setMessages((current) => [newMessage, ...current]);
      });

      setForm({ name: "", message: "" });
      setErrors({});
      setStatusMessage(
        "Đã lưu tạm lời nhắn trên trình duyệt vì Supabase chưa được cấu hình.",
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Không thể gửi lời nhắn lúc này. Vui lòng thử lại sau.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  });

  return (
    <section
      id="guestbook"
      className="section-shell scroll-mt-28 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Lưu bút"
            title="Một góc để nhắn vài điều thật lòng"
            description="Phase 2 đã chuyển luồng gửi lưu bút sang database. Tin nhắn mới mặc định `is_approved = false`, sẵn sàng cho bước admin duyệt ở giai đoạn sau."
          />

          <DataStateNotice message={dataState.message} />

          <form
            className="paper-card rounded-[2rem] p-5 sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  Tên người gửi
                </span>
                <input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  maxLength={GUESTBOOK_NAME_LIMIT + 10}
                  className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-[#d6bddd] focus:bg-white"
                  placeholder="Ví dụ: Minh Anh"
                />
                <span className="text-xs text-muted">
                  {form.name.length}/{GUESTBOOK_NAME_LIMIT}
                </span>
                {errors.name ? (
                  <p className="text-sm text-[#bf5d76]">{errors.name}</p>
                ) : null}
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  Lời nhắn
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  maxLength={GUESTBOOK_MESSAGE_LIMIT + 20}
                  rows={5}
                  className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-[#d6bddd] focus:bg-white"
                  placeholder="Viết một câu chúc, một lời cảm ơn hoặc một mảnh ký ức nho nhỏ..."
                />
                <span className="text-xs text-muted">
                  {form.message.length}/{GUESTBOOK_MESSAGE_LIMIT}
                </span>
                {errors.message ? (
                  <p className="text-sm text-[#bf5d76]">{errors.message}</p>
                ) : null}
              </label>

              <div className="rounded-[1.3rem] bg-[#fffdf7] px-4 py-3 text-sm text-muted">
                {statusMessage}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:-translate-y-0.5 hover:bg-[#e9ddff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <SendHorizontal className="h-4 w-4" />
                {isSubmitting ? "Đang gửi..." : "Gửi vào lưu bút"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="paper-card rounded-[2rem] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#fff2f5] p-3 text-[#d47992]">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                  Sổ lưu bút
                </p>
                <p className="text-sm text-foreground">
                  {submissionMode === "database"
                    ? `${messages.length} lời nhắn đã được duyệt đang hiển thị từ Supabase.`
                    : `${messages.length} lời nhắn đang được lưu tạm trên trình duyệt.`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className="rounded-[1.6rem] border border-line bg-white/80 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#f6efff] p-2 text-[#7f6aa1]">
                          <NotebookPen className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {message.name}
                          </h3>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            {dateFormatter.format(new Date(message.createdAt))}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted">
                      {message.message}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
                  <p className="text-lg font-semibold text-foreground">
                    {submissionMode === "database"
                      ? "Chưa có lời nhắn nào được duyệt"
                      : "Chưa có lời nhắn nào cả"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {submissionMode === "database"
                      ? "Hãy gửi lời nhắn đầu tiên. Sau khi admin duyệt ở Phase 3, nội dung sẽ xuất hiện ở đây."
                      : "Hãy là người đầu tiên viết vài dòng cho tập thể lớp trong cuốn kỷ yếu này."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
