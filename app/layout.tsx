import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "卒行｜脑卒中步行功能评估训练系统",
  description: "连接病例、临床评估、Vicon步态数据、问题分析、目标与训练计划。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
