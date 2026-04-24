type PlaceholderPalette = {
  background: string;
  secondary: string;
  accent: string;
  ink: string;
};

export const placeholderPalettes = {
  sky: {
    background: "#DDEEFF",
    secondary: "#F8FCFF",
    accent: "#6EAAD7",
    ink: "#35506C",
  },
  rose: {
    background: "#FFE0E9",
    secondary: "#FFF8FA",
    accent: "#DD7F9D",
    ink: "#6C3B4B",
  },
  sun: {
    background: "#FFE8BF",
    secondary: "#FFF9EB",
    accent: "#DFA25B",
    ink: "#73563A",
  },
  lavender: {
    background: "#ECE4FF",
    secondary: "#FBF9FF",
    accent: "#9B8BD8",
    ink: "#514473",
  },
  mint: {
    background: "#DDF5EA",
    secondary: "#F7FFFB",
    accent: "#6FAE8F",
    ink: "#355B48",
  },
} satisfies Record<string, PlaceholderPalette>;

function toDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function createAvatarPlaceholder(
  name: string,
  palette: PlaceholderPalette,
  rotation = 0,
) {
  const initials = getInitials(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 500" fill="none">
      <defs>
        <linearGradient id="avatar-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.background}" />
          <stop offset="100%" stop-color="${palette.secondary}" />
        </linearGradient>
      </defs>
      <rect width="420" height="500" rx="48" fill="url(#avatar-gradient)" />
      <circle cx="328" cy="92" r="54" fill="${palette.secondary}" fill-opacity="0.92" />
      <circle cx="138" cy="122" r="12" fill="${palette.accent}" fill-opacity="0.22" />
      <circle cx="300" cy="356" r="18" fill="${palette.accent}" fill-opacity="0.18" />
      <path d="M78 116c34-48 108-64 176-42 56 18 92 66 96 126 2 38-6 68-28 100-28 40-74 76-136 76-52 0-98-22-124-58C40 292 30 260 32 220c2-40 18-76 46-104Z" fill="#fff" fill-opacity="0.56" />
      <circle cx="210" cy="190" r="82" fill="${palette.secondary}" fill-opacity="0.98" />
      <rect x="112" y="284" width="196" height="114" rx="57" fill="${palette.secondary}" fill-opacity="0.98" />
      <path d="M78 406c26 18 62 28 108 28 84 0 132-28 160-52" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round" />
      <g transform="translate(78 54) rotate(${rotation} 126 170)">
        <rect x="42" y="186" width="168" height="168" rx="30" fill="${palette.accent}" fill-opacity="0.13" />
        <text x="126" y="252" text-anchor="middle" font-size="74" font-family="Georgia, serif" font-weight="700" fill="${palette.ink}">
          ${escapeXml(initials)}
        </text>
        <text x="126" y="290" text-anchor="middle" font-size="16" font-family="Verdana, sans-serif" fill="${palette.ink}" fill-opacity="0.72">
          yearbook card
        </text>
      </g>
    </svg>
  `;

  return toDataUrl(svg);
}

export function createMemoryPlaceholder(
  title: string,
  subtitle: string,
  palette: PlaceholderPalette,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" fill="none">
      <defs>
        <linearGradient id="memory-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.background}" />
          <stop offset="100%" stop-color="${palette.secondary}" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" rx="36" fill="url(#memory-gradient)" />
      <rect x="26" y="26" width="588" height="368" rx="28" fill="#fff" fill-opacity="0.42" />
      <circle cx="114" cy="126" r="36" fill="${palette.accent}" fill-opacity="0.18" />
      <circle cx="522" cy="92" r="56" fill="${palette.secondary}" fill-opacity="0.88" />
      <rect x="56" y="84" width="528" height="228" rx="28" fill="${palette.secondary}" fill-opacity="0.96" />
      <path d="M56 252l112-84 92 70 76-56 184 130H56Z" fill="${palette.accent}" fill-opacity="0.24" />
      <path d="M56 272l88-58 90 38 88-74 92 42 90-56 80 108H56Z" fill="${palette.accent}" fill-opacity="0.42" />
      <text x="64" y="355" font-size="42" font-family="Georgia, serif" font-weight="700" fill="${palette.ink}">
        ${escapeXml(title)}
      </text>
      <text x="64" y="386" font-size="18" font-family="Verdana, sans-serif" fill="${palette.ink}" fill-opacity="0.78">
        ${escapeXml(subtitle)}
      </text>
    </svg>
  `;

  return toDataUrl(svg);
}
