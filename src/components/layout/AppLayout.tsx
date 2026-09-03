import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { OfflineBanner } from "../ui/OfflineBanner";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      <OfflineBanner />
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <Header />
          <main className="flex-1 p-5 md:p-7 lg:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-8">
            <Outlet />
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
}
