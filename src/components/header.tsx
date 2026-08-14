"use client";

import { Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV } from "@/lib/protocols-data";
import type { ViewId } from "@/types/patient";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Header({
  view,
  onNavigate,
}: {
  view: ViewId;
  onNavigate: (id: ViewId) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Activity className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              LBH protocol
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              MedCalc Streamline · Clinical Decision Support
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle>Calculators</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-4rem)] p-2">
                <nav className="flex flex-col gap-1 p-2">
                  {NAV.map((item) => (
                    <Button
                      key={item.id}
                      variant={view === item.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => onNavigate(item.id)}
                    >
                      <span className="mr-2">{item.emoji}</span>
                      {item.shortLabel}
                    </Button>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden border-t border-border/60 lg:block">
        <ScrollArea className="w-full">
          <nav className="mx-auto flex max-w-7xl gap-1 px-4 py-2">
            {NAV.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={view === item.id ? "default" : "ghost"}
                className={cn(
                  "shrink-0 transition-all",
                  view === item.id && "shadow-sm"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <span className="mr-1.5 opacity-90">{item.emoji}</span>
                {item.shortLabel}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </header>
  );
}
