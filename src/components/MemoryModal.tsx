"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Tag, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import type { Memory } from "@/data/siteData";

type MemoryModalProps = {
  memory: Memory | null;
  onClose: () => void;
};

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  useEffect(() => {
    if (!memory) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4f4764]/45 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={memory.title}
            className="paper-card relative w-full max-w-4xl overflow-hidden rounded-[2rem] p-4 sm:p-5"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-white"
              onClick={onClose}
              aria-label="Đóng ảnh"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-[1.7rem] bg-white/70">
                <Image
                  src={memory.imageUrl}
                  alt={memory.title}
                  width={640}
                  height={420}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between gap-6 rounded-[1.7rem] bg-white/70 p-5">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ff] px-3 py-2 text-xs font-semibold text-[#74628f]">
                      <Tag className="h-4 w-4" />
                      {memory.category}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7e8] px-3 py-2 text-xs font-semibold text-[#b08047]">
                      <CalendarDays className="h-4 w-4" />
                      {memory.date}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl leading-tight">{memory.title}</h3>
                    <p className="text-base leading-8 text-muted">
                      {memory.caption}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-[#fffdf7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Note ảnh
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    Đây đang là ảnh placeholder local/static. Chỉ cần đổi
                    `imageUrl` trong `src/data/siteData.ts` là gallery sẽ chuyển
                    ngay sang ảnh thật mà không cần sửa component.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
