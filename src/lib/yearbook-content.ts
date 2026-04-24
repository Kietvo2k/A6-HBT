import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  members as fallbackMembers,
  memories as fallbackMemories,
  quizConfig,
  sampleGuestbookMessages,
  type GuestbookMessage,
  type Member,
  type Memory,
  type TimelineEvent,
  timelineEvents as fallbackTimelineEvents,
} from "@/data/siteData";
import {
  fallbackSecretLetters,
  fallbackTimeCapsules,
  fallbackVoteCategories,
} from "@/data/interactiveFallbackData";
import {
  createAvatarPlaceholder,
  createMemoryPlaceholder,
  placeholderPalettes,
} from "@/lib/placeholders";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CollectionDataState,
  GuestbookSubmissionMode,
  QuizRecord,
  ReactionCounts,
  SecretLetterPublic,
  TimeCapsulePublic,
  VoteCategoryWithResults,
  YearbookContent,
} from "@/types/yearbook";

type MemberRow = {
  id: string;
  name: string;
  nickname: string | null;
  avatar_url: string | null;
  quote: string | null;
  short_bio: string | null;
  hobbies: string[] | null;
  sort_order: number | null;
  social_links: Record<string, string> | null;
  inserted_at: string;
};

type MemoryRow = {
  id: string;
  title: string;
  memory_date: string;
  image_url: string | null;
  caption: string | null;
  category: "classroom" | "outing" | "event" | "funny";
  sort_order: number | null;
  inserted_at: string;
};

type TimelineEventRow = {
  id: string;
  title: string;
  event_date: string;
  description: string;
  image_url: string | null;
  sort_order: number | null;
  inserted_at: string;
};

type GuestbookMessageRow = {
  id: string;
  sender_name: string;
  message: string;
  inserted_at: string;
};

type SecretLetterRow = {
  id: string;
  sender_name: string | null;
  target_member_id: string | null;
  message: string;
  is_anonymous: boolean;
  inserted_at: string;
};

type VoteCategoryRow = {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  is_visible: boolean;
  inserted_at: string;
};

type VoteResultRow = {
  category_id: string;
  target_member_id: string;
  vote_count: number;
};

type TimeCapsuleRow = {
  id: string;
  sender_name: string;
  unlock_date: string;
  status: "locked" | "opened" | "hidden";
  message: string | null;
  inserted_at: string;
};

type ReactionCountRow = {
  target_type: "member" | "memory" | "timeline" | "guestbook";
  target_id: string;
  reaction_count: number;
};

type QuizRow = {
  id: string;
  question: string;
  options: QuizRecord["options"];
  correct_option_id: string;
  success_message: string;
  fail_message: string;
  is_active: boolean;
  updated_at: string;
};

type CollectionResult<T> = {
  data: T;
  state: CollectionDataState;
};

const memberPalettes = [
  placeholderPalettes.rose,
  placeholderPalettes.sky,
  placeholderPalettes.lavender,
  placeholderPalettes.sun,
  placeholderPalettes.mint,
] as const;

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function getMemoryCategoryLabel(category: MemoryRow["category"]): Memory["category"] {
  switch (category) {
    case "classroom":
      return "Lớp học";
    case "outing":
      return "Đi chơi";
    case "event":
      return "Sự kiện";
    case "funny":
      return "Ảnh dìm vui";
    default:
      return "Sự kiện";
  }
}

function getMemoryPalette(category: MemoryRow["category"]) {
  switch (category) {
    case "classroom":
      return placeholderPalettes.sky;
    case "outing":
      return placeholderPalettes.mint;
    case "event":
      return placeholderPalettes.rose;
    case "funny":
      return placeholderPalettes.sun;
    default:
      return placeholderPalettes.lavender;
  }
}

function getFallbackState(message: string): CollectionDataState {
  return {
    source: "fallback",
    message,
  };
}

function createEmptyReactionCounts(): ReactionCounts {
  return {
    member: {},
    memory: {},
    timeline: {},
    guestbook: {},
  };
}

