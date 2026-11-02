import './globals.css';
import NavBar from '@/components/NavBar';
import { Footer } from '@/components/UI';
export const metadata = {
  title: {
    default: 'LNMIIT Heritage | Explore the Legacy',
    template: '%s | LNMIIT Heritage',
  },
  description:
    'Discover LNMIIT’s history, academic departments, campus photographs and admission pathways. A student heritage project grounded in official LNMIIT sources.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
