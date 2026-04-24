import "server-only";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "./supabase/env";
import { createSupabaseServerClient } from "./supabase/server";

export async function getCurrentProfile() {
  if (!hasSupabaseEnv()) {
    return {
      supabase: null,
      user: null,
      profile: null,
      missingEnv: true as const,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null,
      missingEnv: false as const,
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data
    ? {
        id: data.id,
        displayName: data.display_name,
        email: data.email,
        role: data.role,
        createdAt: data.created_at,
      }
    : null;

  return {
    supabase,
    user,
    profile,
    missingEnv: false as const,
  };
}

export async function requireAdminAccess(nextPath = "/admin") {
  if (!hasSupabaseEnv()) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}&missing_env=1`);
  }

  const { supabase, user, profile } = await getCurrentProfile();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!profile || profile.role !== "admin") {
    redirect("/admin/access-denied");
  }

  return {
    supabase,
    user,
    profile,
  };
}

export async function requireAuthenticatedUser(nextPath = "/admin") {
  if (!hasSupabaseEnv()) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}&missing_env=1`);
  }

  const { supabase, user, profile } = await getCurrentProfile();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return {
    supabase,
    user,
    profile,
  };
}