async function loadMembers(
  supabase: SupabaseClient,
): Promise<CollectionResult<Member[]>> {
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, name, nickname, avatar_url, quote, short_bio, hobbies, sort_order, social_links, inserted_at",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  if (error) {
    return {
      data: fallbackMembers,
      state: getFallbackState(
        "Không thể tải danh sách thành viên từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const members = (data as MemberRow[]).map((member, index) => ({
    id: member.id,
    name: member.name,
    nickname: member.nickname ?? "Bạn cùng lớp",
    avatarUrl:
      member.avatar_url ||
      createAvatarPlaceholder(
        member.name,
        memberPalettes[index % memberPalettes.length],
        index % 2 === 0 ? -6 : 5,
      ),
    quote: member.quote ?? "Một mảnh thanh xuân rất riêng của lớp mình.",
    shortBio:
      member.short_bio ?? "Chưa có phần giới thiệu cho thành viên này.",
    hobbies: member.hobbies?.length ? member.hobbies : ["Thanh xuân", "Kỷ yếu"],
  }));

  return {
    data: members,
    state: {
      source: "supabase",
    },
  };
}

async function loadMemories(
  supabase: SupabaseClient,
): Promise<CollectionResult<Memory[]>> {
  const { data, error } = await supabase
    .from("memories")
    .select(
      "id, title, memory_date, image_url, caption, category, sort_order, inserted_at",
    )
    .eq("is_published", true)
    .order("memory_date", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  if (error) {
    return {
      data: fallbackMemories,
      state: getFallbackState(
        "Không thể tải gallery từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const memories = (data as MemoryRow[]).map((memory) => ({
    id: memory.id,
    title: memory.title,
    date: formatDateLabel(memory.memory_date),
    imageUrl:
      memory.image_url ||
      createMemoryPlaceholder(
        memory.title,
        memory.caption ?? formatDateLabel(memory.memory_date),
        getMemoryPalette(memory.category),
      ),
    caption: memory.caption ?? "Một khoảnh khắc đẹp đang chờ được kể thêm.",
    category: getMemoryCategoryLabel(memory.category),
  }));

  return {
    data: memories,
    state: {
      source: "supabase",
    },
  };
}

async function loadTimelineEvents(
  supabase: SupabaseClient,
): Promise<CollectionResult<TimelineEvent[]>> {
  const { data, error } = await supabase
    .from("timeline_events")
    .select(
      "id, title, event_date, description, image_url, sort_order, inserted_at",
    )
    .eq("is_published", true)
    .order("event_date", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  if (error) {
    return {
      data: fallbackTimelineEvents,
      state: getFallbackState(
        "Không thể tải dòng thời gian từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const events = (data as TimelineEventRow[]).map((event) => ({
    id: event.id,
    title: event.title,
    date: formatDateLabel(event.event_date),
    description: event.description,
    imageUrl: event.image_url || undefined,
  }));

  return {
    data: events,
    state: {
      source: "supabase",
    },
  };
}

async function loadGuestbookMessages(
  supabase: SupabaseClient,
): Promise<CollectionResult<GuestbookMessage[]>> {
  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("id, sender_name, message, inserted_at")
    .eq("status", "approved")
    .order("inserted_at", { ascending: false });

  if (error) {
    return {
      data: sampleGuestbookMessages,
      state: getFallbackState(
        "Không thể tải lưu bút đã duyệt từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const messages = (data as GuestbookMessageRow[]).map((message) => ({
    id: message.id,
    name: message.sender_name,
    message: message.message,
    createdAt: message.inserted_at,
  }));

  return {
    data: messages,
    state: {
      source: "supabase",
    },
  };
}

async function loadSecretLetters(
  supabase: SupabaseClient,
  members: Member[],
): Promise<CollectionResult<SecretLetterPublic[]>> {
  const { data, error } = await supabase
    .from("secret_letters")
    .select("id, sender_name, target_member_id, message, is_anonymous, inserted_at")
    .eq("status", "approved")
    .eq("is_public", true)
    .order("inserted_at", { ascending: false });

  if (error) {
    return {
      data: fallbackSecretLetters,
      state: getFallbackState(
        "Không thể tải hộp thư bí mật từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const memberMap = new Map(members.map((member) => [member.id, member]));

  return {
    data: (data as SecretLetterRow[]).map((letter) => {
      const targetMember = letter.target_member_id
        ? memberMap.get(letter.target_member_id)
        : null;

      return {
        id: letter.id,
        senderName: letter.is_anonymous ? null : letter.sender_name,
        displayName: letter.is_anonymous
          ? "Một người giấu tên"
          : letter.sender_name ?? "Một người bạn cùng lớp",
        targetMemberId: letter.target_member_id,
        targetMemberName: targetMember?.name ?? (letter.target_member_id ? "Một thành viên" : "Cả lớp"),
        message: letter.message,
        isAnonymous: letter.is_anonymous,
        createdAt: letter.inserted_at,
      };
    }),
    state: {
      source: "supabase",
    },
  };
}

async function loadVoteCategories(
  supabase: SupabaseClient,
  members: Member[],
): Promise<CollectionResult<VoteCategoryWithResults[]>> {
  const [categoriesResponse, resultsResponse] = await Promise.all([
    supabase
      .from("vote_categories")
      .select("id, title, description, is_active, is_visible, inserted_at")
      .eq("is_active", true)
      .eq("is_visible", true)
      .order("inserted_at", { ascending: true }),
    supabase.rpc("get_vote_results"),
  ]);

  if (categoriesResponse.error || resultsResponse.error) {
    return {
      data: fallbackVoteCategories,
      state: getFallbackState(
        "Không thể tải bình chọn vui từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  const memberMap = new Map(members.map((member) => [member.id, member]));
  const resultsByCategory = new Map<string, VoteResultRow[]>();

  for (const row of (resultsResponse.data ?? []) as VoteResultRow[]) {
    const group = resultsByCategory.get(row.category_id) ?? [];
    group.push(row);
    resultsByCategory.set(row.category_id, group);
  }

  const categories = ((categoriesResponse.data ?? []) as VoteCategoryRow[]).map(
    (category) => {
      const rawResults = resultsByCategory.get(category.id) ?? [];
      const results = rawResults
        .map((result) => {
          const member = memberMap.get(result.target_member_id);

          if (!member) {
            return null;
          }

          return {
            memberId: member.id,
            memberName: member.name,
            avatarUrl: member.avatarUrl,
            count: Number(result.vote_count ?? 0),
          };
        })
        .filter((result): result is NonNullable<typeof result> => Boolean(result))
        .sort((left, right) => right.count - left.count);

      return {
        id: category.id,
        title: category.title,
        description: category.description,
        isActive: category.is_active,
        isVisible: category.is_visible,
        createdAt: category.inserted_at,
        totalVotes: results.reduce((total, result) => total + result.count, 0),
        results,
      };
    },
  );

  return {
    data: categories,
    state: {
      source: "supabase",
    },
  };
}

async function loadTimeCapsules(
  supabase: SupabaseClient,
): Promise<CollectionResult<TimeCapsulePublic[]>> {
  const { data, error } = await supabase.rpc("get_public_time_capsules");

  if (error) {
    return {
      data: fallbackTimeCapsules,
      state: getFallbackState(
        "Không thể tải hộp thời gian từ Supabase, đang hiển thị dữ liệu mẫu local.",
      ),
    };
  }

  return {
    data: ((data ?? []) as TimeCapsuleRow[]).map((capsule) => ({
      id: capsule.id,
      senderName: capsule.sender_name,
      unlockDate: capsule.unlock_date,
      status: capsule.status,
      message: capsule.message,
      isOpened: capsule.status === "opened",
      createdAt: capsule.inserted_at,
    })),
    state: {
      source: "supabase",
    },
  };
}

async function loadReactionCounts(
  supabase: SupabaseClient,
): Promise<CollectionResult<ReactionCounts>> {
  const { data, error } = await supabase.rpc("get_reaction_counts");

  if (error) {
    return {
      data: createEmptyReactionCounts(),
      state: getFallbackState(
        "Không thể tải lượt tim từ Supabase. Các nút reaction sẽ bắt đầu từ 0 cho đến khi database sẵn sàng.",
      ),
    };
  }

  const counts = createEmptyReactionCounts();

  for (const row of (data ?? []) as ReactionCountRow[]) {
    counts[row.target_type][row.target_id] = Number(row.reaction_count ?? 0);
  }

  return {
    data: counts,
    state: {
      source: "supabase",
    },
  };
}

async function loadActiveQuiz(
  supabase: SupabaseClient,
): Promise<CollectionResult<YearbookContent["activeQuiz"]>> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(
      "id, question, options, correct_option_id, success_message, fail_message, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      data: quizConfig,
      state: getFallbackState(
        "Chưa có quiz active trong Supabase, đang dùng quiz local fallback.",
      ),
    };
  }

  const quiz = data as QuizRow;

  return {
    data: {
      question: quiz.question,
      options: quiz.options,
      correctOptionId: quiz.correct_option_id,
      successMessage: quiz.success_message,
      failMessage: quiz.fail_message,
    },
    state: {
      source: "supabase",
    },
  };
}

export async function getYearbookContent(): Promise<YearbookContent> {
  if (!hasSupabaseEnv()) {
    const fallbackMessage =
      "Supabase chưa được cấu hình, website đang hiển thị dữ liệu mẫu local để bạn tiếp tục phát triển UI.";

    return {
      members: fallbackMembers,
      memories: fallbackMemories,
      timelineEvents: fallbackTimelineEvents,
      guestbookMessages: sampleGuestbookMessages,
      secretLetters: fallbackSecretLetters,
      voteCategories: fallbackVoteCategories,
      timeCapsules: fallbackTimeCapsules,
      reactionCounts: createEmptyReactionCounts(),
      activeQuiz: quizConfig,
      states: {
        members: getFallbackState(fallbackMessage),
        memories: getFallbackState(fallbackMessage),
        timelineEvents: getFallbackState(fallbackMessage),
        guestbookMessages: getFallbackState(fallbackMessage),
        secretLetters: getFallbackState(fallbackMessage),
        voteCategories: getFallbackState(fallbackMessage),
        timeCapsules: getFallbackState(fallbackMessage),
        reactions: getFallbackState(fallbackMessage),
        quiz: getFallbackState(fallbackMessage),
      },
      guestbookSubmissionMode: "local-fallback",
    };
  }

  const supabase = await createSupabaseServerClient();

  const [membersResult, memoriesResult, timelineResult, guestbookResult, quizResult] =
    await Promise.all([
      loadMembers(supabase),
      loadMemories(supabase),
      loadTimelineEvents(supabase),
      loadGuestbookMessages(supabase),
      loadActiveQuiz(supabase),
    ]);

  const [secretLettersResult, voteCategoriesResult, timeCapsulesResult, reactionsResult] =
    await Promise.all([
      loadSecretLetters(supabase, membersResult.data),
      loadVoteCategories(supabase, membersResult.data),
      loadTimeCapsules(supabase),
      loadReactionCounts(supabase),
    ]);

  return {
    members: membersResult.data,
    memories: memoriesResult.data,
    timelineEvents: timelineResult.data,
    guestbookMessages: guestbookResult.data,
    secretLetters: secretLettersResult.data,
    voteCategories: voteCategoriesResult.data,
    timeCapsules: timeCapsulesResult.data,
    reactionCounts: reactionsResult.data,
    activeQuiz: quizResult.data,
    states: {
      members: membersResult.state,
      memories: memoriesResult.state,
      timelineEvents: timelineResult.state,
      guestbookMessages: guestbookResult.state,
      secretLetters: secretLettersResult.state,
      voteCategories: voteCategoriesResult.state,
      timeCapsules: timeCapsulesResult.state,
      reactions: reactionsResult.state,
      quiz: quizResult.state,
    },
    guestbookSubmissionMode: "database" satisfies GuestbookSubmissionMode,
  };
}
