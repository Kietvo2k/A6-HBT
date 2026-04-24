import "server-only";
import { requireAdminAccess } from "@/lib/auth";
import type {
  AdminOverviewStats,
  GuestbookAdminRecord,
  MemberAdminRecord,
  MemoryAdminRecord,
  QuizRecord,
  SecretLetterAdminRecord,
  TimeCapsuleAdminRecord,
  TimelineAdminRecord,
  VoteAdminRecord,
} from "@/types/yearbook";

type VoteRow = {
  id: string;
  category_id: string;
  target_member_id: string;
  voter_key: string;
  inserted_at: string;
};

type MemberLookup = {
  id: string;
  name: string;
  avatar_url: string | null;
};

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const { supabase } = await requireAdminAccess("/admin");

  const [
    membersResult,
    memoriesResult,
    guestbookResult,
    secretLettersResult,
    votesResult,
    timeCapsulesResult,
  ] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("memories").select("id", { count: "exact", head: true }),
    supabase
      .from("guestbook_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("secret_letters")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("votes").select("id", { count: "exact", head: true }),
    supabase.from("time_capsules").select("id", { count: "exact", head: true }),
  ]);

  return {
    membersCount: membersResult.count ?? 0,
    memoriesCount: memoriesResult.count ?? 0,
    pendingGuestbookCount: guestbookResult.count ?? 0,
    pendingSecretLettersCount: secretLettersResult.count ?? 0,
    voteCount: votesResult.count ?? 0,
    timeCapsuleCount: timeCapsulesResult.count ?? 0,
  };
}

export async function getAdminMembers(): Promise<MemberAdminRecord[]> {
  const { supabase } = await requireAdminAccess("/admin/members");
  const { data } = await supabase
    .from("members")
    .select(
      "id, name, nickname, avatar_url, quote, short_bio, hobbies, social_links, sort_order, is_published, inserted_at",
    )
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  return (data ?? []).map((member) => ({
    id: member.id,
    name: member.name,
    nickname: member.nickname,
    avatarUrl: member.avatar_url,
    quote: member.quote,
    shortBio: member.short_bio,
    hobbies: member.hobbies ?? [],
    socialLinks:
      member.social_links && typeof member.social_links === "object"
        ? (member.social_links as Record<string, string>)
        : {},
    displayOrder: member.sort_order ?? 0,
    isVisible: member.is_published ?? true,
    insertedAt: member.inserted_at,
  }));
}

