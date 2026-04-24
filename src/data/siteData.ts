import {
  createAvatarPlaceholder,
  createMemoryPlaceholder,
  placeholderPalettes,
} from "@/lib/placeholders";

export type NavigationItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  className: string;
  schoolName: string;
  year: string;
  title: string;
  subtitle: string;
  heroCtaLabel: string;
  footerNote: string;
  closingText: string;
  navigation: NavigationItem[];
  music: {
    trackTitle: string;
    audioSrc: string;
    helperText: string;
  };
};

export type QuizOption = {
  id: string;
  label: string;
  text: string;
};

export type QuizConfig = {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  successMessage: string;
  failMessage: string;
};

export type Member = {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  quote: string;
  shortBio: string;
  hobbies: string[];
};

export type MemoryCategory = "Lớp học" | "Đi chơi" | "Sự kiện" | "Ảnh dìm vui";

export type Memory = {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  category: MemoryCategory;
};

export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
};

export type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export const siteConfig: SiteConfig = {
  className: "12A6",
  schoolName: "Trường Trung Học Phổ Thông Hoa Nắng",
  year: "2023 - 2026",
  title: "Thanh Xuân Của Chúng Mình",
  subtitle:
    "Một nơi lưu giữ những ngày tháng đẹp nhất của lớp chúng ta, từ những giờ ra chơi đến những mùa hè chia tay.",
  heroCtaLabel: "Bắt đầu hành trình",
  footerNote: "Made with love for our class.",
  closingText:
    "Cảm ơn vì đã là một phần của thanh xuân này. Mỗi bức ảnh, mỗi dòng lưu bút và mỗi lần ghé vào đây đều là một mảnh ký ức được giữ lại.",
  navigation: [
    { label: "Trang chủ", href: "#home" },
    { label: "Thành viên", href: "#members" },
    { label: "Khoảnh khắc", href: "#memories" },
    { label: "Dòng thời gian", href: "#timeline" },
    { label: "Lưu bút", href: "#guestbook" },
    { label: "Nhạc", href: "#music" },
  ],
  music: {
    trackTitle: "Bản nhạc sân trường",
    audioSrc: "",
    helperText:
      "Chưa có file nhạc. Bạn có thể thêm file vào public/audio/class-theme.mp3, giao diện đã sẵn sàng để kết nối.",
  },
};

export const quizConfig: QuizConfig = {
  question: "Đâu là món ăn vặt dễ bị cả lớp tranh nhau nhất sau giờ thể dục?",
  options: [
    { id: "A", label: "A", text: "Trà sữa full topping" },
    { id: "B", label: "B", text: "Bánh tráng trộn cay cay" },
    { id: "C", label: "C", text: "Cơm cuộn rong biển" },
    { id: "D", label: "D", text: "Khoai lang lắc phô mai" },
  ],
  correctOptionId: "B",
  successMessage:
    "Chính xác. Một vé trở lại sân trường đã được mở khóa, cùng đi tiếp nào.",
  failMessage:
    "Hơi sai nhé. Có lẽ bạn vừa để ký ức trôi đi mất rồi, thử lại xem.",
};

export const memoryCategories = [
  "Tất cả",
  "Lớp học",
  "Đi chơi",
  "Sự kiện",
  "Ảnh dìm vui",
] as const;

export type MemoryFilter = (typeof memoryCategories)[number];

