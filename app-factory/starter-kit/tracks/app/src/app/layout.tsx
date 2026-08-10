import type { Metadata } from 'next';
import '@/styles/tokens.css';

export const metadata: Metadata = {
  title: '{{APP_NAME}}',
  description: '{{APP_DESCRIPTION}}',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="{{LOCALE}}">
      <body>
        {/* Keyboard users land here first; without it every page starts with
            a tab through the whole navigation. */}
        <a href="#main" className="skip">Skip to content</a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
