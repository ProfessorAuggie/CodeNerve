import type { Metadata } from 'next';
import '../index.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthPromptModal } from '@/components/auth/AuthPromptModal';
import { SessionInitializer } from '@/components/auth/SessionInitializer';

export const metadata: Metadata = {
  title: 'CodeNerve ⚡ | Interactive Computer Science & Curriculum Roadmap',
  description: 'Premier computer science education platform uniting interactive algorithm visualizers, university syllabus roadmaps, and curated problem catalogues.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('codenerve_user_storage_v2');
                  var theme = 'dark';
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    if (parsed && parsed.state && parsed.state.theme) {
                      theme = parsed.state.theme;
                    }
                  }
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-600 dark:selection:text-brand-200 transition-colors duration-150 antialiased">
        <SessionInitializer />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <AuthPromptModal />
        <Footer />
      </body>
    </html>
  );
}
