import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

// Main layout wrapper component
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Header />}
      <main 
        id="main-content" 
        className={`flex-1 ${isHomepage || isAdminPage ? '' : 'pt-16'}`}
        tabIndex={-1}
      >
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}
