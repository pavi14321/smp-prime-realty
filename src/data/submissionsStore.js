let submissions = [];
let nextId = 1;
const listeners = new Set();

function notify() {
  listeners.forEach((cb) => cb());
}

export function subscribeSubmissions(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSubmissions() {
  return [...submissions].sort((a, b) => b.createdAt - a.createdAt);
}

export function addSubmission(data) {
  const submission = {
    id: `REQ-${String(nextId++).padStart(4, '0')}`,
    status: 'Pending', // Pending | Converted | Rejected
    createdAt: Date.now(),
    ...data,
  };
  submissions.push(submission);
  notify();
  return submission;
}

export function updateSubmissionStatus(id, status) {
  submissions = submissions.map((s) => (s.id === id ? { ...s, status } : s));
  notify();
}