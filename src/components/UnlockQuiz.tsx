"use client";

import { motion } from "framer-motion";
import { KeyRound, Sparkles, Stars } from "lucide-react";
import { useState } from "react";
import type { QuizConfig } from "@/data/siteData";

type UnlockQuizProps = {
  quizConfig: QuizConfig;
  onUnlock: () => void;
};

type FeedbackState = {
  tone: "success" | "error";
  message: string;
} | null;

export default function UnlockQuiz({
  quizConfig,
  onUnlock,
}: UnlockQuizProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSelect = (optionId: string) => {
    if (isUnlocking) {
      return;
    }

    setSelectedOptionId(optionId);

    if (optionId === quizConfig.correctOptionId) {
      setFeedback({
        tone: "success",
        message: quizConfig.successMessage,
      });
      setIsUnlocking(true);

      window.setTimeout(() => {
        onUnlock();
      }, 900);

      return;
    }

    setFeedback({
      tone: "error",
      message: quizConfig.failMessage,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_rgba(255,250,245,0.94),_rgba(253,241,229,0.98))] px-4 py-6 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          className="section-shell section-grid relative rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[640px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.7 }}
        >
          <div className="sunbeam absolute -left-12 -top-16 h-48 w-48 rounded-full" />
          <div className="sunbeam absolute bottom-4 right-6 h-40 w-40 rounded-full opacity-70" />

          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <span className="sticker inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                <KeyRound className="h-4 w-4" />
                Mở khóa kỷ yếu
              </span>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl leading-tight text-shadow-sm sm:text-5xl lg:text-[3.65rem]">
                  Một cánh cửa nhỏ trước khi chạm vào{" "}
                  <span className="text-[#d47992]">thanh xuân</span>.
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted sm:text-lg">
                  Chọn đáp án đúng để mở cuốn kỷ yếu điện tử và đi lại qua những
                  ngày tháng sân trường trong trẻo nhất của lớp mình.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="paper-card rounded-[1.8rem] p-5">
                <div className="mb-3 flex items-center gap-3 text-[#7c6a98]">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Vibe note
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted">
                  Mỗi đáp án là một mảnh ký ức vui. Trả lời đúng, website sẽ mở
                  ra bằng hiệu ứng chuyển cảnh mềm để giữ đúng cảm giác “lật
                  từng trang kỷ niệm”.
                </p>
              </div>

              <div className="paper-card rounded-[1.8rem] p-5">
                <div className="mb-3 flex items-center gap-3 text-[#d08d5d]">
                  <Stars className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Config-ready
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted">
                  Câu hỏi, đáp án và lời nhắn phản hồi đều đang tách trong file
                  data riêng để sau này đổi cho lớp khác rất nhanh.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="paper-card relative rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16, duration: 0.7 }}
        >
          <div className="absolute right-5 top-5 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7aa8] shadow-sm">
            Quiz entry
          </div>

          <div className="mb-8 space-y-4 pt-10 sm:pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted">
              Câu hỏi mở khóa
            </p>
            <h2 className="text-2xl leading-snug sm:text-[2rem]">
              {quizConfig.question}
            </h2>
            <p className="text-sm leading-7 text-muted sm:text-base">
              Chọn một đáp án. Nếu sai, hệ thống sẽ nhắc vui và bạn có thể thử
              lại ngay.
            </p>
          </div>

          <div className="grid gap-4">
            {quizConfig.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleSelect(option.id)}
                  disabled={isUnlocking}
                  className={`flex items-start gap-4 rounded-[1.6rem] border px-4 py-4 text-left transition-all sm:px-5 ${
                    isSelected
                      ? "border-[#d8bdd4] bg-[#fff4f8] shadow-[0_10px_25px_rgba(216,189,212,0.25)]"
                      : "border-line bg-white/70 hover:border-[#d7dbe8] hover:bg-white"
                  } ${isUnlocking ? "cursor-default opacity-90" : ""}`}
                >
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f4ecff] text-sm font-bold text-[#7e6ca0]">
                    {option.label}
                  </span>
                  <span className="text-base leading-7 text-foreground">
                    {option.text}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div
            className={`mt-6 rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
              feedback?.tone === "success"
                ? "border-[#c9e7d9] bg-[#effbf4] text-[#2d6d52]"
                : "border-[#f0d4da] bg-[#fff3f5] text-[#8e5564]"
            }`}
          >
            {feedback?.message ??
              "Một câu hỏi nho nhỏ để bắt đầu hành trình. Đúng rồi thì cửa sẽ mở ngay."}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
