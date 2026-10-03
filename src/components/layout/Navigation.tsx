"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link000 } from "@/components/ui/skiper-ui/skiper40";
import {
  LayoutDashboard,
  BarChart3,
  Plus,
  Code2,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md" suppressHydrationWarning>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Dev<span className="text-blue-400">Memory</span>
          </span>
        </Link>

        {/* Center Nav with Skiper UI Animated Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link000 href="/dashboard/overview" className="hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-1.5 py-1">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </span>
          </Link000>
          <Link000 href="/memories/new" className="hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-1.5 py-1">
              <Plus className="h-4 w-4" />
              New Memory
            </span>
          </Link000>
          <Link000 href="/dashboard/overview" className="hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-1.5 py-1">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </span>
          </Link000>
          <Link000 href="/practice" className="hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-1.5 py-1">
              <Sparkles className="h-4 w-4" />
              Practice
            </span>
          </Link000>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            asChild
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm"
          >
            <Link href="/memories/new" className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Create Memory</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-slate-700 hover:bg-slate-800">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-800 text-blue-400 font-bold text-xs">
                    DM
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
              <DropdownMenuItem asChild className="focus:bg-blue-600 focus:text-white cursor-pointer">
                <Link href="/dashboard/overview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard Overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-blue-600 focus:text-white cursor-pointer">
                <Link href="/practice" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Practice
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
