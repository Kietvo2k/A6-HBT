"use client";

import { useMemo, useState } from "react";
import type { CollectionDataState, TimeCapsulePublic } from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import SectionHeading from "./SectionHeading";

type TimeCapsuleSectionProps = {
  capsules: TimeCapsulePublic[];
  dataState: CollectionDataState;
};

function getDefaultUnlockDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().slice(0, 10);
}

export default function TimeCapsuleSection({
  capsules,
  dataState,
}: TimeCapsuleSectionProps) {
  const [visibleCapsules, setVisibleCapsules] = useState(capsules);
  const [form, setForm] = useState({
    senderName: "",
    message: "",
    unlockDate: getDefaultUnlockDate(),
  });
  const [statusMessage, setStatusMessage] = useState(
    "Mỗi lời nhắn sẽ được khóa lại cho tới ngày mở. Trước ngày đó, public side chỉ nhìn thấy tên người gửi và ngày mở.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedCapsules = useMemo(
    () =>
      [...visibleCapsules].sort((left, right) =>
        left.unlockDate.localeCompare(right.unlockDate),
      ),
    [visibleCapsules],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/time-capsules", {
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
        throw new Error(
          payload?.error ?? "Không thể khóa lời nhắn vào hộp thời gian.",
        );
      }

      setVisibleCapsules((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          senderName: form.senderName,
          unlockDate: form.unlockDate,
          status: "locked",
          message: null,
          isOpened: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setForm({
        senderName: "",
        message: "",
        unlockDate: getDefaultUnlockDate(),
      });
      setStatusMessage("Đã khóa lời nhắn vào hộp thời gian rồi đó.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Không thể gửi time capsule lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="time-capsule"
      className="section-shell rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Time capsule"
            title="Khóa một lời nhắn cho tương lai"
            description="Những message chưa tới ngày mở sẽ không lộ nội dung. Khi đến ngày, website mới nhẹ nhàng hé mở từng lời nhắn."
          />

          <DataStateNotice message={dataState.message} />

          <form className="paper-card rounded-[2rem] p-5 sm:p-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                value={form.senderName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, senderName: event.target.value }))
                }
                required
                placeholder="Tên người gửi"
                className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
              />
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                required
                rows={5}
                placeholder="Viết điều bạn muốn gửi cho tương lai..."
                className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
              />
              <input
                type="date"
                value={form.unlockDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, unlockDate: event.target.value }))
                }
                required
                className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3"
              />
              <div className="rounded-[1.3rem] bg-[#fffdf7] px-4 py-3 text-sm text-muted">
                {statusMessage}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e7dbff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Đang khóa..." : "Khóa vào hộp thời gian"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {sortedCapsules.length > 0 ? (
            sortedCapsules.map((capsule) => (
              <article
                key={capsule.id}
                className="paper-card rounded-[2rem] p-5 sm:p-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6f5d90]">
                      {capsule.senderName}
                    </span>
                    <span className="rounded-full bg-[#fff5df] px-3 py-1 text-xs font-semibold text-[#b48247]">
                      Mở {new Date(capsule.unlockDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    {capsule.isOpened ? "Opened" : "Locked"}
                  </p>
                  <p className="text-sm leading-7 text-foreground">
                    {capsule.isOpened
                      ? capsule.message
                      : "Nội dung đang được khóa lại và sẽ chỉ hiện khi tới đúng ngày mở."}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
              <p className="text-lg font-semibold text-foreground">
                Chưa có time capsule nào
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Hãy gửi message đầu tiên cho tương lai của lớp mình.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
