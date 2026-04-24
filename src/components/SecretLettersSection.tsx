"use client";

import { useState } from "react";
import type { Member } from "@/data/siteData";
import type { CollectionDataState, SecretLetterPublic } from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import SectionHeading from "./SectionHeading";

type SecretLettersSectionProps = {
  letters: SecretLetterPublic[];
  members: Member[];
  dataState: CollectionDataState;
};

export default function SecretLettersSection({
  letters,
  members,
  dataState,
}: SecretLettersSectionProps) {
  const [form, setForm] = useState({
    senderName: "",
    targetMemberId: "",
    message: "",
    isAnonymous: false,
  });
  const [statusMessage, setStatusMessage] = useState(
    "Viết một lá thư nhỏ cho cả lớp hoặc cho một người bạn trong lớp. Nội dung mới sẽ chờ admin duyệt trước khi xuất hiện công khai.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/secret-letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Không thể gửi thư bí mật.");
      }

      setForm({
        senderName: "",
        targetMemberId: "",
        message: "",
        isAnonymous: false,
      });
      setStatusMessage(
        "Thư đã được gửi và đang chờ admin duyệt. Khi được approve và bật public, nó sẽ xuất hiện trong hộp thư phía dưới.",
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Không thể gửi thư bí mật lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="secret-letters"
      className="section-shell rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Hộp thư bí mật"
            title="Một chỗ để gửi những điều ngại nói thành lời"
            description="Bạn có thể gửi cho cả lớp hoặc cho một thành viên cụ thể. Nội dung luôn đi qua moderation trước khi public để giữ sự an toàn và dễ chịu cho mọi người."
          />

          <DataStateNotice message={dataState.message} />

          <form className="paper-card rounded-[2rem] p-5 sm:p-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Tên người gửi</span>
                <input
                  value={form.senderName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, senderName: event.target.value }))
                  }
                  placeholder="Ví dụ: Một người bạn cùng lớp"
                  className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Gửi tới</span>
                <select
                  value={form.targetMemberId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      targetMemberId: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
                >
                  <option value="">Cả lớp</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Nội dung thư</span>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  rows={5}
                  required
                  className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
                  placeholder="Viết điều bạn muốn gửi cho lớp hoặc cho một người bạn..."
                />
              </label>

              <label className="inline-flex items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isAnonymous: event.target.checked,
                    }))
                  }
                />
                Gửi ẩn danh
              </label>

              <div className="rounded-[1.3rem] bg-[#fffdf7] px-4 py-3 text-sm text-muted">
                {statusMessage}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e7dbff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi thư bí mật"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {letters.length > 0 ? (
            letters.map((letter) => (
              <article
                key={letter.id}
                className="paper-card rounded-[2rem] p-5 sm:p-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6f5d90]">
                      {letter.targetMemberName || "Cả lớp"}
                    </span>
                    <span className="rounded-full bg-[#fff5df] px-3 py-1 text-xs font-semibold text-[#b48247]">
                      {new Date(letter.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="font-display text-xl italic text-[#5f586f]">
                    “{letter.message}”
                  </p>
                  <p className="text-sm text-muted">Từ {letter.displayName}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
              <p className="text-lg font-semibold text-foreground">
                Chưa có thư nào được duyệt công khai
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Những lá thư mới sẽ xuất hiện ở đây sau khi admin duyệt và cho
                phép hiển thị public.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
