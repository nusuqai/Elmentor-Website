import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  if (lang === 'ar') {
    return {
      title: "إلمنتور - اعثر على موجهك المهني المثالي",
      description: "تواصل مع خبراء معتمدين ممارسين يفهمون طموحاتك. احصل على توجيه مهني مخصص لتسريع نموك وتطورك الوظيفي.",
      keywords: ["التوجيه المهني", "النمو المهني", "التطوير الاحترافي", "مطابقة الموجهين"],
      icons: {
        icon: "/favicon.png",
        apple: "/logo.png",
      },
    };
  }
  
  return {
    title: "Elmentor - Find Your Perfect Mentor",
    description: "Connect with experienced professionals who understand your goals. Get personalized mentorship to accelerate your career growth.",
    keywords: ["mentorship", "career growth", "professional development", "mentor matching"],
    icons: {
      icon: "/favicon.png",
      apple: "/logo.png",
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? cairo.className : inter.className;
  const fontVariable = lang === 'ar' ? cairo.variable : inter.variable;

  return (
    <html lang={lang} dir={dir} className={fontVariable} data-scroll-behavior="smooth">
      <body className={`${fontClass} antialiased`}>{children}</body>
    </html>
  );
}
