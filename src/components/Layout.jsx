"use client";
import { usePathname } from 'next/navigation';
import MainHeader from "@/components/MainHeader";

export default function Layout({ children, session }) {
  const pathname = usePathname();

  // ตรวจสอบว่าเส้นทางปัจจุบันไม่ใช่หน้า login
  const showHeader = pathname !== '/login';

  return (
    <div>
      {showHeader && <MainHeader session={session} />}
      {children}
    </div>
  );
}
