"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import type { Member } from "@/data/siteData";
import LoveReactionButton from "./LoveReactionButton";

type MemberCardProps = {
  member: Member;
  reactionCount: number;
  index: number;
};

export default function MemberCard({
  member,
  reactionCount,
  index,
}: MemberCardProps) {
  return (
    <motion.article
      className="paper-card group overflow-hidden rounded-[2rem] p-4"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05, duration: 0.55 }}
    >
      <div className="rounded-[1.6rem] bg-white/75 p-3 shadow-sm">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,#eef6ff_0%,#fff8fb_100%)]">
          <Image
            src={member.avatarUrl}
            alt={member.name}
            width={420}
            height={500}
            unoptimized
            className="aspect-[4/5] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            @{member.nickname}
          </div>
        </div>

        <div className="space-y-4 px-1 pb-2 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl">{member.name}</h3>
              <p className="mt-1 text-sm text-muted">{member.nickname}</p>
            </div>
            <LoveReactionButton
              targetType="member"
              targetId={member.id}
              initialCount={reactionCount}
              compact
            />
          </div>

          <div className="rounded-[1.5rem] bg-[#fffdf7] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#d29a5d]">
              <Quote className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                Quote
              </span>
            </div>
            <p className="font-display text-lg italic text-[#5f586f]">
              {member.quote}
            </p>
          </div>

          <p className="text-sm leading-7 text-muted">{member.shortBio}</p>

          <div className="flex flex-wrap gap-2">
            {member.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full bg-[#f4efff] px-3 py-2 text-xs font-semibold text-[#705f8f]"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
