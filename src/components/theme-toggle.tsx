"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const subscribeToClient = () => () => undefined;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="shrink-0 transition-transform duration-300"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4 transition-all" />
        ) : (
          <Moon className="size-4 transition-all" />
        )
      ) : (
        <Sun className="size-4 opacity-0" />
      )}
    </Button>
  );
}
