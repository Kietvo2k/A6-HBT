"use client";

import { motion } from "framer-motion";
import { Expand, Tag } from "lucide-react";
import Image from "next/image";
import type { Memory } from "@/data/siteData";
import LoveReactionButton from "./LoveReactionButton";

type MemoryCardProps = {
  memory: Memory;
  onSelect: (memory: Memory) => void;
  index: number;
  reactionCount: number;
};

export default function MemoryCard({
  memory,
  onSelect,
  index,
  reactionCount,
}: MemoryCardProps) {
  return (
    <motion.article
      className="group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
    >
      <article className="paper-card overflow-hidden rounded-[2rem] p-3">
        <div className="rounded-[1.6rem] bg-white/80 p-3">
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => onSelect(memory)}
          >
            <div className="relative overflow-hidden rounded-[1.4rem]">
              <Image
                src={memory.imageUrl}
                alt={memory.title}
                width={640}
                height={420}
                unoptimized
                className="aspect-[4/3] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {memory.date}
              </div>
            </div>

            <div className="space-y-4 px-1 pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl leading-tight">{memory.title}</h3>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f5f7ff] px-3 py-1 text-xs font-semibold text-[#6d7692]">
                    <Tag className="h-3.5 w-3.5" />
                    {memory.category}
                  </div>
                </div>
                <span className="rounded-full border border-line bg-white/80 p-2 text-muted transition group-hover:text-foreground">
                  <Expand className="h-4 w-4" />
                </span>
              </div>

              <p className="text-sm leading-7 text-muted">{memory.caption}</p>
            </div>
          </button>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 px-1 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Love reaction
            </p>
            <LoveReactionButton
              targetType="memory"
              targetId={memory.id}
              initialCount={reactionCount}
              compact
            />
          </div>
        </div>
      </article>
    </motion.article>
  );
}
