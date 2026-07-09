import { createContext, useContext, useEffect, useState } from 'react';
import {
  findAdminByIdentifier,
  verifyPassword,
  updateAdminPassword,
  logActivity,
} from '../data/adminStore';
import { sendOtp, verifyOtp } from '../utils/otpService';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext(null);
const SESSION_KEY = 'smp_admin_session';

export function AdminAuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  // login wizard state
  const [step, setStep] = useState('credentials'); // credentials | otp
  const [pendingAdmin, setPendingAdmin] = useState(null);

  useEffect(() => {
    if (currentAdmin) localStorage.setItem(SESSION_KEY, JSON.stringify(currentAdmin));
    else localStorage.removeItem(SESSION_KEY);
  }, [currentAdmin]);

  function submitCredentials(identifier, password) {
    const admin = findAdminByIdentifier(identifier);
    if (!admin || !verifyPassword(admin, password)) {
      toast.error('Invalid email/phone or password');
      return false;
    }
    const code = sendOtp(identifier);
    toast.success(`Demo OTP sent to ${identifier}: ${code}`); // remove in production
    setPendingAdmin({ ...admin, identifier });
    setStep('otp');
    return true;
  }

  function verifyLoginOtp(code) {
    const result = verifyOtp(pendingAdmin.identifier, code);
    if (!result.ok) {
      toast.error(result.reason);
      return false;
    }
    const { password, identifier, ...safeAdmin } = pendingAdmin;
    setCurrentAdmin(safeAdmin);
    logActivity(safeAdmin, 'Logged in');
    setStep('credentials');
    setPendingAdmin(null);
    return true;
  }

  function resendOtp() {
    if (!pendingAdmin) return;
    const code = sendOtp(pendingAdmin.identifier);
    toast.success(`Demo OTP resent: ${code}`);
  }

  function logout() {
    if (currentAdmin) logActivity(currentAdmin, 'Logged out');
    setCurrentAdmin(null);
    setStep('credentials');
  }

  // forgot password mini-flow
  function requestPasswordReset(identifier) {
    const admin = findAdminByIdentifier(identifier);
    if (!admin) {
      toast.error('No admin account found for that email/phone');
      return false;
    }
    const code = sendOtp(identifier);
    toast.success(`Demo reset OTP: ${code}`);
    return true;
  }

  function confirmPasswordReset(identifier, code, newPassword) {
    const result = verifyOtp(identifier, code);
    if (!result.ok) {
      toast.error(result.reason);
      return false;
    }
    updateAdminPassword(identifier, newPassword);
    toast.success('Password updated — please log in');
    return true;
  }

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        step,
        pendingAdmin,
        submitCredentials,
        verifyLoginOtp,
        resendOtp,
        logout,
        requestPasswordReset,
        confirmPasswordReset,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}