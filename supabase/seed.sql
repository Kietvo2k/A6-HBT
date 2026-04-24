begin;

insert into public.members (
  id,
  name,
  nickname,
  avatar_url,
  quote,
  short_bio,
  hobbies,
  social_links,
  sort_order,
  is_published
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Mai Anh',
    'Miu',
    null,
    'Chỉ cần cả lớp cười là mọi thứ đều ổn.',
    'Người bắt trend nhanh nhất lớp, luôn có cách biến những buổi học dài thành một kỷ niệm vui.',
    array['Chụp ảnh', 'Trang trí sổ tay', 'Lật playlist'],
    '{"facebook":"https://facebook.com/maianh","instagram":"https://instagram.com/maianh"}'::jsonb,
    1,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Ngọc Minh',
    'Min',
    null,
    'Im im vậy thôi chứ gặp đúng bài là sáng nhất nhóm.',
    'Người giữ tài liệu và deadline cả lớp, lúc nào cũng bình tĩnh và đáng tin cậy.',
    array['Coding', 'Bóng rổ', 'Lật notebook'],
    '{"facebook":"https://facebook.com/ngocminh"}'::jsonb,
    2,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Bảo Trâm',
    'Trâm',
    null,
    'Một tấm hình đẹp là nhờ ai đó đã gọi em dậy sớm.',
    'Chuyên gia selfie góc nghiêng thần thánh, đồng thời cũng là người tạo mood cho mọi sự kiện lớp.',
    array['Edit video', 'Nhảy', 'Decor sticker'],
    '{"instagram":"https://instagram.com/baotram","tiktok":"https://tiktok.com/@baotram"}'::jsonb,
    3,
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Đức Khang',
    'Khang chill',
    null,
    'Kế hoạch có thể đổi, tinh thần đi ăn sau học thì không.',
    'Người đề xuất mọi kế hoạch đi chơi và cũng là chủ nhân của những câu đùa làm cả lớp bật cười.',
    array['Đá bóng', 'Cà phê', 'Chụp film'],
    '{"facebook":"https://facebook.com/duckhang"}'::jsonb,
    4,
    true
  )
