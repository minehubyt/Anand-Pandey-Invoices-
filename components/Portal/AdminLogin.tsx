
import React, { useState, useEffect } from 'react';
import { X, Shield, UserPlus, LogIn, Loader2, KeyRound, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from '../../firebase';
import { contentService } from '../../services/contentService';
import { emailService } from '../../services/emailService';
import { UserProfile } from '../../types';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
  intendedRole?: 'applicant' | 'general';
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose, intendedRole = 'general' }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for URL parameters on mount to auto-fill fields
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramEmail = params.get('email');
    const paramName = params.get('name');
    const paramMode = params.get('isSignUp');

    if (paramEmail) setEmail(paramEmail);
    if (paramName) setName(paramName);
    if (paramMode === 'true') setIsSignUp(true);
  }, []);

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-credential':
        return 'AUTHORIZATION FAILED. THE CREDENTIALS PROVIDED DO NOT MATCH OUR SECURE RECORDS.';
      case 'auth/email-already-in-use':
        return 'ACCOUNT CONFLICT. A MANDATE DOSSIER ALREADY EXISTS FOR THIS EMAIL.';
      case 'auth/weak-password':
        return 'PROTOCOL REJECTED. SECURE KEY MUST BE AT LEAST 6 CHARACTERS.';
      case 'auth/invalid-email':
        return 'FORMAT ERROR. PLEASE PROVIDE A VALID INSTITUTIONAL EMAIL.';
      case 'auth/user-not-found':
        return 'ENTITY NOT RECOGNIZED. NO ACCOUNT MATCHES THIS EMAIL.';
      default:
        return 'AUTHENTICATION PROTOCOL ERROR. PLEASE VERIFY YOUR CONNECTION.';
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("RESET LINK DISPATCHED. PLEASE CHECK YOUR SECURE INBOX.");
      setTimeout(() => setShowForgotPassword(false), 3000);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const isAdminEmail = normalizedEmail === 'admin@anandpandey.in';
    const isAdminPass = password === 'Anand@123';

    try {
      if (isSignUp) {
        if (!otpMode) {
          // PHASE 1: Generate OTP & Send Email
          if (!name || !email || !password) {
             setError("MANDATORY FIELDS MISSING. PLEASE COMPLETE DOSSIER.");
             setLoading(false);
             return;
          }

          const code = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(code);
          
          try {
            await emailService.sendVerificationOTP(normalizedEmail, name, code);
            setOtpMode(true);
            setSuccessMsg("SECURE CODE DISPATCHED. CHECK YOUR INBOX.");
          } catch (mailErr) {
            console.error("OTP Send Error", mailErr);
            // Fallback for demo if email API fails (allow proceed with console OTP)
            console.log(`DEV MODE OTP: ${code}`); 
            setOtpMode(true);
            setError("NETWORK WARNING: EMAIL SERVICE DELAYED. CHECK CONSOLE FOR DEV OTP.");
          }
          
          setLoading(false);
          return;
        } else {
          // PHASE 2: Verify OTP & Create Account
          if (inputOtp !== generatedOtp) {
             setError("AUTHENTICATION FAILED. INVALID SECURE CODE.");
             setLoading(false);
             return;
          }

          const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          const user = userCredential.user;
          
          await updateProfile(user, { displayName: name });
          
          const role = isAdminEmail ? 'admin' : intendedRole;

          await contentService.saveUserProfile({
            uid: user.uid,
            email: user.email!,
            name: name,
            role: role as 'applicant' | 'general' | 'admin',
            createdAt: new Date().toISOString()
          });
          
          // No need to sendEmailVerification link anymore as we verified via OTP
          onLogin();
        }
      } else {
        // LOGIN FLOW
        try {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
          onLogin();
        } catch (signInErr: any) {
          if (isAdminEmail && isAdminPass) {
            try {
              const userCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
              await updateProfile(userCred.user, { displayName: 'Managing Partner' });
              await contentService.saveUserProfile({
                uid: userCred.user.uid,
                email: normalizedEmail,
                name: 'Managing Partner',
                role: 'admin',
                createdAt: new Date().toISOString()
              });
              onLogin();
            } catch (createErr: any) {
              if (createErr.code === 'auth/email-already-in-use') {
                 throw signInErr;
              }
              throw createErr;
            }
          } else {
            throw signInErr;
          }
        }
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
      console.error("Auth Exception:", err.code);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const existingProfile = await contentService.getUserProfile(user.uid);
      if (!existingProfile) {
        const isAdminEmail = user.email?.toLowerCase() === 'admin@anandpandey.in';
        await contentService.saveUserProfile({
          uid: user.uid,
          email: user.email!,
          name: user.displayName || 'Client',
          role: isAdminEmail ? 'admin' : intendedRole as 'applicant' | 'general' | 'admin',
          createdAt: new Date().toISOString()
        });
      }

      onLogin();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
      console.error("Google Auth Exception:", err.code);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400')] bg-cover bg-center opacity-10 blur-sm scale-105" />
        <div className="relative z-10 w-full max-w-lg bg-white p-10 lg:p-14 shadow-2xl animate-reveal-up rounded-sm">
           <button onClick={() => setShowForgotPassword(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-[#CC1414] transition-colors"><X className="w-6 h-6"/></button>
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#CC1414]"><KeyRound size={32}/></div>
              <h3 className="text-2xl font-serif text-slate-900 mb-2">Reset Secure Key</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Enter your institutional email to receive a recovery link.</p>
           </div>
           <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-4 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm" placeholder="example@email.com" />
              </div>
              {error && <p className="text-[11px] text-red-600 font-bold uppercase tracking-wider text-center bg-red-50 p-4 border border-red-100 animate-reveal-up">{error}</p>}
              {successMsg && <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider text-center bg-green-50 p-4 border border-green-100 animate-reveal-up">{successMsg}</p>}
              <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50 rounded-sm">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Mail size={16}/>}
                {loading ? 'DISPATCHING...' : 'SEND RESET LINK'}
              </button>
              <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Return to Login</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400')] bg-cover bg-center opacity-10 blur-sm scale-105 animate-scale-out" />
      
      <div className="relative z-10 w-full max-w-lg bg-white p-10 lg:p-14 shadow-2xl animate-reveal-up rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-[#CC1414] transition-colors group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="text-center mb-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium mb-2">
              <span className="text-[18px] lg:text-[22px] leading-none font-medium">AK PANDEY</span>
              <span className="text-[10px] lg:text-[12px] mx-1.5 self-center">&</span>
              <span className="text-[18px] lg:text-[22px] leading-none font-medium">ASSOCIATES</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-100"></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
               {isSignUp ? (otpMode ? 'Identity Verification' : (intendedRole === 'applicant' ? 'Recruitment Mandate' : 'Client Onboarding')) : 'Authorized Access'}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {otpMode ? (
             <div className="space-y-6 animate-reveal-left">
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-sm text-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Secure Code Sent To</p>
                   <p className="text-lg font-serif text-slate-900">{email}</p>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Enter 6-Digit Code</label>
                   <input 
                     type="text"
                     required
                     value={inputOtp}
                     onChange={(e) => setInputOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))}
                     className="w-full bg-slate-50 border border-slate-100 p-4 text-center text-3xl tracking-[0.5em] font-bold text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all rounded-sm placeholder:tracking-normal"
                     placeholder="000000"
                     autoFocus
                   />
                </div>
                <p className="text-xs text-center text-slate-400 font-light">Please verify the OTP sent to your institutional email.</p>
             </div>
          ) : (
            <>
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Full Legal Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-4 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm"
                    placeholder="Enter full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Email Address</label>
                <input 
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-4 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Secure Key</label>
                   {!isSignUp && (
                     <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[9px] font-bold tracking-widest uppercase text-[#CC1414] hover:text-slate-900 transition-colors">Forgot Key?</button>
                   )}
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-4 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {error && <p className="text-[11px] text-red-600 font-bold uppercase tracking-wider text-center bg-red-50 p-4 border border-red-100 animate-reveal-up">{error}</p>}
          {successMsg && <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider text-center bg-green-50 p-4 border border-green-100 animate-reveal-up">{successMsg}</p>}

          <div className="space-y-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50 rounded-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16}/> : (otpMode ? <CheckCircle size={16}/> : isSignUp ? <ArrowRight size={16}/> : <LogIn size={16}/>)}
              {loading ? 'PROCESSING...' : otpMode ? 'VERIFY & CREATE' : isSignUp ? 'SEND VERIFICATION' : 'AUTHORIZE SESSION'} 
            </button>

            {!loading && !otpMode && (
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#CC1414] transition-colors"
              >
                {isSignUp ? 'Already have a mandate? Sign In' : 'New to the chambers? Request Dossier'}
              </button>
            )}
            
            {otpMode && !loading && (
               <button 
                type="button"
                onClick={() => { setOtpMode(false); setInputOtp(''); setError(''); setSuccessMsg(''); }}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel Verification
              </button>
            )}

            {!otpMode && (
              <>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-300 bg-white px-4">Secure Integration</div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-5 border border-slate-200 text-slate-900 text-[11px] font-bold tracking-[0.3em] uppercase hover:border-[#CC1414] hover:text-[#CC1414] transition-all flex items-center justify-center gap-4 shadow-sm active:scale-95 disabled:opacity-50 rounded-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                  Liaison via Google
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <Shield className="w-4 h-4" />
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase">AES-256 Encrypted Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
