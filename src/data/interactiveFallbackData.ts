import type {
  SecretLetterPublic,
  TimeCapsulePublic,
  VoteCategoryWithResults,
} from "@/types/yearbook";

export const fallbackSecretLetters: SecretLetterPublic[] = [
  {
    id: "secret-letter-1",
    senderName: null,
    displayName: "Một người bạn giấu tên",
    targetMemberId: null,
    targetMemberName: "Cả lớp",
    message:
      "Cảm ơn vì đã biến những ngày đến trường thành điều gì đó dịu dàng hơn rất nhiều.",
    isAnonymous: true,
    createdAt: "2026-04-18T09:00:00.000Z",
  },
  {
    id: "secret-letter-2",
    senderName: "Người ngồi bàn trên",
    displayName: "Người ngồi bàn trên",
    targetMemberId: null,
    targetMemberName: "Cả lớp",
    message:
      "Nếu sau này ai đó hỏi thanh xuân trông như thế nào, mình sẽ nghĩ đến lớp mình trước tiên.",
    isAnonymous: false,
    createdAt: "2026-04-21T13:20:00.000Z",
  },
];

export const fallbackVoteCategories: VoteCategoryWithResults[] = [
  {
    id: "vote-1",
    title: "Cây hài của lớp",
    description: "Người luôn biết cách làm mọi buổi học đỡ căng thẳng hơn.",
    isActive: true,
    isVisible: true,
    createdAt: "2026-04-01T00:00:00.000Z",
    totalVotes: 18,
    results: [
      {
        memberId: "quang-huy",
        memberName: "Quang Huy",
        avatarUrl: "",
        count: 9,
      },
      {
        memberId: "duc-khang",
        memberName: "Đức Khang",
        avatarUrl: "",
        count: 6,
      },
      {
        memberId: "mai-anh",
        memberName: "Mai Anh",
        avatarUrl: "",
        count: 3,
      },
    ],
  },
  {
    id: "vote-2",
    title: "Người truyền năng lượng tích cực",
    description: "Bạn khiến cả lớp thấy nhẹ lòng hơn chỉ bằng sự có mặt.",
    isActive: true,
    isVisible: true,
    createdAt: "2026-04-02T00:00:00.000Z",
    totalVotes: 14,
    results: [
      {
        memberId: "thao-nguyen",
        memberName: "Thảo Nguyên",
        avatarUrl: "",
        count: 8,
      },
      {
        memberId: "linh-chi",
        memberName: "Linh Chi",
        avatarUrl: "",
        count: 4,
      },
      {
        memberId: "ngoc-minh",
        memberName: "Ngọc Minh",
        avatarUrl: "",
        count: 2,
      },
    ],
  },
];

export const fallbackTimeCapsules: TimeCapsulePublic[] = [
  {
    id: "capsule-1",
    senderName: "Mai Anh",
    unlockDate: "2026-09-05",
    status: "locked",
    message: null,
    isOpened: false,
    createdAt: "2026-04-20T08:00:00.000Z",
  },
  {
    id: "capsule-2",
    senderName: "Ngọc Minh",
    unlockDate: "2026-04-10",
    status: "opened",
    message:
      "Mong rằng vài tháng sau khi đọc lại, chúng mình vẫn giữ được sự tử tế dành cho nhau như những ngày cuối cấp.",
    isOpened: true,
    createdAt: "2026-03-18T08:00:00.000Z",
  },
];
