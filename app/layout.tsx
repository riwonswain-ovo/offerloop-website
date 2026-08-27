import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OfferLoop — 让求职真正形成闭环',
  description: '7 个 AI 求职 Skill 协同工作，从发现机会、定制简历到面试准备与真面复盘，让每一步都能持续积累。',
  icons: {
    icon: '/offerloop-logo-transparent.png',
    apple: '/offerloop-logo-transparent.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
