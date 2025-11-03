"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      path === href
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
      <h1 className="text-xl font-semibold text-blue-700">💰 Cheque Tracker</h1>
      <div className="flex gap-3">
        <Link href="/" className={linkClass("/")}>
          Dashboard
        </Link>
        <Link href="/cheque" className={linkClass("/cheque")}>
          Add Cheque
        </Link>
      </div>
    </nav>
  );
}