export const members: Member[] = [
  {
    id: "mai-anh",
    name: "Mai Anh",
    nickname: "Miu",
    avatarUrl: createAvatarPlaceholder("Mai Anh", placeholderPalettes.rose, -6),
    quote: "Chỉ cần cả lớp cười là mọi thứ đều ổn.",
    shortBio:
      "Người bắt trend nhanh nhất lớp, luôn có cách biến những buổi học dài thành một kỷ niệm vui.",
    hobbies: ["Chụp ảnh", "Trang trí sổ tay", "Lật playlist"],
  },
  {
    id: "ngoc-minh",
    name: "Ngọc Minh",
    nickname: "Min",
    avatarUrl: createAvatarPlaceholder("Ngọc Minh", placeholderPalettes.sky, 4),
    quote: "Im im vậy thôi chứ gặp đúng bài là sáng nhất nhóm.",
    shortBio:
      "Người giữ tài liệu và deadline cả lớp, lúc nào cũng bình tĩnh và đáng tin cậy.",
    hobbies: ["Coding", "Bóng rổ", "Lật notebook"],
  },
  {
    id: "bao-tram",
    name: "Bảo Trâm",
    nickname: "Trâm",
    avatarUrl: createAvatarPlaceholder(
      "Bảo Trâm",
      placeholderPalettes.lavender,
      -8,
    ),
    quote: "Một tấm hình đẹp là nhờ ai đó đã gọi em dậy sớm.",
    shortBio:
      "Chuyên gia selfie góc nghiêng thần thánh, đồng thời cũng là người tạo mood cho mọi sự kiện lớp.",
    hobbies: ["Edit video", "Nhảy", "Decor sticker"],
  },
  {
    id: "duc-khang",
    name: "Đức Khang",
    nickname: "Khang chill",
    avatarUrl: createAvatarPlaceholder("Đức Khang", placeholderPalettes.sun, 5),
    quote: "Kế hoạch có thể đổi, tinh thần đi ăn sau học thì không.",
    shortBio:
      "Người đề xuất mọi kế hoạch đi chơi và cũng là chủ nhân của những câu đùa làm cả lớp bật cười.",
    hobbies: ["Đá bóng", "Cà phê", "Chụp film"],
  },
  {
    id: "thao-nguyen",
    name: "Thảo Nguyên",
    nickname: "Táo",
    avatarUrl: createAvatarPlaceholder(
      "Thảo Nguyên",
      placeholderPalettes.mint,
      -4,
    ),
    quote: "Nhẹ nhàng thôi nhưng vẫn luôn có mặt khi bạn cần.",
    shortBio:
      "Người lắng nghe dễ thương nhất lớp, hay viết những dòng caption khiến ai đọc cũng thấy ấm lòng.",
    hobbies: ["Đọc sách", "Chăm cây", "Viết lưu bút"],
  },
  {
    id: "hoang-long",
    name: "Hoàng Long",
    nickname: "Long camera",
    avatarUrl: createAvatarPlaceholder(
      "Hoàng Long",
      placeholderPalettes.sky,
      -2,
    ),
    quote: "Cứu team bằng một bộ ảnh nét hơn cả kỳ vọng.",
    shortBio:
      "Người hay xuất hiện sau ống kính hơn trước ống kính, nhưng những khoảnh khắc đẹp nhất của lớp đều đi qua tay Long.",
    hobbies: ["Máy ảnh", "Vlog", "Đi bộ cuối chiều"],
  },
  {
    id: "linh-chi",
    name: "Linh Chi",
    nickname: "Chi mơ",
    avatarUrl: createAvatarPlaceholder("Linh Chi", placeholderPalettes.rose, 8),
    quote: "Nếu đã học chăm thì cũng phải yêu thương nhau thật nhiều.",
    shortBio:
      "Thủ kho động lực của nhóm bạn, luôn có một câu động viên đúng lúc trước mỗi bài kiểm tra.",
    hobbies: ["Ôn bài theo nhóm", "Làm bánh", "Nghe indie"],
  },
  {
    id: "quang-huy",
    name: "Quang Huy",
    nickname: "Huy mê mề",
    avatarUrl: createAvatarPlaceholder(
      "Quang Huy",
      placeholderPalettes.lavender,
      3,
    ),
    quote: "Nếu cả lớp đang im, khả năng cao là tôi sắp nói một câu rất dở.",
    shortBio:
      "Người gây cười không cần báo trước, chuyên gia tạo năng lượng trong những buổi học cuối tuần.",
    hobbies: ["Memes", "Bóng chuyền", "MC sự kiện"],
  },
];

