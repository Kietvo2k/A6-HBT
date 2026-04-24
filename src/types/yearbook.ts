import type {
  GuestbookMessage,
  Memory,
  QuizConfig,
  TimelineEvent,
} from "@/data/siteData";

export type ProfileRole = "admin" | "member" | "guest";

export type Profile = {
  id: string;
  displayName: string | null;
  email: string | null;
  role: ProfileRole;
  createdAt: string;
};

export type CollectionDataState = {
  source: "supabase" | "fallback";
  message?: string;
};

export type GuestbookSubmissionMode = "database" | "local-fallback";

export type SecretLetterStatus = "pending" | "approved" | "rejected";

export type SecretLetterPublic = {
  id: string;
  senderName: string | null;
  displayName: string;
  targetMemberId: string | null;
  targetMemberName: string | null;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
};

export type SecretLetterAdminRecord = {
  id: string;
  senderName: string | null;
  targetMemberId: string | null;
  targetMemberName: string | null;
  message: string;
  isAnonymous: boolean;
  isPublic: boolean;
  status: SecretLetterStatus;
  createdAt: string;
};

export type VoteCategory = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
};

export type VoteResultEntry = {
  memberId: string;
  memberName: string;
  avatarUrl: string;
  count: number;
};

export type VoteCategoryWithResults = VoteCategory & {
  totalVotes: number;
  results: VoteResultEntry[];
};

export type VoteAdminRecord = VoteCategoryWithResults;

export type TimeCapsuleStatus = "locked" | "opened" | "hidden";

export type TimeCapsulePublic = {
  id: string;
  senderName: string;
  unlockDate: string;
  status: TimeCapsuleStatus;
  message: string | null;
  isOpened: boolean;
  createdAt: string;
};

export type TimeCapsuleAdminRecord = {
  id: string;
  senderName: string;
  unlockDate: string;
  status: TimeCapsuleStatus;
  message: string;
  createdAt: string;
};

export type ReactionTargetType =
  | "member"
  | "memory"
  | "timeline"
  | "guestbook";

export type ReactionCounts = Record<ReactionTargetType, Record<string, number>>;

export type QuizRecord = {
  id: string;
  question: string;
  options: QuizConfig["options"];
  correctOptionId: string;
  successMessage: string;
  failMessage: string;
  isActive: boolean;
  updatedAt: string;
};

export type GuestbookAdminRecord = GuestbookMessage & {
  status: "pending" | "approved" | "rejected";
  isAnonymous: boolean;
  targetMemberId: string | null;
  targetMemberName: string | null;
};

export type MemberAdminRecord = {
  id: string;
  name: string;
  nickname: string | null;
  avatarUrl: string | null;
  quote: string | null;
  shortBio: string | null;
  hobbies: string[];
  socialLinks: Record<string, string>;
  displayOrder: number;
  isVisible: boolean;
  insertedAt: string;
};

export type MemoryAdminRecord = {
  id: string;
  title: string;
  date: string;
  imageUrl: string | null;
  videoUrl: string | null;
  caption: string | null;
  category: string;
  albumName: string | null;
  displayOrder: number;
  isVisible: boolean;
  insertedAt: string;
};

export type TimelineAdminRecord = {
  id: string;
  title: string;
  eventDate: string;
  description: string;
  imageUrl: string | null;
  displayOrder: number;
  isVisible: boolean;
  insertedAt: string;
};

export type AdminOverviewStats = {
  membersCount: number;
  memoriesCount: number;
  pendingGuestbookCount: number;
  pendingSecretLettersCount: number;
  voteCount: number;
  timeCapsuleCount: number;
};

export type YearbookContent = {
  members: import("@/data/siteData").Member[];
  memories: Memory[];
  timelineEvents: TimelineEvent[];
  guestbookMessages: GuestbookMessage[];
  secretLetters: SecretLetterPublic[];
  voteCategories: VoteCategoryWithResults[];
  timeCapsules: TimeCapsulePublic[];
  reactionCounts: ReactionCounts;
  activeQuiz: QuizConfig;
  states: {
    members: CollectionDataState;
    memories: CollectionDataState;
    timelineEvents: CollectionDataState;
    guestbookMessages: CollectionDataState;
    secretLetters: CollectionDataState;
    voteCategories: CollectionDataState;
    timeCapsules: CollectionDataState;
    reactions: CollectionDataState;
    quiz: CollectionDataState;
  };
  guestbookSubmissionMode: GuestbookSubmissionMode;
};
