# Thanh Xuân Vườn Trường - Phase 3 + 4

Website kỷ yếu lớp đã được nâng từ bản frontend-only lên bản web app có Supabase, admin dashboard và các tính năng tương tác thật, nhưng vẫn giữ giao diện yearbook mềm mại của Phase 1.

## Stack hiện tại

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase PostgreSQL
- Supabase Auth
- `@supabase/ssr` cho session/auth trong App Router

## Những gì đã có trong Phase 3 + 4

### Public website

- Unlock quiz lấy từ database nếu có quiz active, fallback về `siteData.ts` nếu chưa có
- Members, memories, timeline, guestbook lấy từ Supabase và vẫn giữ local fallback an toàn
- Guestbook gửi qua database, mặc định `status = 'pending'`
- Secret letters public form + moderation flow
- Fun voting với giới hạn 1 vote mỗi category theo `voter_key`
- Time capsule public form + logic khóa/mở theo `unlock_date`
- Random memory trong gallery
- Love reactions lưu vào database cho member và memory
- Loading/error/empty state cho các khu vực có dữ liệu động

### Admin

- Login bằng Supabase Auth
- Role dựa trên bảng `profiles`
- Route `/admin/*` chỉ cho `profiles.role = 'admin'`
- Non-admin vào admin sẽ bị chuyển tới `/admin/access-denied`
- Thiếu Supabase env sẽ không crash build; `/login` hiển thị hướng dẫn setup
- Dashboard overview
- CRUD members
- CRUD memories
- CRUD timeline events
- Guestbook moderation
- Quiz management
- Secret letter moderation
- Vote category management + results
- Time capsule management

## Cấu trúc chính

```text
src/
  app/
    admin/
      (protected)/
        actions.ts
        layout.tsx
        page.tsx
        members/page.tsx
        memories/page.tsx
        timeline/page.tsx
        guestbook/page.tsx
        quiz/page.tsx
        secret-letters/page.tsx
        votes/page.tsx
        time-capsule/page.tsx
      access-denied/page.tsx
    api/
      guestbook/route.ts
      reactions/route.ts
      secret-letters/route.ts
      time-capsules/route.ts
      votes/route.ts
    login/page.tsx
    page.tsx
  components/
    admin/
    auth/
    FunVotingSection.tsx
    GuestbookSection.tsx
    LoveReactionButton.tsx
    RandomMemorySection.tsx
    SecretLettersSection.tsx
    TimeCapsuleSection.tsx
    YearbookApp.tsx
  data/
    interactiveFallbackData.ts
    siteData.ts
  lib/
    admin-data.ts
    auth.ts
    yearbook-content.ts
    supabase/
      browser.ts
      env.ts
      middleware.ts
      server.ts
  types/
    yearbook.ts
supabase/
  schema.sql
  seed.sql
middleware.ts
.env.example
```

## Setup Supabase

### 1. Tạo project và schema

1. Tạo một project mới trên Supabase.
2. Mở `SQL Editor`.
3. Chạy `supabase/schema.sql`.
4. Nếu muốn có dữ liệu mẫu cho public/admin flow, chạy tiếp `supabase/seed.sql`.

### 2. Tạo file env

Tạo `.env.local` từ `.env.example`.

```powershell
Copy-Item .env.example .env.local
```

Điền các biến sau:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Lưu ý:

- Không hardcode key trong source code
- Không dùng `service_role` ở frontend
- Project hiện chỉ cần public URL + anon key để chạy app

### 3. Tạo admin user

1. Vào Supabase Dashboard > `Authentication` > `Users`.
2. Tạo user mới bằng email/password.
3. Trigger `handle_new_user()` sẽ tự tạo row trong `public.profiles`.
4. Mở `Table Editor` hoặc `SQL Editor` và nâng role:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

5. Đăng nhập tại `/login`.

## Cách chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

Kiểm tra chất lượng:

```bash
npm run lint
npm run build
```

## Database tables đang dùng

- `profiles`
- `members`
- `memories`
- `timeline_events`
- `guestbook_messages`
- `quiz_questions`
- `secret_letters`
- `vote_categories`
- `votes`
- `time_capsules`
- `reactions`

