import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Gallery from './pages/Gallery';
import Timeline from './pages/Timeline';
import Wins from './pages/Wins';
import ProjectDetail from './pages/ProjectDetail';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TransitionProvider } from './context/TransitionContext';

function App() {
  return (
    <TransitionProvider>
      <div className="min-h-screen bg-white font-sans antialiased text-black selection:bg-primary selection:text-black">
        <Header />
        <main>
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
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" richColors theme="light" />
      </div>
    </TransitionProvider>
  );
}

export default App;