on conflict (id) do update
set
  name = excluded.name,
  nickname = excluded.nickname,
  avatar_url = excluded.avatar_url,
  quote = excluded.quote,
  short_bio = excluded.short_bio,
  hobbies = excluded.hobbies,
  social_links = excluded.social_links,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into public.memories (
  id,
  title,
  memory_date,
  image_url,
  video_url,
  caption,
  category,
  album_name,
  sort_order,
  is_published
)
values
  (
    '55555555-5555-5555-5555-555555555551',
    'Tiết văn cuối chiều',
    '2024-09-12',
    null,
    null,
    'Buổi chiều có gió, có bài giảng và có một góc lớp mà ai cũng muốn giữ lại.',
    'classroom',
    'Năm học',
    1,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    'Hội trại mùa xuân',
    '2025-01-28',
    null,
    null,
    'Ngày mà gian trưng bày của lớp được chăm chút từ sớm đến tối, mệt mà vui vô cùng.',
    'event',
    'Sự kiện',
    2,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555553',
    'Dã ngoại bên hồ',
    '2025-04-14',
    null,
    null,
    'Một ngày đi chơi nhẹ nhàng nhưng lại là kiểu ký ức dễ nhớ rất lâu.',
    'outing',
    'Đi chơi',
    3,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555554',
    'Ảnh dìm ở cầu thang',
    '2025-05-30',
    null,
    null,
    'Khoảnh khắc không được sắp đặt trước nhưng lại trở thành tấm ảnh cả lớp share nhiều nhất.',
    'funny',
    'Ảnh vui',
    4,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  memory_date = excluded.memory_date,
  image_url = excluded.image_url,
  video_url = excluded.video_url,
  caption = excluded.caption,
  category = excluded.category,
  album_name = excluded.album_name,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into public.timeline_events (
  id,
  title,
  event_date,
  description,
  image_url,
  sort_order,
  is_published
)
values
  (
    '66666666-6666-6666-6666-666666666661',
    'Ngày đầu vào lớp',
    '2023-09-05',
    'Từ những cái nhìn còn ngại ngùng, chúng ta bắt đầu biết tên nhau và đánh dấu một chương mới của tuổi học trò.',
    null,
    1,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    'Sự kiện đầu tiên cả lớp làm cùng nhau',
    '2023-11-20',
    'Tự làm backdrop, tập tiết mục, chuẩn bị lời chúc. Sau ngày đó, lớp mình bắt đầu thật sự thành một tập thể.',
    null,
    2,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666663',
    'Mùa ôn thi cùng nhau',
    '2024-06-18',
    'Những buổi đổi tài liệu, giảng lại bài cho nhau và gửi một câu chúc may mắn trước giờ vào phòng thi.',
    null,
    3,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666664',
    'Buổi chụp kỷ yếu',
    '2026-02-19',
    'Đây là lần hiếm hoi cả lớp chăm chút từng chi tiết nhỏ cho nhau để giữ lại một phiên bản đẹp nhất của tuổi học trò.',
    null,
    4,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  event_date = excluded.event_date,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into public.guestbook_messages (
  id,
  sender_name,
  message,
  target_member_id,
  is_anonymous,
  status
)
values
  (
    '77777777-7777-7777-7777-777777777771',
    'Cô chủ nhiệm',
    'Cảm ơn lớp vì đã đi cùng nhau qua một hành trình đẹp. Mong các em luôn giữ lại sự trong trẻo này.',
    null,
    false,
    'approved'
  ),
  (
    '77777777-7777-7777-7777-777777777772',
    'Bạn bàn cuối',
    'Mai một mỗi người có thể sẽ ở những nơi khác nhau, nhưng nhớ giữ liên lạc và nhớ rằng mình đã từng có một thanh xuân rất đẹp.',
    null,
    false,
    'approved'
  ),
  (
    '77777777-7777-7777-7777-777777777773',
    'Một người bí mật',
    'Chúc cả lớp lúc nào cũng đủ dũng cảm để đi tiếp những điều mình thích.',
    '11111111-1111-1111-1111-111111111111',
    true,
    'pending'
  )
on conflict (id) do update
set
  sender_name = excluded.sender_name,
  message = excluded.message,
  target_member_id = excluded.target_member_id,
  is_anonymous = excluded.is_anonymous,
  status = excluded.status;

insert into public.quiz_questions (
  id,
  question,
  options,
  correct_option_id,
  success_message,
  fail_message,
  is_active
)
values
  (
    '88888888-8888-8888-8888-888888888881',
    'Ai là người hay nhắc cả lớp nộp bài đúng hạn nhất?',
    '[
      {"id":"A","label":"A","text":"Lớp trưởng bí ẩn"},
      {"id":"B","label":"B","text":"Người giữ deadline của nhóm"},
      {"id":"C","label":"C","text":"Bạn hay quên vở nhất lớp"},
      {"id":"D","label":"D","text":"Người chỉ xuất hiện khi có đồ ăn"}
    ]'::jsonb,
    'B',
    'Đúng rồi, cánh cửa ký ức mở ra thôi.',
    'Sai một chút rồi, thử nghĩ lại người hay giữ deadline cho cả lớp nhé.',
    true
  ),
  (
    '88888888-8888-8888-8888-888888888882',
    'Buổi nào làm cả lớp cười nhiều nhất?',
    '[
      {"id":"A","label":"A","text":"Giờ kiểm tra miệng"},
      {"id":"B","label":"B","text":"Lúc quên trực nhật"},
      {"id":"C","label":"C","text":"Ngày chụp kỷ yếu"},
      {"id":"D","label":"D","text":"Tiết thể dục trời mưa"}
    ]'::jsonb,
    'C',
    'Chính xác, mở tiếp hành trình thôi.',
    'Chưa đúng đâu, thử đoán buổi mà cả lớp chăm chút nhất nhé.',
    false
  )
on conflict (id) do update
set
  question = excluded.question,
  options = excluded.options,
  correct_option_id = excluded.correct_option_id,
  success_message = excluded.success_message,
  fail_message = excluded.fail_message,
  is_active = excluded.is_active;