export async function getAdminMemories(): Promise<MemoryAdminRecord[]> {
  const { supabase } = await requireAdminAccess("/admin/memories");
  const { data } = await supabase
    .from("memories")
    .select(
      "id, title, memory_date, image_url, video_url, caption, category, album_name, sort_order, is_published, inserted_at",
    )
    .order("memory_date", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  return (data ?? []).map((memory) => ({
    id: memory.id,
    title: memory.title,
    date: memory.memory_date,
    imageUrl: memory.image_url,
    videoUrl: memory.video_url,
    caption: memory.caption,
    category: memory.category,
    albumName: memory.album_name,
    displayOrder: memory.sort_order ?? 0,
    isVisible: memory.is_published ?? true,
    insertedAt: memory.inserted_at,
  }));
}

export async function getAdminTimelineEvents(): Promise<TimelineAdminRecord[]> {
  const { supabase } = await requireAdminAccess("/admin/timeline");
  const { data } = await supabase
    .from("timeline_events")
    .select(
      "id, title, event_date, description, image_url, sort_order, is_published, inserted_at",
    )
    .order("event_date", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  return (data ?? []).map((event) => ({
    id: event.id,
    title: event.title,
    eventDate: event.event_date,
    description: event.description,
    imageUrl: event.image_url,
    displayOrder: event.sort_order ?? 0,
    isVisible: event.is_published ?? true,
    insertedAt: event.inserted_at,
  }));
}

async function getMemberLookup() {
  const { supabase } = await requireAdminAccess("/admin");
  const { data } = await supabase
    .from("members")
    .select("id, name, avatar_url")
    .order("sort_order", { ascending: true })
    .order("inserted_at", { ascending: true });

  return (data ?? []) as MemberLookup[];
}

export async function getAdminGuestbookMessages(): Promise<GuestbookAdminRecord[]> {
  const [{ supabase }, members] = await Promise.all([
    requireAdminAccess("/admin/guestbook"),
    getMemberLookup(),
  ]);

  const memberMap = new Map(members.map((member) => [member.id, member.name]));
  const { data } = await supabase
    .from("guestbook_messages")
    .select(
      "id, sender_name, message, status, is_anonymous, target_member_id, inserted_at",
    )
    .order("inserted_at", { ascending: false });

  return (data ?? []).map((message) => ({
    id: message.id,
    name: message.sender_name,
    message: message.message,
    createdAt: message.inserted_at,
    status: message.status,
    isAnonymous: message.is_anonymous ?? false,
    targetMemberId: message.target_member_id,
    targetMemberName: message.target_member_id
      ? memberMap.get(message.target_member_id) ?? null
      : null,
  }));
}

export async function getAdminQuizQuestions(): Promise<QuizRecord[]> {
  const { supabase } = await requireAdminAccess("/admin/quiz");
  const { data } = await supabase
    .from("quiz_questions")
    .select(
      "id, question, options, correct_option_id, success_message, fail_message, is_active, updated_at",
    )
    .order("updated_at", { ascending: false });

  return (data ?? []).map((quiz) => ({
    id: quiz.id,
    question: quiz.question,
    options: quiz.options,
    correctOptionId: quiz.correct_option_id,
    successMessage: quiz.success_message,
    failMessage: quiz.fail_message,
    isActive: quiz.is_active,
    updatedAt: quiz.updated_at,
  }));
}

export async function getAdminSecretLetters(): Promise<SecretLetterAdminRecord[]> {
  const [{ supabase }, members] = await Promise.all([
    requireAdminAccess("/admin/secret-letters"),
    getMemberLookup(),
  ]);

  const memberMap = new Map(members.map((member) => [member.id, member.name]));
  const { data } = await supabase
    .from("secret_letters")
    .select(
      "id, sender_name, target_member_id, message, is_anonymous, is_public, status, inserted_at",
    )
    .order("inserted_at", { ascending: false });

  return (data ?? []).map((letter) => ({
    id: letter.id,
    senderName: letter.sender_name,
    targetMemberId: letter.target_member_id,
    targetMemberName: letter.target_member_id
      ? memberMap.get(letter.target_member_id) ?? null
      : null,
    message: letter.message,
    isAnonymous: letter.is_anonymous ?? false,
    isPublic: letter.is_public ?? false,
    status: letter.status,
    createdAt: letter.inserted_at,
  }));
}

export async function getAdminVoteCategories(): Promise<VoteAdminRecord[]> {
  const [{ supabase }, members] = await Promise.all([
    requireAdminAccess("/admin/votes"),
    getMemberLookup(),
  ]);

  const memberMap = new Map(members.map((member) => [member.id, member]));
  const [categoriesResult, votesResult] = await Promise.all([
    supabase
      .from("vote_categories")
      .select("id, title, description, is_active, is_visible, inserted_at")
      .order("inserted_at", { ascending: false }),
    supabase
      .from("votes")
      .select("id, category_id, target_member_id, voter_key, inserted_at"),
  ]);

  const votes = (votesResult.data ?? []) as VoteRow[];
  const voteMap = new Map<string, Map<string, number>>();

  for (const vote of votes) {
    const categoryVotes = voteMap.get(vote.category_id) ?? new Map<string, number>();
    categoryVotes.set(
      vote.target_member_id,
      (categoryVotes.get(vote.target_member_id) ?? 0) + 1,
    );
    voteMap.set(vote.category_id, categoryVotes);
  }

  return (categoriesResult.data ?? []).map((category) => {
    const rawResults = voteMap.get(category.id) ?? new Map<string, number>();
    const results = [...rawResults.entries()]
      .map(([memberId, count]) => {
        const member = memberMap.get(memberId);

        if (!member) {
          return null;
        }

        return {
          memberId,
          memberName: member.name,
          avatarUrl: member.avatar_url ?? "",
          count,
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
  });
}

export async function getAdminTimeCapsules(): Promise<TimeCapsuleAdminRecord[]> {
  const { supabase } = await requireAdminAccess("/admin/time-capsule");
  const { data } = await supabase
    .from("time_capsules")
    .select("id, sender_name, unlock_date, status, message, inserted_at")
    .order("unlock_date", { ascending: true })
    .order("inserted_at", { ascending: false });

  return (data ?? []).map((capsule) => ({
    id: capsule.id,
    senderName: capsule.sender_name,
    unlockDate: capsule.unlock_date,
    status: capsule.status,
    message: capsule.message,
    createdAt: capsule.inserted_at,
  }));
}

export async function getAdminMemberOptions() {
  return getMemberLookup();
}
