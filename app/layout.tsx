import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "卒康｜脑卒中康复临床工具箱",
  description: "面向康复治疗师的脑卒中评估工具、临床路径与病例训练平台。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
