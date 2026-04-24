"use client";

import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/data/siteData";
import SectionHeading from "./SectionHeading";

type RandomMemorySectionProps = {
  memories: Memory[];
  onOpenMemory: (memory: Memory) => void;
};

export default function RandomMemorySection({
  memories,
  onOpenMemory,
}: RandomMemorySectionProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(
    memories[0] ?? null,
  );

  const handleRandomize = () => {
    if (memories.length === 0) {
      return;
    }

    const nextMemory = memories[Math.floor(Math.random() * memories.length)];
    setSelectedMemory(nextMemory);
  };

  return (
    <div className="paper-card overflow-hidden rounded-[2rem] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="Random memory"
          title="Mở một ký ức ngẫu nhiên"
          description="Một nút nhỏ để website tự rút ra một khoảnh khắc bất kỳ, như kiểu lật trúng một trang rất quen trong cuốn kỷ yếu."
        />

        <div className="rounded-[1.7rem] bg-white/80 p-5">
          {selectedMemory ? (
            <motion.div
              key={selectedMemory.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="rounded-full bg-[#fff7ea] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b48247]">
                {selectedMemory.date}
              </div>
              <div>
                <h3 className="text-2xl">{selectedMemory.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {selectedMemory.caption}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e7dbff]"
                >
                  <Shuffle className="h-4 w-4" />
                  Mở ký ức khác
                </button>
                <button
                  type="button"
                  onClick={() => onOpenMemory(selectedMemory)}
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
                >
                  Xem chi tiết
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-line bg-white/70 px-5 py-10 text-center">
              <p className="text-lg font-semibold text-foreground">
                Chưa có memory nào để random
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Hãy thêm dữ liệu vào bảng `memories` để tính năng này bắt đầu
                hoạt động.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
