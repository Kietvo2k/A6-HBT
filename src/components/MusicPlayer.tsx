"use client";

import { motion } from "framer-motion";
import {
  Disc3,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SiteConfig } from "@/data/siteData";
import SectionHeading from "./SectionHeading";

type MusicPlayerProps = {
  config: SiteConfig["music"];
};

export default function MusicPlayer({ config }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    config.audioSrc
      ? "Nhấn nút để bắt đầu phát nhạc nền."
      : config.helperText,
  );

  useEffect(() => {
    if (!config.audioSrc) {
      return;
    }

    const audio = new Audio(config.audioSrc);
    audio.loop = true;
    audio.preload = "none";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setStatusMessage(config.helperText);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, [config.audioSrc, config.helperText]);

  const handleToggle = async () => {
    if (!audioRef.current) {
      setStatusMessage(config.helperText);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setStatusMessage("Nhạc nền đang được tắt.");
      return;
    }

    try {
      await audioRef.current.play();
      setStatusMessage(`Đang phát: ${config.trackTitle}`);
    } catch {
      setStatusMessage(
        "Trình duyệt cần thao tác rõ ràng từ người dùng. Hãy nhấn lại để thử phát nhạc.",
      );
      setIsPlaying(false);
    }
  };

  return (
    <>
      <section
        id="music"
        className="section-shell scroll-mt-28 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            eyebrow="Nhạc"
            title="Một nút nhỏ để bật lại cảm xúc"
            description="Phase 1 không auto-play để tránh lỗi trình duyệt. Người dùng chủ động bấm mới phát, và nếu chưa có file audio thì giao diện sẽ hiện fallback rõ ràng."
          />

          <div className="paper-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full p-4 ${
                    isPlaying
                      ? "bg-[#fff0c8] text-[#c99040]"
                      : "bg-[#eef4ff] text-[#6076a8]"
                  }`}
                >
                  {isPlaying ? (
                    <Disc3 className="h-6 w-6" />
                  ) : (
                    <Music2 className="h-6 w-6" />
                  )}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Background music
                  </p>
                  <h3 className="mt-1 text-2xl">{config.trackTitle}</h3>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[#fffdf7] p-4">
                <p className="text-sm leading-7 text-muted">{statusMessage}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isPlaying
                      ? "bg-[#ffe7b6] text-[#865c1b] hover:bg-[#ffdfa0]"
                      : "bg-[#f2eaff] text-[#5d4e7d] hover:bg-[#e9ddff]"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Tắt nhạc
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Bật nhạc
                    </>
                  )}
                </button>

                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-3 text-sm text-muted">
                  {config.audioSrc ? (
                    <Volume2 className="h-4 w-4 text-[#d29a5d]" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-[#8090b0]" />
                  )}
                  {config.audioSrc
                    ? "Đã có sẵn đường dẫn audio."
                    : "Đang ở chế độ placeholder."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-[0_14px_24px_rgba(86,76,112,0.18)] backdrop-blur-md ${
          isPlaying
            ? "bg-[#fff2ca]/95 text-[#8e6422]"
            : "bg-white/92 text-foreground"
        }`}
        aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "Đang phát" : "Nhạc"}
      </motion.button>
    </>
  );
}
