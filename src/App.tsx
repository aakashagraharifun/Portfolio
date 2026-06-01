import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TransitionProvider } from './context/TransitionContext';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Eager: above-the-fold critical route
import Home from './pages/Home';

// Lazy: every other route, for smaller initial JS bundle (helps LCP/INP)
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Wins = lazy(() => import('./pages/Wins'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[60vh] flex items-center justify-center"
    >
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <TransitionProvider>
      <div className="min-h-screen bg-white font-sans antialiased text-black selection:bg-primary selection:text-black">
        {!isAdminPath && <Header />}
        <main id="main-content">
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/wins" element={<Wins />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdminPath && <Footer />}
        <Toaster position="top-center" richColors theme="light" />
      </div>
    </TransitionProvider>
  );
}

export default App;
