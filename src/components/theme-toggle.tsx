"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

type ThemeToggleLabels = {
  lightMode: string;
  darkMode: string;
  loading: string;
};

export function ThemeToggle({ labels }: { labels?: ThemeToggleLabels }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled className="px-2 sm:px-3">
        {labels?.loading ?? "Loading theme…"}
      </Button>
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="px-2 sm:px-3 text-black border border-black dark:text-white dark:border-white"
    >
      {isDark ? <IoSunnyOutline className="mr-1 sm:mr-2 size-4" /> : <IoMoonOutline className="mr-1 sm:mr-2 size-4" />}
      <span className="hidden sm:inline">{isDark ? labels?.lightMode ?? "Light Mode" : labels?.darkMode ?? "Dark Mode"}</span>
    </Button>
  );
}
