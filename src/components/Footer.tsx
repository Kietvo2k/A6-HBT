import type { SiteConfig } from "@/data/siteData";

type FooterProps = {
  siteConfig: SiteConfig;
};

export default function Footer({ siteConfig }: FooterProps) {
  return (
    <footer className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/75 px-5 py-8 shadow-[0_20px_48px_rgba(149,134,173,0.12)] backdrop-blur-xl sm:px-8">
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">
            {siteConfig.className} • {siteConfig.year}
          </p>
          <p className="mx-auto max-w-3xl text-base leading-8 text-foreground sm:text-lg">
            {siteConfig.closingText}
          </p>
          <p className="text-sm text-muted">{siteConfig.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
