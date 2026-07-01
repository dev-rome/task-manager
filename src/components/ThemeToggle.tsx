"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  // until mounted, render a stable placeholder (matches server output)
  if (!mounted) {
    return <button className="text-sm text-muted">Theme</button>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-sm text-muted hover:text-ink"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