export const memories: Memory[] = [
  {
    id: "tiet-van",
    title: "Tiết văn cuối chiều",
    date: "12/09/2024",
    imageUrl: createMemoryPlaceholder(
      "Tiết văn cuối chiều",
      "Nắng đổ qua khung cửa, cả lớp thì thầm vì sắp tan học.",
      placeholderPalettes.sky,
    ),
    caption:
      "Buổi chiều có gió, có bài giảng và có một góc lớp mà ai cũng muốn giữ lại.",
    category: "Lớp học",
  },
  {
    id: "hoi-trai-xuan",
    title: "Hội trại mùa xuân",
    date: "28/01/2025",
    imageUrl: createMemoryPlaceholder(
      "Hội trại mùa xuân",
      "Cờ dây căng, dây note và những bộ đồng phục đầy sắc màu.",
      placeholderPalettes.rose,
    ),
    caption:
      "Ngày mà gian trưng bày của lớp được chăm chút từ sớm đến tối, mệt mà vui vô cùng.",
    category: "Sự kiện",
  },
  {
    id: "da-ngoai-ho",
    title: "Dã ngoại bên hồ",
    date: "14/04/2025",
    imageUrl: createMemoryPlaceholder(
      "Dã ngoại bên hồ",
      "Bánh snack, khăn picnic và cả nhóm nói chuyện đến tận chiều.",
      placeholderPalettes.mint,
    ),
    caption:
      "Một ngày đi chơi nhẹ nhàng nhưng lại là kiểu ký ức dễ nhớ rất lâu.",
    category: "Đi chơi",
  },
  {
    id: "anh-dim-cau-thang",
    title: "Ảnh dìm ở cầu thang",
    date: "30/05/2025",
    imageUrl: createMemoryPlaceholder(
      "Ảnh dìm ở cầu thang",
      "Người đang pose thì trượt nhịp, người sau lưng lại cười quá trời.",
      placeholderPalettes.sun,
    ),
    caption:
      "Khoảnh khắc không được sắp đặt trước nhưng lại trở thành tấm ảnh cả lớp share nhiều nhất.",
    category: "Ảnh dìm vui",
  },
  {
    id: "tong-ket-hoc-ky",
    title: "Tổng kết học kỳ",
    date: "06/01/2026",
    imageUrl: createMemoryPlaceholder(
      "Tổng kết học kỳ",
      "Bảng tên, hoa nhỏ và những cái vỗ tay không đúng giờ.",
      placeholderPalettes.lavender,
    ),
    caption:
      "Cả lớp diện đồng phục thật đẹp, xếp hàng lên sân khấu mà ai cũng hơi run.",
    category: "Sự kiện",
  },
  {
    id: "goc-ban-cuoi",
    title: "Góc bàn cuối",
    date: "17/02/2026",
    imageUrl: createMemoryPlaceholder(
      "Góc bàn cuối",
      "Nơi xảy ra nhiều trò đùa nhất nhưng cũng là nơi giữ nhiều bí mật nhất.",
      placeholderPalettes.sky,
    ),
    caption:
      "Một góc nhỏ trong lớp, nơi những câu chuyện linh tinh lại thành kỷ niệm dễ thương.",
    category: "Lớp học",
  },
  {
    id: "banh-trang-sau-hoc",
    title: "Hẹn bánh tráng sau học",
    date: "25/03/2026",
    imageUrl: createMemoryPlaceholder(
      "Hẹn bánh tráng sau học",
      "Không cần dịp gì đặc biệt, chỉ cần tan học là đủ vui.",
      placeholderPalettes.rose,
    ),
    caption:
      "Những cuộc hẹn chóng nhoáng nhưng lại là một phần rất thật của tuổi học trò.",
    category: "Đi chơi",
  },
  {
    id: "anh-dim-sinh-nhat",
    title: "Sinh nhật bị chụp lén",
    date: "08/04/2026",
    imageUrl: createMemoryPlaceholder(
      "Sinh nhật bị chụp lén",
      "Nến và bánh đẹp đấy, chỉ có nhân vật chính là chưa sẵn sàng.",
      placeholderPalettes.sun,
    ),
    caption:
      "Tấm ảnh mà người trong ảnh muốn ẩn đi, còn cả lớp thì nhất quyết giữ lại.",
    category: "Ảnh dìm vui",
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: "first-day",
    title: "Ngày đầu vào lớp",
    date: "05/09/2023",
    description:
      "Từ những cái nhìn còn ngại ngùng, chúng ta bắt đầu biết tên nhau và đánh dấu một chương mới của tuổi học trò.",
    imageUrl: createMemoryPlaceholder(
      "Ngày đầu vào lớp",
      "Đồng phục còn mới và cảm giác gì cũng là lần đầu.",
      placeholderPalettes.sky,
    ),
  },
  {
    id: "first-event",
    title: "Sự kiện đầu tiên cả lớp làm cùng nhau",
    date: "20/11/2023",
    description:
      "Tự làm backdrop, tập tiết mục, chuẩn bị lời chúc. Sau ngày đó, lớp mình bắt đầu thật sự thành một tập thể.",
  },
  {
    id: "exam-season",
    title: "Mùa ôn thi cùng nhau",
    date: "18/06/2024",
    description:
      "Những buổi đổi tài liệu, giảng lại bài cho nhau và gửi một câu chúc may mắn trước giờ vào phòng thi.",
    imageUrl: createMemoryPlaceholder(
      "Mùa ôn thi",
      "Mệt một chút nhưng cũng thương nhau nhiều hơn.",
      placeholderPalettes.lavender,
    ),
  },
  {
    id: "picnic",
    title: "Chuyến dã ngoại gần cuối cấp",
    date: "14/04/2025",
    description:
      "Ngày mà ai cũng nhận ra rằng thanh xuân không nằm ở điều gì quá lớn, mà ở việc được ở cạnh nhau như thế.",
  },
  {
    id: "yearbook-shoot",
    title: "Buổi chụp kỷ yếu",
    date: "19/02/2026",
    description:
      "Đây là lần hiếm hoi cả lớp chăm chút từng chi tiết nhỏ cho nhau để giữ lại một phiên bản đẹp nhất của tuổi học trò.",
    imageUrl: createMemoryPlaceholder(
      "Buổi chụp kỷ yếu",
      "Áo trắng, hoa nhỏ và rất nhiều tiếng cười.",
      placeholderPalettes.rose,
    ),
  },
  {
    id: "farewell",
    title: "Ngày chia tay sân trường",
    date: "26/05/2026",
    description:
      "Không ai muốn nói tạm biệt quá sớm, nên chúng ta chọn cách lưu lại nhau trong một cuốn kỷ yếu đang được viết tiếp.",
  },
];

export const sampleGuestbookMessages: GuestbookMessage[] = [
  {
    id: "sample-1",
    name: "Cô vấn chủ nhiệm",
    message:
      "Cảm ơn lớp vì đã đi cùng nhau qua một hành trình đẹp. Mong các em luôn giữ lại sự trong trẻo này.",
    createdAt: "2026-04-20T07:30:00.000Z",
  },
  {
    id: "sample-2",
    name: "Bạn bàn cuối",
    message:
      "Mai một mỗi người có thể sẽ ở những nơi khác nhau, nhưng nhớ giữ liên lạc và nhớ rằng mình đã từng có một thanh xuân rất đẹp.",
    createdAt: "2026-04-22T11:00:00.000Z",
  },
];
