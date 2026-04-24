"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TimelineEvent } from "@/data/siteData";
import type { CollectionDataState } from "@/types/yearbook";
import DataStateNotice from "./DataStateNotice";
import SectionHeading from "./SectionHeading";

type TimelineSectionProps = {
  events: TimelineEvent[];
  dataState: CollectionDataState;
};

export default function TimelineSection({
  events,
  dataState,
}: TimelineSectionProps) {
  return (
    <section
      id="timeline"
      className="section-shell scroll-mt-28 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="space-y-10">
        <SectionHeading
          eyebrow="Dòng thời gian"
          title="Những cột mốc làm thanh xuân có hình dáng riêng"
          description="Timeline dọc vẫn được giữ nguyên về giao diện, nhưng Phase 2 đã sẵn sàng đọc các cột mốc kỷ niệm từ Supabase."
        />

        <DataStateNotice message={dataState.message} />

        {events.length > 0 ? (
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-[linear-gradient(180deg,rgba(221,127,157,0.1),rgba(126,108,160,0.42),rgba(110,170,215,0.12))] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-6 md:space-y-8">
              {events.map((event, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    className={`relative md:grid md:grid-cols-2 md:gap-10 ${
                      isLeft ? "" : "md:[&>*:first-child]:col-start-2"
                    }`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="pl-10 md:pl-0">
                      <article className="paper-card overflow-hidden rounded-[2rem]">
                        <div className="rounded-[2rem] bg-white/80 p-5">
                          <div className="mb-4 inline-flex rounded-full bg-[#fff4f7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c06a86]">
                            {event.date}
                          </div>
                          <h3 className="text-2xl leading-tight">
                            {event.title}
                          </h3>
                          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                            {event.description}
                          </p>

                          {event.imageUrl ? (
                            <div className="mt-5 overflow-hidden rounded-[1.6rem]">
                              <Image
                                src={event.imageUrl}
                                alt={event.title}
                                width={640}
                                height={420}
                                unoptimized
                                className="aspect-[16/10] h-auto w-full object-cover"
                              />
                            </div>
                          ) : null}
                        </div>
                      </article>
                    </div>

                    <span className="absolute left-1 top-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#fff8fb] bg-[#d47992] shadow-[0_10px_20px_rgba(212,121,146,0.28)] md:left-1/2 md:-translate-x-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-foreground">
              Chưa có cột mốc nào trong Supabase
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              Hãy thêm bản ghi vào `timeline_events` hoặc chạy seed SQL để
              timeline hiển thị dữ liệu thật.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
