"use client";

import { useDeferredValue, useState } from "react";
import type { Memory, MemoryFilter } from "@/data/siteData";
import { memoryCategories } from "@/data/siteData";
import type { CollectionDataState } from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import MemoryCard from "./MemoryCard";
import MemoryModal from "./MemoryModal";
import RandomMemorySection from "./RandomMemorySection";
import SectionHeading from "./SectionHeading";

type MemoriesSectionProps = {
  memories: Memory[];
  dataState: CollectionDataState;
  reactionCounts: Record<string, number>;
};

export default function MemoriesSection({
  memories,
  dataState,
  reactionCounts,
}: MemoriesSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<MemoryFilter>("Tất cả");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const deferredCategory = useDeferredValue(activeCategory);

  const filteredMemories =
    deferredCategory === "Tất cả"
      ? memories
      : memories.filter((memory) => memory.category === deferredCategory);

  return (
    <section
      id="memories"
      className="section-shell scroll-mt-28 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeading
            eyebrow="Khoảnh khắc"
            title="Một album nhỏ cho những ngày tháng rất đẹp"
            description="Gallery vẫn giữ filter, modal và bố cục polaroid, đồng thời có thêm random memory và love reaction để mỗi lần ghé vào đều có gì đó mới."
          />

          <div className="flex flex-wrap gap-2">
            {memoryCategories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#f2eaff] text-[#62507f]"
                      : "bg-white/80 text-muted hover:bg-white hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <DataStateNotice message={dataState.message} />

        <RandomMemorySection
          memories={memories}
          onOpenMemory={setSelectedMemory}
        />

        {filteredMemories.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMemories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onSelect={setSelectedMemory}
                index={index}
                reactionCount={reactionCounts[memory.id] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-foreground">
              {memories.length === 0
                ? "Chưa có khoảnh khắc nào trong Supabase"
                : "Bộ lọc này chưa có ảnh phù hợp"}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {memories.length === 0
                ? "Hãy thêm dữ liệu vào bảng `memories` hoặc chạy seed SQL để gallery hiển thị."
                : "Thử chuyển sang category khác hoặc thêm thêm dữ liệu ảnh cho nhóm này."}
            </p>
          </div>
        )}
      </div>

      <MemoryModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </section>
  );
}
