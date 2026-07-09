import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, User } from 'lucide-react';
import { getBlogPostById, subscribeBlog } from '../data/blogStore';
import BackButton from '../components/BackButton';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = () => setPost(getBlogPostById(id));
    load();
    return subscribeBlog(load);
  }, [id]);

  if (!post) {
    return (
      <div className="container-x py-20 text-center text-gray-500">
        <BackButton className="justify-center" />
        Blog post not found. <Link to="/blog" className="text-brand-dark underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 max-w-3xl mx-auto">
      <BackButton />
      <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-xl mb-6" />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-3">{post.title}</h1>
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
        <span className="flex items-center gap-1">
          <User size={12} /> {post.author}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />{' '}
          {new Date(post.publishAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{post.description}</p>
    </div>
  );
}