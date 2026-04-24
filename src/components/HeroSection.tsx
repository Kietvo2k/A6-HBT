"use client";

import { motion } from "framer-motion";
import { Camera, HeartHandshake, NotebookPen, Sparkles } from "lucide-react";
import type { SiteConfig } from "@/data/siteData";

type HeroSectionProps = {
  siteConfig: SiteConfig;
  memberCount: number;
  memoryCount: number;
  timelineCount: number;
};

const heroStats = [
  { label: "Thành viên", value: (count: number) => `${count}+` },
  { label: "Khoảnh khắc", value: (count: number) => `${count}+` },
  { label: "Cột mốc", value: (count: number) => `${count}` },
] as const;

export default function HeroSection({
  siteConfig,
  memberCount,
  memoryCount,
  timelineCount,
}: HeroSectionProps) {
  const values = [memberCount, memoryCount, timelineCount];

  return (
    <section id="home" className="scroll-mt-28 pt-28 sm:pt-32">
      <div className="section-shell section-grid relative rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="sunbeam absolute -left-12 top-0 h-60 w-60 rounded-full" />
        <div className="absolute right-[-4%] top-10 h-64 w-64 rounded-full bg-rose/60 blur-3xl" />
        <div className="absolute bottom-0 left-[18%] h-40 w-40 rounded-full bg-sky/70 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <motion.div
              className="sticker inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Sparkles className="h-4 w-4 text-[#8b76ac]" />
              Ky yeu dien tu • {siteConfig.year}
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.65 }}
            >
              <h1 className="max-w-3xl text-4xl leading-tight text-shadow-sm sm:text-5xl lg:text-[4.3rem]">
                {siteConfig.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg lg:text-xl">
                {siteConfig.subtitle}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.65 }}
            >
              <a
                href="#members"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2eaff] px-6 py-3 text-sm font-semibold text-[#5d4e7d] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#eadfff]"
              >
                <NotebookPen className="h-4 w-4" />
                {siteConfig.heroCtaLabel}
              </a>
              <a
                href="#guestbook"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-white"
              >
                <HeartHandshake className="h-4 w-4 text-[#d37d96]" />
                Để lại lưu bút
              </a>
            </motion.div>

            <motion.div
              className="grid gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.65 }}
            >
              {heroStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="paper-card rounded-[1.7rem] px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {stat.value(values[index])}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative min-h-[380px] lg:min-h-[500px]"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.72 }}
          >
            <div className="paper-card absolute inset-x-7 top-8 rotate-[4deg] rounded-[2rem] p-4">
              <div className="rounded-[1.8rem] bg-[linear-gradient(160deg,#fffef8_0%,#eef6ff_48%,#ffeef3_100%)] p-5">
                <div className="mb-4 rounded-[1.6rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.72))] p-5 shadow-sm">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                        Yearbook cover
                      </p>
                      <h2 className="mt-2 text-3xl leading-tight">
                        {siteConfig.className}
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-[#fff8e9] p-3 text-[#d29a5d]">
                      <Camera className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-dashed border-[#d9d5ea] bg-[linear-gradient(180deg,rgba(218,238,255,0.5),rgba(255,255,255,0.72))] p-6">
                    <p className="font-display text-2xl italic text-[#5d5673]">
                      “Tuổi học trò đẹp nhất không phải vì hoàn hảo, mà vì mình
                      đã cùng nhau đi qua.”
                    </p>
                    <div className="soft-divider my-5" />
                    <p className="text-sm leading-7 text-muted">
                      Bộ khung Phase 1 đã sẵn sàng cho việc thay dữ liệu thật,
                      thêm ảnh thật và nâng cấp lên backend ở giai đoạn tiếp
                      theo.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted">
                  <span className="sticker rounded-full px-3 py-2">
                    {siteConfig.schoolName}
                  </span>
                  <span className="sticker rounded-full px-3 py-2">
                    Lưu giữ ký ức
                  </span>
                  <span className="sticker rounded-full px-3 py-2">
                    Responsive ready
                  </span>
                </div>
              </div>
            </div>

            <div className="sticker absolute -left-2 bottom-10 max-w-[220px] rotate-[-7deg] rounded-[1.8rem] p-4 sm:-left-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                Ghi chú nhỏ
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                Một chiếc website như cuốn sổ kỷ niệm mềm mại, dễ sửa, dễ thêm
                dữ liệu mới và đủ thoáng để kể tiếp các câu chuyện sau này.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
