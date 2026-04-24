"use client";

import { AnimatePresence, motion } from "framer-motion";
import Footer from "@/components/Footer";
import FunVotingSection from "@/components/FunVotingSection";
import GuestbookSection from "@/components/GuestbookSection";
import HeroSection from "@/components/HeroSection";
import MemoriesSection from "@/components/MemoriesSection";
import MembersSection from "@/components/MembersSection";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import SecretLettersSection from "@/components/SecretLettersSection";
import TimeCapsuleSection from "@/components/TimeCapsuleSection";
import TimelineSection from "@/components/TimelineSection";
import UnlockQuiz from "@/components/UnlockQuiz";
import { siteConfig } from "@/data/siteData";
import type { YearbookContent } from "@/types/yearbook";
import { useState } from "react";

type YearbookAppProps = {
  yearbookContent: YearbookContent;
};

export default function YearbookApp({ yearbookContent }: YearbookAppProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const {
    members,
    memories,
    timelineEvents,
    guestbookMessages,
    secretLetters,
    voteCategories,
    timeCapsules,
    reactionCounts,
    activeQuiz,
    states,
    guestbookSubmissionMode,
  } = yearbookContent;

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="sunbeam absolute left-[6%] top-6 h-56 w-56 rounded-full" />
        <div className="absolute right-[-4%] top-40 h-72 w-72 rounded-full bg-rose/55 blur-3xl" />
        <div className="absolute bottom-10 left-[12%] h-52 w-52 rounded-full bg-sky/60 blur-3xl" />
        <div className="absolute bottom-0 right-[10%] h-40 w-40 rounded-full bg-lavender/70 blur-3xl" />
      </div>

      <AnimatePresence>
        {!isUnlocked ? (
          <UnlockQuiz
            quizConfig={activeQuiz}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity: isUnlocked ? 1 : 0.38,
          scale: isUnlocked ? 1 : 0.985,
          filter: isUnlocked ? "blur(0px)" : "blur(12px)",
        }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className={isUnlocked ? "" : "pointer-events-none select-none"}
      >
        <Navbar
          className={siteConfig.className}
          schoolName={siteConfig.schoolName}
          items={siteConfig.navigation}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-8 sm:px-6 lg:px-8">
          <HeroSection
            siteConfig={siteConfig}
            memberCount={members.length}
            memoryCount={memories.length}
            timelineCount={timelineEvents.length}
          />
          <MembersSection
            members={members}
            dataState={states.members}
            reactionCounts={reactionCounts.member}
          />
          <MemoriesSection
            memories={memories}
            dataState={states.memories}
            reactionCounts={reactionCounts.memory}
          />
          <TimelineSection
            events={timelineEvents}
            dataState={states.timelineEvents}
          />
          <GuestbookSection
            initialMessages={guestbookMessages}
            dataState={states.guestbookMessages}
            submissionMode={guestbookSubmissionMode}
          />
          <SecretLettersSection
            letters={secretLetters}
            members={members}
            dataState={states.secretLetters}
          />
          <FunVotingSection
            categories={voteCategories}
            members={members}
            dataState={states.voteCategories}
          />
          <TimeCapsuleSection
            capsules={timeCapsules}
            dataState={states.timeCapsules}
          />
          <MusicPlayer config={siteConfig.music} />
        </main>

        <Footer siteConfig={siteConfig} />
      </motion.div>
    </div>
  );
}
