"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { getOrCreateVoterKey } from "@/lib/voter-key";
import type { ReactionTargetType } from "@/types/yearbook";

type LoveReactionButtonProps = {
  targetType: ReactionTargetType;
  targetId: string;
  initialCount: number;
  compact?: boolean;
};

const REACTION_STORAGE_KEY = "yearbook-reaction-targets";

function readReactionTargets() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const storedValue = window.localStorage.getItem(REACTION_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as string[]) : [];
  } catch {
    return [];
  }
}

function writeReactionTargets(targets: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(REACTION_STORAGE_KEY, JSON.stringify(targets));
  } catch {
    // Ignore localStorage write errors for reactions.
  }
}

export default function LoveReactionButton({
  targetType,
  targetId,
  initialCount,
  compact = false,
}: LoveReactionButtonProps) {
  const reactionKey = `${targetType}:${targetId}`;
  const [count, setCount] = useState(initialCount);
  const [hasLoved, setHasLoved] = useState(() =>
    readReactionTargets().includes(reactionKey),
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReact = async () => {
    if (hasLoved || isSubmitting) {
      setStatus("Bạn đã thả tim cho mục này rồi.");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetType,
          targetId,
          voterKey: getOrCreateVoterKey(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Không thể lưu reaction lúc này.");
      }

      const storedTargets = [...new Set([...readReactionTargets(), reactionKey])];
      writeReactionTargets(storedTargets);
      setHasLoved(true);
      setCount((current) => current + 1);
      setStatus("Đã thả tim rồi đó.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Không thể thả tim lúc này. Vui lòng thử lại sau.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <button
        type="button"
        onClick={handleReact}
        disabled={isSubmitting}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
          hasLoved
            ? "border-[#f0c6d2] bg-[#fff1f5] text-[#d4698b]"
            : "border-line bg-white/80 text-muted hover:bg-white hover:text-foreground"
        }`}
        aria-label={hasLoved ? "Đã thả tim" : "Thả tim"}
      >
        <Heart className={`h-4 w-4 ${hasLoved ? "fill-current" : ""}`} />
        <span>{count}</span>
      </button>

      {!compact && status ? (
        <p className="text-xs leading-6 text-muted">{status}</p>
      ) : null}
    </div>
  );
}
