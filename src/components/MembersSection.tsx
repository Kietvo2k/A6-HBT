"use client";

import type { Member } from "@/data/siteData";
import type { CollectionDataState } from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import MemberCard from "./MemberCard";
import SectionHeading from "./SectionHeading";

type MembersSectionProps = {
  members: Member[];
  dataState: CollectionDataState;
  reactionCounts: Record<string, number>;
};

export default function MembersSection({
  members,
  dataState,
  reactionCounts,
}: MembersSectionProps) {
  return (
    <section
      id="members"
      className="section-shell scroll-mt-28 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Thành viên"
          title="Những gương mặt làm nên màu sắc của lớp"
          description="Yearbook card vẫn giữ tinh thần mềm mại ban đầu, nhưng nút thả tim giờ đã lưu database, có count thật và giới hạn spam theo browser."
        />

        <DataStateNotice message={dataState.message} />

        {members.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                reactionCount={reactionCounts[member.id] ?? 0}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-foreground">
              Chưa có thành viên nào trong cơ sở dữ liệu
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              Hãy thêm bản ghi vào bảng `members` trong Supabase, giao diện hiện
              tại sẽ render ngay mà không cần đổi component.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
