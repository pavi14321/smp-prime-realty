// DEMO ONLY — plaintext passwords and in-memory storage. Move this to your
// Express/Neon backend with hashed passwords (bcrypt) before going live.

let admins = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'madvalp67@gmail.com',
    phone: '6360469880',
    password: 'Praveens@123',
    role: 'superadmin', // superadmin | admin
  },
];

let activityLog = [];
const listeners = new Set();

function notify() {
  listeners.forEach((cb) => cb());
}

export function subscribeAdmins(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getAdmins() {
  return admins.map(({ password, ...safe }) => safe); // never leak passwords to UI
}

export function findAdminByIdentifier(identifier) {
  return admins.find((a) => a.email === identifier || a.phone === identifier);
}

export function verifyPassword(admin, password) {
  return admin?.password === password;
}

export function addAdmin({ name, email, phone, password, role }) {
  const admin = { id: `admin-${Date.now()}`, name, email, phone, password, role };
  admins.push(admin);
  notify();
  return admin;
}

export function removeAdmin(id) {
  const remaining = admins.filter((a) => a.id !== id);
  const supersLeft = remaining.some((a) => a.role === 'superadmin');
  if (!supersLeft) {
    throw new Error('Cannot remove the last Super Admin.');
  }
  admins = remaining;
  notify();
}

export function updateAdminPassword(identifier, newPassword) {
  admins = admins.map((a) =>
    a.email === identifier || a.phone === identifier ? { ...a, password: newPassword } : a
  );
  notify();
}

export function logActivity(admin, action) {
  activityLog.unshift({
    id: `log-${Date.now()}`,
    adminId: admin.id,
    adminName: admin.name,
    role: admin.role,
    action,
    timestamp: Date.now(),
  });
  notify();
}

export function getActivityLog() {
  return activityLog;
}