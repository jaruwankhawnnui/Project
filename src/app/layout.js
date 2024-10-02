//import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Computer Hardware Laboratory",
  description: "Computer Hardware Laboratory Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-font">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
