import React, { useState } from 'react';
import { X, Send, Newspaper, CheckCircle, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Scoop / Sighting');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    playSound('bam');
    setIsSubmitted(true);
    setTimeout(() => {
      // Keep submitted message for visual delight
    }, 300);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1b1b20]/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="comic-halftone absolute inset-0 pointer-events-none" />

      <div className="relative bg-[#fffbf0] border-4 sm:border-6 border-[#1b1b20] max-w-xl w-full p-5 sm:p-7 ink-shadow-red-multi z-10 max-h-[90vh] overflow-y-auto">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between border-b-4 border-[#1b1b20] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#dc2626] text-white flex items-center justify-center border-2 border-[#1b1b20] font-comic font-black text-xl">
              📰
            </div>
            <div>
              <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-[10px] font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                THE DAILY BUGLE WIRE
              </span>
              <h2
                id="contact-modal-title"
                className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] leading-none mt-1"
              >
                CONTACT THE BUGLE NEWS DESK
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              handleReset();
            }}
            className="w-8 h-8 bg-[#eae7ee] hover:bg-[#dc2626] hover:text-white border-2 border-[#1b1b20] flex items-center justify-center font-black text-[#1b1b20] transition-colors ink-btn cursor-pointer"
            aria-label="Close contact modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#22c55e] text-white mx-auto flex items-center justify-center border-3 border-[#1b1b20] ink-shadow-sm rounded-full">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="bg-[#fff0f0] border-3 border-[#1b1b20] p-4 max-w-md mx-auto bubble-bottom ink-shadow-sm">
              <span className="font-comic text-xs font-black text-[#dc2626] uppercase block">
                J. JONAH JAMESON TELEGRAM:
              </span>
              <p className="font-comic text-base font-black text-[#1b1b20] uppercase mt-1">
                "TELEGRAM RECEIVED, {name.toUpperCase()}! PARKER, GET OVER HERE AND CHECK THIS SCOOP! FRONT PAGE MATERIAL!"
              </p>
            </div>
            <p className="text-xs text-[#5b403d] font-semibold">
              Your message was filed under "{category}". The Daily Bugle investigative bureau thanks you!
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-sm font-black px-6 py-2.5 border-2 border-[#1b1b20] uppercase ink-btn ink-shadow-sm cursor-pointer"
            >
              DONE • RETURN TO ACTION
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#ffdf9f] border-2 border-[#1b1b20] p-3 text-xs font-comic font-black text-[#261a00] uppercase leading-tight">
              ⚡ GOT A SCOOP, TRIVIA CORRECTION, OR MULTIVERSE REPORT? WIRE THE EDITORIAL TEAM DIRECTLY!
            </div>

            <div>
              <label htmlFor="contact-name" className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                YOUR ALIAS / NAME <span className="text-[#dc2626]">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Peter Parker, Gwen Stacy, or your secret hero alias"
                className="w-full bg-white border-2 border-[#1b1b20] p-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626]"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                ELECTRONIC MAIL / COMMS
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero.alias@dailybugle.ny"
                className="w-full bg-white border-2 border-[#1b1b20] p-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626]"
              />
            </div>

            <div>
              <label htmlFor="contact-category" className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                TOPIC CATEGORY
              </label>
              <select
                id="contact-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border-2 border-[#1b1b20] p-2 text-sm font-comic font-black uppercase text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626]"
              >
                <option value="Scoop / Sighting">Supervillain Sighting / Breaking Scoop</option>
                <option value="Trivia Correction">Canon Fact Verification / Correction</option>
                <option value="Game Feedback">Spider-Arcade Suggestion</option>
                <option value="Fan Mail">Fan Mail to Spidey & Web-Warriors</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-comic text-xs font-black uppercase text-[#1b1b20] mb-1">
                THE SCOOP / MESSAGE <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your eyewitness account, canon question, or scoop for the Bugle editorial desk..."
                className="w-full bg-white border-2 border-[#1b1b20] p-2 text-sm font-semibold text-[#1b1b20] focus:outline-hidden focus:ring-2 focus:ring-[#dc2626]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-[#1b1b20]">
              <span className="text-[11px] font-comic font-bold text-[#5b403d] uppercase">
                CONFIDENTIALITY GUARANTEED BY THE BUGLE
              </span>
              <button
                type="submit"
                className="bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs sm:text-sm font-black py-2.5 px-5 border-2 border-[#1b1b20] uppercase flex items-center gap-2 ink-btn ink-shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>SEND SCOOP TO BUGLE</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
