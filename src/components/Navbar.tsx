"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavigationItem } from "@/data/siteData";

type NavbarProps = {
  className: string;
  schoolName: string;
  items: NavigationItem[];
};

export default function Navbar({
  className,
  schoolName,
  items,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "#home");

  useEffect(() => {
    const sectionElements = items
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      {
        threshold: 0.24,
        rootMargin: "-38% 0px -45% 0px",
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="paper-card rounded-full px-3 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <a
              href="#home"
              className="flex min-w-0 items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/70"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6efff] text-[#7e6ca0]">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                  {className}
                </span>
                <span className="block truncate text-sm text-foreground">
                  {schoolName}
                </span>
              </span>
            </a>

            <nav className="hidden items-center gap-2 lg:flex">
              {items.map((item) => {
                const isActive = item.href === activeHref;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted hover:bg-white/70 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-foreground shadow-sm transition hover:bg-white lg:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isOpen ? (
              <motion.nav
                className="mt-3 grid gap-2 rounded-[1.7rem] border border-line bg-white/85 p-3 lg:hidden"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {items.map((item) => {
                  const isActive = item.href === activeHref;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#f8f4ff] text-foreground"
                          : "text-muted hover:bg-white hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
