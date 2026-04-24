"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth";

function getString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key)?.toString() === "on";
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key)?.toString() ?? "0");
  return Number.isFinite(value) ? value : 0;
}

function getStringArray(formData: FormData, key: string) {
  return getString(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSocialLinks(formData: FormData) {
  const pairs = [
    ["facebook", getString(formData, "social_facebook")],
    ["instagram", getString(formData, "social_instagram")],
    ["tiktok", getString(formData, "social_tiktok")],
  ] as const;

  return Object.fromEntries(pairs.filter(([, value]) => Boolean(value)));
}

function revalidateYearbook(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function upsertMemberAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/members");
  const id = getString(formData, "id");
  const name = getString(formData, "name");

  if (!name) {
    return;
  }

  const payload = {
    name,
    nickname: getString(formData, "nickname"),
    avatar_url: getNullableString(formData, "avatar_url"),
    quote: getString(formData, "quote"),
    short_bio: getString(formData, "short_bio"),
    hobbies: getStringArray(formData, "hobbies"),
    social_links: getSocialLinks(formData),
    sort_order: getNumber(formData, "sort_order"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (id) {
    await supabase.from("members").update(payload).eq("id", id);
  } else {
    await supabase.from("members").insert(payload);
  }

  revalidateYearbook(["/", "/admin", "/admin/members", "/admin/votes"]);
}

export async function deleteMemberAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/members");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("members").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/members", "/admin/votes"]);
}

export async function upsertMemoryAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/memories");
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const date = getString(formData, "memory_date");

  if (!title || !date) {
    return;
  }

  const payload = {
    title,
    memory_date: date,
    image_url: getNullableString(formData, "image_url"),
    video_url: getNullableString(formData, "video_url"),
    caption: getString(formData, "caption"),
    category: getString(formData, "category") || "event",
    album_name: getNullableString(formData, "album_name"),
    sort_order: getNumber(formData, "sort_order"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (id) {
    await supabase.from("memories").update(payload).eq("id", id);
  } else {
    await supabase.from("memories").insert(payload);
  }

  revalidateYearbook(["/", "/admin", "/admin/memories"]);
}

export async function deleteMemoryAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/memories");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("memories").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/memories"]);
}

export async function upsertTimelineAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/timeline");
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const date = getString(formData, "event_date");

  if (!title || !date) {
    return;
  }

  const payload = {
    title,
    event_date: date,
    description: getString(formData, "description"),
    image_url: getNullableString(formData, "image_url"),
    sort_order: getNumber(formData, "sort_order"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (id) {
    await supabase.from("timeline_events").update(payload).eq("id", id);
  } else {
    await supabase.from("timeline_events").insert(payload);
  }

  revalidateYearbook(["/", "/admin", "/admin/timeline"]);
}

export async function deleteTimelineAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/timeline");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("timeline_events").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/timeline"]);
}

export async function moderateGuestbookAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/guestbook");
  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id || !status) {
    return;
  }

  await supabase.from("guestbook_messages").update({ status }).eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/guestbook"]);
}

export async function deleteGuestbookAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/guestbook");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("guestbook_messages").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/guestbook"]);
}

export async function upsertQuizAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/quiz");
  const id = getString(formData, "id");
  const question = getString(formData, "question");

  if (!question) {
    return;
  }

  const options = [
    { id: "A", label: "A", text: getString(formData, "option_a") },
    { id: "B", label: "B", text: getString(formData, "option_b") },
    { id: "C", label: "C", text: getString(formData, "option_c") },
    { id: "D", label: "D", text: getString(formData, "option_d") },
  ].filter((option) => option.text);
  const isActive = getBoolean(formData, "is_active");

  const payload = {
    question,
    options,
    correct_option_id: getString(formData, "correct_option_id") || "A",
    success_message: getString(formData, "success_message"),
    fail_message: getString(formData, "fail_message"),
    is_active: isActive,
  };

  if (isActive) {
    await supabase.from("quiz_questions").update({ is_active: false }).neq("id", id || "00000000-0000-0000-0000-000000000000");
  }

  if (id) {
    await supabase.from("quiz_questions").update(payload).eq("id", id);
  } else {
    await supabase.from("quiz_questions").insert(payload);
  }

  revalidateYearbook(["/", "/admin", "/admin/quiz"]);
}

export async function setQuizActiveAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/quiz");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("quiz_questions").update({ is_active: false }).neq("id", id);
  await supabase.from("quiz_questions").update({ is_active: true }).eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/quiz"]);
}

export async function deleteQuizAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/quiz");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("quiz_questions").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/quiz"]);
}

export async function moderateSecretLetterAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/secret-letters");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase
    .from("secret_letters")
    .update({
      status: getString(formData, "status"),
      is_public: getBoolean(formData, "is_public"),
    })
    .eq("id", id);

  revalidateYearbook(["/", "/admin", "/admin/secret-letters"]);
}

export async function deleteSecretLetterAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/secret-letters");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("secret_letters").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/secret-letters"]);
}

export async function upsertVoteCategoryAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/votes");
  const id = getString(formData, "id");
  const title = getString(formData, "title");

  if (!title) {
    return;
  }

  const payload = {
    title,
    description: getNullableString(formData, "description"),
    is_active: getBoolean(formData, "is_active"),
    is_visible: getBoolean(formData, "is_visible"),
  };

  if (id) {
    await supabase.from("vote_categories").update(payload).eq("id", id);
  } else {
    await supabase.from("vote_categories").insert(payload);
  }

  revalidateYearbook(["/", "/admin", "/admin/votes"]);
}

export async function deleteVoteCategoryAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/votes");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("vote_categories").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/votes"]);
}

export async function updateTimeCapsuleAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/time-capsule");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase
    .from("time_capsules")
    .update({
      sender_name: getString(formData, "sender_name"),
      message: getString(formData, "message"),
      unlock_date: getString(formData, "unlock_date"),
      status: getString(formData, "status") || "locked",
    })
    .eq("id", id);

  revalidateYearbook(["/", "/admin", "/admin/time-capsule"]);
}

export async function deleteTimeCapsuleAction(formData: FormData) {
  const { supabase } = await requireAdminAccess("/admin/time-capsule");
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  await supabase.from("time_capsules").delete().eq("id", id);
  revalidateYearbook(["/", "/admin", "/admin/time-capsule"]);
}
