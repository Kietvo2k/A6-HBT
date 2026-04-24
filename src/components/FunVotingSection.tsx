"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Member } from "@/data/siteData";
import { getOrCreateVoterKey } from "@/lib/voter-key";
import type {
  CollectionDataState,
  VoteCategoryWithResults,
} from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import SectionHeading from "./SectionHeading";

type FunVotingSectionProps = {
  categories: VoteCategoryWithResults[];
  members: Member[];
  dataState: CollectionDataState;
};

const VOTED_CATEGORIES_STORAGE_KEY = "yearbook-voted-categories";

function readVotedCategories() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const storedValue = window.localStorage.getItem(VOTED_CATEGORIES_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as string[]) : [];
  } catch {
    return [];
  }
}

function writeVotedCategories(categories: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    VOTED_CATEGORIES_STORAGE_KEY,
    JSON.stringify(categories),
  );
}

export default function FunVotingSection({
  categories,
  members,
  dataState,
}: FunVotingSectionProps) {
  const [categoryState, setCategoryState] = useState(() => categories);
  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [votedCategoryIds, setVotedCategoryIds] = useState<string[]>(
    readVotedCategories,
  );
  const [statusMessage, setStatusMessage] = useState(
    "Mỗi browser chỉ vote một lần cho mỗi category để giữ cuộc vui nhẹ nhàng và công bằng hơn.",
  );

  const activeCategory = useMemo(
    () =>
      categoryState.find((category) => category.id === activeCategoryId) ??
      categoryState[0],
    [activeCategoryId, categoryState],
  );

  const handleVote = async (member: Member) => {
    if (!activeCategory) {
      return;
    }

    if (votedCategoryIds.includes(activeCategory.id)) {
      setStatusMessage("Browser này đã vote cho category hiện tại rồi.");
      return;
    }

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: activeCategory.id,
          targetMemberId: member.id,
          voterKey: getOrCreateVoterKey(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Không thể lưu vote lúc này.");
      }

      const nextVotedCategoryIds = [...new Set([...votedCategoryIds, activeCategory.id])];
      writeVotedCategories(nextVotedCategoryIds);
      setVotedCategoryIds(nextVotedCategoryIds);
      setStatusMessage(`Vote cho "${member.name}" đã được ghi nhận.`);

      setCategoryState((current) =>
        current.map((category) => {
          if (category.id !== activeCategory.id) {
            return category;
          }

          const existingResult = category.results.find(
            (result) => result.memberId === member.id,
          );

          const nextResults = existingResult
            ? category.results.map((result) =>
                result.memberId === member.id
                  ? { ...result, count: result.count + 1 }
                  : result,
              )
            : [
                ...category.results,
                {
                  memberId: member.id,
                  memberName: member.name,
                  avatarUrl: member.avatarUrl,
                  count: 1,
                },
              ];

          return {
            ...category,
            totalVotes: category.totalVotes + 1,
            results: nextResults.sort((left, right) => right.count - left.count),
          };
        }),
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu vote lúc này.",
      );
    }
  };

  return (
    <section
      id="votes"
      className="section-shell rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeading
            eyebrow="Bình chọn vui"
            title="Một chút nghịch ngợm tích cực của tuổi học trò"
            description="Chỉ dùng những category vui, an toàn và dễ thương. Không có body-shaming, không có nội dung làm ai khó xử."
          />

          <div className="flex flex-wrap gap-2">
            {categoryState.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category.id === activeCategory?.id
                    ? "bg-[#f2eaff] text-[#62507f]"
                    : "bg-white/80 text-muted hover:bg-white hover:text-foreground"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <DataStateNotice message={dataState.message} />

        {activeCategory ? (
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <div className="rounded-[1.8rem] bg-white/70 p-5">
                <h3 className="text-2xl">{activeCategory.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {activeCategory.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#6a5a8d]">
                  Tổng vote hiện tại: {activeCategory.totalVotes}
                </p>
              </div>

              <div className="rounded-[1.8rem] bg-[#fffdf7] px-4 py-3 text-sm text-muted">
                {statusMessage}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => {
                  const isLocked = votedCategoryIds.includes(activeCategory.id);

                  return (
                    <button
                      key={member.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleVote(member)}
                      className="rounded-[1.7rem] border border-line bg-white/80 p-3 text-left transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="overflow-hidden rounded-[1.4rem]">
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          width={420}
                          height={500}
                          unoptimized
                          className="aspect-[4/5] h-auto w-full object-cover"
                        />
                      </div>
                      <div className="pt-4">
                        <p className="text-lg font-semibold text-foreground">
                          {member.name}
                        </p>
                        <p className="mt-1 text-sm text-muted">{member.nickname}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="paper-card rounded-[2rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                Kết quả category
              </p>
              <div className="mt-4 space-y-3">
                {activeCategory.results.length > 0 ? (
                  activeCategory.results.map((result, index) => (
                    <div
                      key={result.memberId}
                      className="flex items-center justify-between gap-4 rounded-[1.4rem] bg-white/80 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#f2eaff] px-3 py-2 text-xs font-semibold text-[#685a89]">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {result.memberName}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#6a5a8d]">
                        {result.count} vote
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.6rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
                    <p className="text-lg font-semibold text-foreground">
                      Chưa có vote nào
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Hãy là người đầu tiên bỏ phiếu cho category này.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-foreground">
              Chưa có vote category nào
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              Admin cần tạo ít nhất một category trong dashboard để public side
              bắt đầu bình chọn.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
