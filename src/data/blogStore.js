let posts = [];
let nextId = 1;
const listeners = new Set();

function notify() {
  listeners.forEach((cb) => cb());
}

export function subscribeBlog(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Public-facing: only posts that are actually live right now
// (Published immediately, or Scheduled whose time has already arrived)
export function getPublishedBlogPosts() {
  const now = Date.now();
  return posts
    .filter((p) => p.status === 'Published' || (p.status === 'Scheduled' && p.publishAt <= now))
    .sort((a, b) => b.publishAt - a.publishAt);
}

export function getBlogPostById(id) {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  const now = Date.now();
  const isLive = post.status === 'Published' || (post.status === 'Scheduled' && post.publishAt <= now);
  return isLive ? post : null;
}

// Admin-facing: every post regardless of publish status
export function getAllBlogPostsAdmin() {
  return [...posts].sort((a, b) => b.createdAt - a.createdAt);
}

export function addBlogPost(data) {
  const post = {
    id: `BLOG-${String(nextId++).padStart(4, '0')}`,
    createdAt: Date.now(),
    ...data,
  };
  posts.push(post);
  notify();
  return post;
}

export function updateBlogPost(id, updates) {
  posts = posts.map((p) => (p.id === id ? { ...p, ...updates } : p));
  notify();
}

export function deleteBlogPost(id) {
  posts = posts.filter((p) => p.id !== id);
  notify();
}

// Returns 'Published' if the post is live right now, otherwise 'Scheduled'
export function getEffectiveStatus(post) {
  const now = Date.now();
  if (post.status === 'Published') return 'Published';
  if (post.status === 'Scheduled' && post.publishAt <= now) return 'Published';
  return 'Scheduled';
}