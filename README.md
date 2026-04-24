# Thanh Xuân Vườn Trường

Website kỷ yếu lớp hoàn chỉnh với giao diện yearbook cảm xúc, dữ liệu thật trên Supabase, khu vực quản trị và các tính năng tương tác dành cho lớp.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase PostgreSQL
- Supabase Auth
- `@supabase/ssr`

## Tính năng chính

### Public website

- Unlock quiz trước khi vào web
- Hero, navbar, members, memories, timeline, guestbook, music
- Secret letters
- Fun voting
- Time capsule
- Random memory
- Love reactions
- Loading, error và empty states
- Local fallback khi Supabase chưa sẵn sàng

### Admin dashboard

- Login bằng Supabase Auth
- Role admin qua bảng `profiles`
- Dashboard overview
- CRUD members
- CRUD memories
- CRUD timeline events
- Guestbook moderation
- Quiz management
- Secret letter moderation
- Vote category management và results
- Time capsule management

## Cấu trúc chính

```text
src/
  app/
    admin/
      (protected)/
      access-denied/
    api/
    login/
    page.tsx
  components/
    admin/
    auth/
  data/
    interactiveFallbackData.ts
    siteData.ts
  lib/
    admin-data.ts
    auth.ts
    yearbook-content.ts
    supabase/
  types/
    yearbook.ts
supabase/
  schema.sql
  seed.sql
middleware.ts
.env.example
```

## Setup

### 1. Tạo env

Tạo `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Điền:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Lưu ý:

- Không dùng `service_role` ở frontend
- Không commit `.env.local`

### 2. Chạy schema và seed

Trong Supabase `SQL Editor`, chạy lần lượt:

1. [schema.sql](/D:/11A6/supabase/schema.sql)
2. [seed.sql](/D:/11A6/supabase/seed.sql)

### 3. Tạo admin user

Tạo user trong `Authentication > Users`, sau đó chạy:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

## Chạy local

```bash
npm install
npm run dev
```

Kiểm tra chất lượng:

```bash
npm run lint
npm run build
```

## Database tables

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
- `/admin/*` yêu cầu user đăng nhập và có `profiles.role = 'admin'`
- Non-admin sẽ bị chuyển tới `/admin/access-denied`
- Thiếu env Supabase thì `/login` hiển thị hướng dẫn setup thay vì crash

## RLS

Schema hiện có RLS cơ bản:

- Public chỉ đọc nội dung đã publish/approved
- Public chỉ insert vào các bảng tương tác an toàn như guestbook, secret letters, votes, time capsules, reactions
- Admin quản lý nội dung qua `public.is_admin()`

Nếu dùng cho dữ liệu lớp thật, nên review thêm policy trước khi public rộng rãi.

## Checklist test

### Public

1. Vào web và thử quiz sai/đúng
2. Xem members, memories, timeline
3. Mở random memory
4. Gửi guestbook
5. Gửi secret letter
6. Vote một category
7. Gửi time capsule
8. Thả tim member/memory
9. Test mobile

### Admin

1. Login admin
2. Vào `/admin`
3. CRUD members
4. CRUD memories
5. CRUD timeline
6. Duyệt guestbook
7. Duyệt secret letters
8. Sửa quiz
9. Tạo/sửa vote category
10. Quản lý time capsule
11. Logout

### Build

1. `npm run lint`
2. `npm run build`
3. Test khi thiếu env
4. Kiểm tra browser console

## Hạn chế hiện tại

- Chưa có upload media thật lên Supabase Storage
- Chưa có realtime
- Chưa có rate limiting mạnh ở server
- Chưa có audit log admin

## Hướng mở rộng tiếp

- Upload media bằng Supabase Storage
- Bulk moderation cho guestbook và secret letters
- Search/filter tốt hơn trong admin
- CSV import cho members
- Realtime refresh cho vote và reaction
- Audit log đơn giản
