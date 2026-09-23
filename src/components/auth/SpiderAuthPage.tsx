/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSpiderAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audio';
import { getSpideyAuthErrorMessage } from '../../firebase/authService';
import { ComicsCodeSeal } from '../icons/SpiderVerseBadges';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot' | 'verify';

interface SpiderAuthPageProps {
  onSuccessNavigate?: () => void;
  onExploreAsGuest?: () => void;
  initialView?: AuthView;
}

export const SpiderAuthPage: React.FC<SpiderAuthPageProps> = ({
  onSuccessNavigate,
  onExploreAsGuest,
  initialView = 'login'
}) => {
  const {
    user,
    signUp,
    logIn,
    sendPasswordReset,
    resendVerification,
    reloadUserStatus,
    networkError,
    clearNetworkError
  } = useSpiderAuth();

  const [view, setView] = useState<AuthView>(
    user && !user.emailVerified ? 'verify' : initialView
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [verificationChecked, setVerificationChecked] = useState(false);

  // Clear messages on tab change
  const switchView = (newView: AuthView) => {
    playSound('click');
    setView(newView);
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      playSound('wrong');
      setErrorMessage(getSpideyAuthErrorMessage('empty-fields'));
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await logIn(email, password);
      playSound('thwip');
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch (err: any) {
      playSound('wrong');
      const code = err?.code || 'unknown';
      setErrorMessage(getSpideyAuthErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      playSound('wrong');
      setErrorMessage(getSpideyAuthErrorMessage('empty-fields'));
      return;
    }

    if (password !== confirmPassword) {
      playSound('wrong');
      setErrorMessage(getSpideyAuthErrorMessage('passwords-mismatch'));
      return;
    }

    if (password.length < 6) {
      playSound('wrong');
      setErrorMessage(getSpideyAuthErrorMessage('auth/weak-password'));
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp(email, password, displayName);
      playSound('bam');
      setView('verify');
      setSuccessNotice('ACCOUNT CREATED! Webmail dispatched to your secret frequency.');
    } catch (err: any) {
      playSound('wrong');
      const code = err?.code || 'unknown';
      setErrorMessage(getSpideyAuthErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      playSound('wrong');
      setErrorMessage('PLEASE PROVIDE YOUR REGISTERED EMAIL ADDRESS.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await sendPasswordReset(email);
      playSound('thwip');
      setSuccessNotice(
        'RESET LINK SENT! Check your email to configure a fresh secret key.'
      );
    } catch (err: any) {
      // For security, do not expose account enumeration
      playSound('thwip');
      setSuccessNotice(
        'RESET LINK SENT! If an account exists with this address, instructions have been dispatched.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckVerification = async () => {
    setSubmitting(true);
    try {
      const verified = await reloadUserStatus();
      if (verified) {
        playSound('thwip');
        setVerificationChecked(true);
        if (onSuccessNavigate) {
          setTimeout(() => onSuccessNavigate(), 900);
        }
      } else {
        playSound('wrong');
        setErrorMessage(
          'STILL UNVERIFIED! Click the confirmation link inside your inbox, then press this button again.'
        );
      }
    } catch (err) {
      playSound('wrong');
      setErrorMessage("COULDN'T CONNECT TO THE SPIDER-VERSE. TRY AGAIN.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setSubmitting(true);
    try {
      await resendVerification();
      playSound('thwip');
      setSuccessNotice('FRESH VERIFICATION LINK DISPATCHED TO YOUR INBOX!');
    } catch (err) {
      playSound('wrong');
      setErrorMessage('FAILED TO RESEND. PLEASE WAIT A MINUTE BEFORE TRYING AGAIN.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Network / Offline Warning Banner */}
      {networkError && (
        <div className="mb-6 bg-[#fee2e2] border-3 border-[#b8121d] p-4 text-[#b8121d] flex items-center justify-between ink-shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-bounce" />
            <div>
              <p className="font-comic font-black text-sm uppercase">
                {networkError}
              </p>
              <p className="text-xs font-mono">
                The Web of Life & Destiny has encountered an offline rift.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearNetworkError}
            className="px-3 py-1 bg-[#b8121d] text-white font-comic text-xs font-black uppercase ink-shadow-sm hover:bg-[#991b1b]"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Comic Panel Card */}
      <div className="bg-[#fffbf0] border-4 border-[#1b1b20] ink-shadow-xl relative overflow-hidden">
        {/* Halftone Texture Overlay */}
        <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />

        {/* Top Crimson Marvel Comic Header */}
        <div className="bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white py-2 px-4 sm:px-6 border-b-4 border-[#1b1b20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ComicsCodeSeal className="w-6 h-8 flex-shrink-0" />
            <div>
              <div className="font-comic text-xs sm:text-sm font-black tracking-wider uppercase">
                SPIDER-MAN MULTIVERSE SECURITY DOSSIER
              </div>
              <div className="font-mono text-[10px] text-white/80 hidden sm:block">
                CLOUD FIRESTORE & SECURE BIOMETRIC AUTHENTICATION
              </div>
            </div>
          </div>
          {onExploreAsGuest && (
            <button
              type="button"
              onClick={onExploreAsGuest}
              className="text-xs font-comic font-black uppercase text-[#f9bd22] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>EXPLORE GUEST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content Grid: Left Comic Graphic Panel + Right Auth Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 relative z-10">
          {/* Left Hero Panel (3D Spider-Verse Art & Speech Bubble) */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#1b1b20] to-[#0a0a0f] text-white p-6 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-[#1b1b20] relative overflow-hidden">
            {/* Subtle background web pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />

            <div>
              {/* Comic Speech Bubble */}
              <div className="bg-white text-[#1b1b20] p-4 border-3 border-[#1b1b20] rounded-2xl relative mb-6 ink-shadow-md">
                <p className="font-comic text-xs sm:text-sm font-bold leading-snug">
                  "YOUR SPIDER-SENSE REMEMBERS YOUR PROGRESS ACROSS EVERY EARTH IN THE MULTIVERSE!"
                </p>
                {/* Bubble Tail */}
                <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-4 left-[22px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-[#1b1b20] -z-10" />
              </div>

              {/* Spider-Man Variant Illustration Artwork */}
              <div className="relative border-3 border-[#1b1b20] overflow-hidden rounded-md ink-shadow-md my-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBscJXRK3PQxN14y7ZBa1HeEaeJRivX4LKWY0Ibqt4SLEc47fjTssLmWcgB8nRfEs5MlZLLlpioR8yVyrBKCqXaIJpydiDP0fO9ukdl2-_V95w5kfbLtXTQ8uaWCLjKubu0o_Esu-lk57P7BXM3JoWYUIg4ildlwySRBvjLN-d7T9i120roNbYcyNQUK93Q3jRF24wvFBIoE17uFrubqnzGr8fAc6-oa-t-NmYbb_I1Hvj_vWU-Rw4"
                  alt="Spider-Man Multiverse Action"
                  className="w-full h-44 object-cover filter saturate-125 contrast-110"
                />
                <div className="absolute bottom-1 right-1 bg-[#dc2626] text-white font-comic text-[9px] font-black px-1.5 py-0.5 border border-[#1b1b20] uppercase">
                  EARTH-616 ARCHIVES
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-comic font-black text-[#f9bd22]">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>CLOUD PERSISTENT MULTIVERSE XP</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-comic font-black text-white/90">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#006398]" />
                  <span>SECURE FIRESTORE DATA ISOLATION</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-comic font-black text-white/90">
                  <Zap className="w-4 h-4 flex-shrink-0 text-[#dc2626]" />
                  <span>REAL-TIME SPIDER-SENSE LEADERBOARD</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 mt-6 text-[10px] font-mono text-white/60">
              ISSUE #1962 • MARVEL COMICS GROUP • ALL PROGRESS ENCRYPTED
            </div>
          </div>

          {/* Right Interactive Form Panel */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {/* View Title & Subtitle */}
            <div className="mb-6">
              <div className="inline-block bg-[#1b1b20] text-white font-comic text-xs font-black px-2 py-0.5 uppercase tracking-wider mb-1">
                {view === 'login' && 'HERO CHECK-IN'}
                {view === 'register' && 'NEW RECRUIT DOSSIER'}
                {view === 'forgot' && 'SECURITY RECOVERY'}
                {view === 'verify' && 'COMMUNICATION FREQUENCY'}
              </div>
              <h1 className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] tracking-tight">
                {view === 'login' && 'ENTER THE SPIDER-VERSE'}
                {view === 'register' && 'JOIN THE SPIDER-VERSE'}
                {view === 'forgot' && 'FORGOT YOUR SPIDER-SENSE?'}
                {view === 'verify' && 'CHECK YOUR WEBMAIL!'}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#5b403d] font-bold mt-1">
                {view === 'login' && 'Your Spider-Sense remembers your progress.'}
                {view === 'register' && 'Create your secret identity and sync your stats.'}
                {view === 'forgot' && 'Enter your address to recalibrate your secret password.'}
                {view === 'verify' && "We've sent a verification link to your email."}
              </p>
            </div>

            {/* Error Speech Alert */}
            {errorMessage && (
              <div className="mb-5 bg-[#fee2e2] border-3 border-[#b8121d] p-3 text-[#b8121d] ink-shadow-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-comic font-black text-xs uppercase">
                    {errorMessage}
                  </div>
                  <div className="text-[10px] font-mono text-[#991b1b] mt-0.5">
                    Consult your web-shooters or review input fields.
                  </div>
                </div>
              </div>
            )}

            {/* Success Notice */}
            {successNotice && (
              <div className="mb-5 bg-[#dcfce7] border-3 border-[#15803d] p-3 text-[#15803d] ink-shadow-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-comic font-black text-xs uppercase">
                    {successNotice}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: LOGIN */}
            {view === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="peter.parker@dailybugle.com"
                      className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-comic text-xs font-black uppercase text-[#1b1b20]">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => switchView('forgot')}
                      className="font-comic text-[11px] font-black uppercase text-[#006398] hover:underline"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                    />
                  </div>
                </div>

                {/* THWIP! LOG IN Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#dc2626] hover:bg-[#b8121d] text-white border-3 border-[#1b1b20] font-comic text-base font-black uppercase tracking-wider ink-shadow-md ink-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>THWIP-ING IN...</span>
                    </>
                  ) : (
                    <>
                      <span>THWIP! LOG IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Toggle to Create Account */}
                <div className="pt-4 border-t-2 border-[#1b1b20]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="font-comic text-xs font-black uppercase text-[#5b403d]">
                    NEW TO THE MULTIVERSE?
                  </span>
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="px-3 py-1.5 bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase ink-shadow-sm cursor-pointer"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 2: REGISTER */}
            {view === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                    SPIDER NAME (HERO ALIAS)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ghost-Spider, Miles, Spider-Punk"
                      className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                    EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gwen.stacy@earth65.net"
                      className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#006398] hover:bg-[#004e78] text-white border-3 border-[#1b1b20] font-comic text-base font-black uppercase tracking-wider ink-shadow-md ink-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>INITIALIZING HERO DOSSIER...</span>
                    </>
                  ) : (
                    <>
                      <span>JOIN THE SPIDER-VERSE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-3 border-t-2 border-[#1b1b20]/20 flex items-center justify-center gap-2">
                  <span className="font-comic text-xs font-black uppercase text-[#5b403d]">
                    ALREADY REGISTERED?
                  </span>
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="font-comic text-xs font-black uppercase text-[#dc2626] hover:underline"
                  >
                    LOG IN HERE
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 3: FORGOT PASSWORD */}
            {view === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                    REGISTERED EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#5b403d]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.spider.alias@domain.com"
                      className="w-full bg-white border-2 border-[#1b1b20] pl-10 pr-3 py-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] ink-shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#dc2626] hover:bg-[#b8121d] text-white border-3 border-[#1b1b20] font-comic text-sm font-black uppercase tracking-wider ink-shadow-md ink-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>SEND RESET LINK</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="w-full py-2 bg-white hover:bg-[#f3f0e6] text-[#1b1b20] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center justify-center gap-2 ink-shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO LOG IN</span>
                </button>
              </form>
            )}

            {/* VIEW 4: EMAIL VERIFICATION */}
            {view === 'verify' && (
              <div className="space-y-4">
                <div className="bg-white border-3 border-[#1b1b20] p-4 ink-shadow-sm">
                  <div className="flex items-center gap-2 text-[#006398] mb-2 font-comic font-black text-sm uppercase">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span>CHECK YOUR WEBMAIL!</span>
                  </div>
                  <p className="text-xs font-mono text-[#1b1b20] leading-relaxed">
                    We've sent a verification link to your email. Click the link in the message to activate full multiverse privileges.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={submitting || verificationChecked}
                    onClick={handleCheckVerification}
                    className="py-3 bg-[#15803d] hover:bg-[#166534] text-white border-2 border-[#1b1b20] font-comic text-xs font-black uppercase tracking-wider ink-shadow-sm ink-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>I'VE VERIFIED — CONTINUE</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleResendVerification}
                    className="py-3 bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase tracking-wider ink-shadow-sm ink-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>RESEND VERIFICATION</span>
                  </button>
                </div>

                <div className="pt-3 border-t-2 border-[#1b1b20]/20 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="font-comic text-xs font-black uppercase text-[#5b403d] hover:underline"
                  >
                    ← USE A DIFFERENT ACCOUNT
                  </button>
                  {onExploreAsGuest && (
                    <button
                      type="button"
                      onClick={onExploreAsGuest}
                      className="font-comic text-xs font-black uppercase text-[#006398] hover:underline"
                    >
                      CONTINUE AS GUEST →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