insert into public.secret_letters (
  id,
  sender_name,
  target_member_id,
  message,
  is_anonymous,
  status,
  is_public
)
values
  (
    '99999999-9999-9999-9999-999999999991',
    'Một người bạn cùng lớp',
    null,
    'Cảm ơn cả lớp vì đã biến những ngày bình thường thành điều rất đáng nhớ.',
    true,
    'approved',
    true
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    'Người gửi giấu tên',
    '22222222-2222-2222-2222-222222222222',
    'Hy vọng sau này bạn vẫn luôn giữ được sự bình tĩnh và ấm áp như bây giờ.',
    true,
    'pending',
    false
  )
on conflict (id) do update
set
  sender_name = excluded.sender_name,
  target_member_id = excluded.target_member_id,
  message = excluded.message,
  is_anonymous = excluded.is_anonymous,
  status = excluded.status,
  is_public = excluded.is_public;

insert into public.vote_categories (
  id,
  title,
  description,
  is_active,
  is_visible
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Cây hài của lớp',
    'Người luôn khiến cả nhóm bật cười đúng lúc.',
    true,
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Người chăm chỉ nhất',
    'Bạn luôn giữ nhịp học tập cho cả lớp.',
    true,
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'Nụ cười tỏa nắng',
    'Gương mặt làm bầu không khí nhẹ hơn mỗi ngày.',
    true,
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    'Category đang ẩn',
    'Dùng để test phía admin.',
    false,
    false
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  is_active = excluded.is_active,
  is_visible = excluded.is_visible;

insert into public.votes (
  id,
  category_id,
  target_member_id,
  voter_key
)
values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '44444444-4444-4444-4444-444444444444',
    'seed-voter-cat1-1'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '44444444-4444-4444-4444-444444444444',
    'seed-voter-cat1-2'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'seed-voter-cat1-3'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'seed-voter-cat2-1'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'seed-voter-cat2-2'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '33333333-3333-3333-3333-333333333333',
    'seed-voter-cat2-3'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '11111111-1111-1111-1111-111111111111',
    'seed-voter-cat3-1'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    'seed-voter-cat3-2'
  )
on conflict (id) do update
set
  category_id = excluded.category_id,
  target_member_id = excluded.target_member_id,
  voter_key = excluded.voter_key;

insert into public.time_capsules (
  id,
  sender_name,
  message,
  unlock_date,
  status
)
values
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    'Mai Anh',
    'Mong sau này khi mở lại, chúng mình vẫn còn nhớ cảm giác ngồi cạnh nhau trong những chiều rất bình thường.',
    (current_date - interval '30 days')::date,
    'opened'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    'Ngọc Minh',
    'Hy vọng phiên bản tương lai của mình vẫn giữ được sự bình tĩnh và tử tế với mọi người.',
    (current_date + interval '60 days')::date,
    'locked'
  )
on conflict (id) do update
set
  sender_name = excluded.sender_name,
  message = excluded.message,
  unlock_date = excluded.unlock_date,
  status = excluded.status;

insert into public.reactions (
  id,
  target_type,
  target_id,
  reaction_type,
  voter_key
)
values
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'member',
    '11111111-1111-1111-1111-111111111111',
    'love',
    'seed-reaction-member-1'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'member',
    '11111111-1111-1111-1111-111111111111',
    'love',
    'seed-reaction-member-2'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    'member',
    '22222222-2222-2222-2222-222222222222',
    'love',
    'seed-reaction-member-3'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd4',
    'memory',
    '55555555-5555-5555-5555-555555555551',
    'love',
    'seed-reaction-memory-1'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd5',
    'memory',
    '55555555-5555-5555-5555-555555555551',
    'love',
    'seed-reaction-memory-2'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd6',
    'memory',
    '55555555-5555-5555-5555-555555555552',
    'love',
    'seed-reaction-memory-3'
  )
on conflict (id) do update
set
  target_type = excluded.target_type,
  target_id = excluded.target_id,
  reaction_type = excluded.reaction_type,
  voter_key = excluded.voter_key;

commit;
