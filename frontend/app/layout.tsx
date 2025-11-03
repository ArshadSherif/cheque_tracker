import "./globals.css";
import Navbar from "@/components/Shared/Navbar";

export const metadata = {
  title: "Cheque & Cash Tracker",
  description: "Track your cheque and cash payments easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
