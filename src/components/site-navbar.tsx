'use client';

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { dictEn } from "@/dictionaries/en";
import { dictMs } from "@/dictionaries/ms";
import { IoLanguageOutline } from "react-icons/io5";

const locales = ["ms", "en"] as const;

type Locale = (typeof locales)[number];

function useLocale(): Locale {
  const pathname = usePathname() ?? "/ms";
  const seg = pathname.split("/")[1];
  return (locales.includes(seg as Locale) ? (seg as Locale) : "ms");
}

export function SiteNavbar() {
  const locale = useLocale();
  const dict = locale === "en" ? dictEn : dictMs;
  const pathname = usePathname() ?? "/ms";
  const router = useRouter();

  const toggleLocale = () => {
    const parts = pathname.split("/");
    const current = parts[1] === "en" ? "en" : "ms";
    parts[1] = current === "ms" ? "en" : "ms";
    const next = parts.join("/") || "/";
    router.push(next);
  };

  return (
    <>
      <Link href={`/${locale}`} className="font-semibold tracking-tight flex items-center gap-2">
        <img src="/icon.svg" alt="BinaRig icon" width={20} height={20} />
        <span className="font-heading tracking-tight">BinaRig</span>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLocale}
          aria-label="Switch language"
          className="px-2 sm:px-3"
        >
          <IoLanguageOutline className="mr-1 sm:mr-2 size-4" />
          {locale === "ms" ? (
            <span>
              <span className="sm:hidden">EN</span>
              <span className="hidden sm:inline">English</span>
            </span>
          ) : (
            <span>
              <span className="sm:hidden">MS</span>
              <span className="hidden sm:inline">Bahasa Melayu</span>
            </span>
          )}
        </Button>
        <ThemeToggle labels={dict.themeToggle} />
      </div>
    </>
  );
}