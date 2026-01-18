// app/layout.js
import "./styles/globals.css";
import Layout from './components/Layout';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide layout for login
  const hideLayout = pathname.startsWith('/login');

  return (
    <html lang="en">
      <body>
        {!hideLayout ? <Layout>{children}</Layout> : children}
      </body>
    </html>
  );
}