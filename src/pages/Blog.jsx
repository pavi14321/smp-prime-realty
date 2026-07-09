import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, User } from 'lucide-react';
import { getPublishedBlogPosts, subscribeBlog } from '../data/blogStore';
import BackButton from '../components/BackButton';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = () => setPosts(getPublishedBlogPosts());
    load();
    return subscribeBlog(load);
  }, []);

  return (
    <div className="container-x py-16">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">Blog</h1>
      <p className="text-gray-600 mb-10">Real estate tips, market insights and guides.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">No blog posts yet. Check back soon.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.id}`}
              className="block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-brand-dark text-base mb-2 line-clamp-2">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{p.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {p.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />{' '}
                    {new Date(p.publishAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}