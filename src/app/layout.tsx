import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EVP Demo',
  description: 'Chrome Email Verification Protocol demo login',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta
          httpEquiv="origin-trial"
          content="ApoCFKglnMezKDGIQ8DMaGkWjzI5bbnEHdiPTKymyIrZS8ZHMYHXy/HlrsqiYF88cspHW3kvnvnS8w6g7teKHwoAAAB1eyJvcmlnaW4iOiJodHRwczovL2thbWlsbWFyY3phay5wbDo0NDMiLCJmZWF0dXJlIjoiRW1haWxWZXJpZmljYXRpb25Qcm90b2NvbCIsImV4cGlyeSI6MTc5NDg3MzYwMCwiaXNTdWJkb21haW4iOnRydWV9"></meta>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
      <GoogleAnalytics gaId="G-PZ3F5RC420" />
    </html>
  );
}
