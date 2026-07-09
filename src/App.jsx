import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import ListProperty from './pages/ListProperty';
import AdminGate from './pages/admin/AdminGate';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Contact from './pages/Contact';
import { AdminAuthProvider } from './context/AdminAuthContext';

export default function App() {
  return (
    <AdminAuthProvider>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/admin" element={<AdminGate />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AdminAuthProvider>
  );
}