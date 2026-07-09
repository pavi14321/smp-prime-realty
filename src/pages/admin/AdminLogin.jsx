import { useState } from 'react';
import { ShieldCheck, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import BackButton from '../../components/BackButton';

export default function AdminLogin() {
  const { step, submitCredentials, verifyLoginOtp, resendOtp, requestPasswordReset, confirmPasswordReset } = useAdminAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [mode, setMode] = useState('login');
  const [forgotStep, setForgotStep] = useState('request');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (mode === 'forgot') {
    return (
      <div className="container-x py-20 max-w-sm mx-auto">
        <BackButton />
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h1 className="font-display text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <KeyRound size={18} /> Reset Admin Password
          </h1>
          {forgotStep === 'request' ? (
            <>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="input mb-3" placeholder="Admin email or phone" />
              <button
                className="btn-primary w-full"
                onClick={() => requestPasswordReset(identifier) && setForgotStep('reset')}
              >
                Send Reset OTP
              </button>
            </>
          ) : (
            <>
              <input value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} className="input mb-3" placeholder="Enter OTP" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input mb-3" placeholder="New password" />
              <button
                className="btn-primary w-full"
                onClick={() => confirmPasswordReset(identifier, forgotOtp, newPassword) && setMode('login')}
              >
                Set New Password
              </button>
            </>
          )}
          <button className="text-xs text-gray-500 mt-4 underline" onClick={() => setMode('login')}>
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-20 max-w-sm mx-auto">
      <BackButton />
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h1 className="font-display text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
          <ShieldCheck size={18} /> Admin Login
        </h1>

        {step === 'credentials' ? (
          <>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="input mb-3" placeholder="Email or phone" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mb-3" placeholder="Password" />
            <button className="btn-primary w-full mb-2" onClick={() => submitCredentials(identifier, password)}>
              Continue
            </button>
            <button className="text-xs text-gray-500 underline" onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">Enter the OTP sent to your email/phone to complete login.</p>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} className="input mb-3" placeholder="4-digit OTP" />
            <button className="btn-primary w-full mb-2" onClick={() => verifyLoginOtp(otp)}>
              Verify & Login
            </button>
            <button className="text-xs text-gray-500 underline" onClick={resendOtp}>
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}