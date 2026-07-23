import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'MCM Franchise Management',
  description: 'Mobile-first web app for managing MCM biryani franchise operations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="page-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


