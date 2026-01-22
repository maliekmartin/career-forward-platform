// Professional, diverse avatar presets
// Using DiceBear API for consistent, professional avatars

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
}

// Professional avatars with diverse representations
// Using DiceBear's "lorelei" style for professional, neutral look
export const avatarPresets: AvatarPreset[] = [
  {
    id: "avatar-1",
    name: "Professional 1",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional1&backgroundColor=b6e3f4",
  },
  {
    id: "avatar-2",
    name: "Professional 2",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional2&backgroundColor=c0aede",
  },
  {
    id: "avatar-3",
    name: "Professional 3",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional3&backgroundColor=d1d4f9",
  },
  {
    id: "avatar-4",
    name: "Professional 4",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional4&backgroundColor=ffd5dc",
  },
  {
    id: "avatar-5",
    name: "Professional 5",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=executive1&backgroundColor=ffdfbf",
  },
  {
    id: "avatar-6",
    name: "Professional 6",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=executive2&backgroundColor=c1f0c1",
  },
  {
    id: "avatar-7",
    name: "Professional 7",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=manager1&backgroundColor=b6e3f4",
  },
  {
    id: "avatar-8",
    name: "Professional 8",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=manager2&backgroundColor=c0aede",
  },
  {
    id: "avatar-9",
    name: "Professional 9",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=specialist1&backgroundColor=ffd5dc",
  },
  {
    id: "avatar-10",
    name: "Professional 10",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=specialist2&backgroundColor=d1d4f9",
  },
  {
    id: "avatar-11",
    name: "Professional 11",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=analyst1&backgroundColor=ffdfbf",
  },
  {
    id: "avatar-12",
    name: "Professional 12",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=analyst2&backgroundColor=c1f0c1",
  },
];

export function getAvatarById(id: string): AvatarPreset | undefined {
  return avatarPresets.find((avatar) => avatar.id === id);
}

export function getDefaultAvatar(): AvatarPreset {
  return avatarPresets[0];
}
