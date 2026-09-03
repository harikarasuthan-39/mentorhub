import { useState, useEffect } from "react";

// Curated high-resolution professional portrait avatars for different roles & personas
export const DEFAULT_AVATARS: Record<string, string> = {
  STUDENT: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80",
  MENTOR: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80",
  HOD: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&auto=format&fit=crop&q=80",
};

export function getUserAvatar(email?: string | null, role?: string | null): string {
  if (!email && !role) return DEFAULT_AVATARS.DEFAULT;

  // 1. Check custom uploaded avatar in localStorage for specific user
  if (email) {
    const saved = localStorage.getItem(`maa_avatar_${email.toLowerCase().trim()}`);
    if (saved) return saved;
  }

  // 2. Check general avatar fallback in localStorage
  const general = localStorage.getItem("maa_user_avatar");
  if (general) return general;

  // 3. Known personas based on email
  const lower = (email || "").toLowerCase();
  if (lower.includes("student")) return DEFAULT_AVATARS.STUDENT;
  if (lower.includes("mentor") || lower.includes("faculty")) return DEFAULT_AVATARS.MENTOR;
  if (lower.includes("hod") || lower.includes("admin")) return DEFAULT_AVATARS.HOD;

  // 4. Role based defaults
  if (role === "STUDENT") return DEFAULT_AVATARS.STUDENT;
  if (role === "MENTOR") return DEFAULT_AVATARS.MENTOR;
  if (role === "HOD") return DEFAULT_AVATARS.HOD;

  return DEFAULT_AVATARS.DEFAULT;
}

export function setUserAvatar(email: string, avatarDataUrl: string): void {
  const key = `maa_avatar_${email.toLowerCase().trim()}`;
  localStorage.setItem(key, avatarDataUrl);
  localStorage.setItem("maa_user_avatar", avatarDataUrl);
  window.dispatchEvent(
    new CustomEvent("maa_avatar_changed", {
      detail: { email, avatarUrl: avatarDataUrl },
    })
  );
}

export function useUserAvatar(email?: string | null, role?: string | null) {
  const [avatar, setAvatar] = useState<string>(() => getUserAvatar(email, role));

  useEffect(() => {
    setAvatar(getUserAvatar(email, role));

    const handleAvatarChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ email?: string; avatarUrl?: string }>;
      if (!customEvent.detail?.email || customEvent.detail.email.toLowerCase() === (email || "").toLowerCase()) {
        setAvatar(getUserAvatar(email, role));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("maa_avatar_") || e.key === "maa_user_avatar") {
        setAvatar(getUserAvatar(email, role));
      }
    };

    window.addEventListener("maa_avatar_changed", handleAvatarChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("maa_avatar_changed", handleAvatarChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [email, role]);

  return avatar;
}