## Auth và route protection

- Public website không cần login
- Admin area dùng Supabase Auth + `profiles.role`
- `profiles.role` hỗ trợ: `admin`, `member`, `guest`
- `/admin/*` dùng guard server-side qua `requireAdminAccess()`
- Nếu chưa login: redirect về `/login`
- Nếu đã login nhưng không phải admin: redirect về `/admin/access-denied`
- Nếu thiếu env Supabase: `/login` sẽ hiện setup notice thay vì crash

## RLS summary

`supabase/schema.sql` đã có RLS tối thiểu cho Phase 3 + 4:

- Public chỉ đọc `members`, `memories`, `timeline_events` khi `is_published = true`
- Public chỉ đọc guestbook khi `status = 'approved'`
- Public chỉ đọc secret letters khi `status = 'approved'` và `is_public = true`
- Public chỉ đọc quiz active
- Public chỉ đọc vote category khi `is_active = true` và `is_visible = true`
- Public có thể insert:
  - guestbook pending
  - secret letters pending
  - votes hợp lệ
  - time capsules locked
  - reactions loại `love`
- Admin có thể quản lý toàn bộ nội dung qua policy `public.is_admin()`

Nếu bạn sửa schema theo dự án thật, hãy review lại RLS trước khi public website.

## Dữ liệu và fallback

- `siteConfig` và nội dung static gốc vẫn nằm ở `src/data/siteData.ts`
- Public content ưu tiên đọc từ Supabase
- Nếu thiếu env hoặc query lỗi, public side vẫn có fallback local để không vỡ giao diện
- Quiz cũng có fallback local nếu database chưa có quiz active
- Guestbook local fallback chỉ dùng khi Supabase chưa sẵn sàng

## Checklist test thủ công

### Public

1. Vào web khi chưa unlock.
2. Chọn sai quiz và xem fail message.
3. Chọn đúng quiz và mở website chính.
4. Xem members và thả tim.
5. Xem memories, lọc category, mở modal ảnh.
6. Dùng `Random memory`.
7. Gửi guestbook.
8. Kiểm tra guestbook mới không hiện public ngay.
9. Gửi secret letter.
10. Vote một category.
11. Xem kết quả vote tăng lên.
12. Gửi time capsule.
13. Xác nhận capsule chưa tới ngày mở không lộ message.
14. Test mobile cho toàn bộ flow.

### Admin

1. Đăng nhập bằng tài khoản admin.
2. Vào `/admin`.
3. Thêm/sửa/xóa/ẩn member.
4. Thêm/sửa/xóa/ẩn memory.
5. Thêm/sửa/xóa/ẩn timeline event.
6. Approve/reject/delete guestbook message.
7. Sửa quiz và đặt active quiz.
8. Approve/reject secret letter, bật/tắt public.
9. Tạo/sửa/xóa vote category.
10. Xem vote results.
11. Sửa hoặc ẩn time capsule.
12. Logout.
13. Dùng tài khoản non-admin thử vào `/admin`.

### Build và env

1. Chạy `npm run lint`
2. Chạy `npm run build`
3. Xóa env và kiểm tra public site vẫn fallback được
4. Truy cập `/login` khi thiếu env để kiểm tra setup notice
5. Kiểm tra browser console không có lỗi nghiêm trọng

## Hạn chế hiện tại

- Chưa có upload ảnh thật lên Supabase Storage
- Chưa có admin CRUD riêng cho secret letters và time capsules theo kiểu “tạo mới từ dashboard”; hiện admin chủ yếu moderate/chỉnh dữ liệu đã có
- Chưa có rate limiting mạnh ở server, mới dừng ở `voter_key` + unique constraints + localStorage
- Chưa có realtime
- Chưa có admin dashboard cho profile management ngoài role cơ bản

## Gợi ý cho Phase 5

- Upload media thật bằng Supabase Storage
- Search/filter tốt hơn trong dashboard
- Bulk moderation cho guestbook và secret letters
- CSV import cho members
- Realtime refresh cho reactions/votes/guestbook moderation
- Audit log đơn giản cho admin actions
