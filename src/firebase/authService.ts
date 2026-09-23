/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '../types';

/**
 * Translates Firebase internal Auth error codes into immersive Spider-Man comic feedback.
 */
export function getSpideyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return "OOF! THAT EMAIL ISN'T VALID.";
    case 'auth/user-not-found':
      return "THE SPIDER-SENSE CAN'T FIND THAT ACCOUNT.";
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'WRONG SECRET KEY! CHECK YOUR CREDENTIALS.';
    case 'auth/email-already-in-use':
      return 'THAT SPIDER ACCOUNT ALREADY EXISTS.';
    case 'auth/weak-password':
      return 'WEAK WEB! PASSWORD MUST BE AT LEAST 6 CHARACTERS.';
    case 'auth/network-request-failed':
      return "COULDN'T CONNECT TO THE SPIDER-VERSE. TRY AGAIN.";
    case 'auth/too-many-requests':
      return 'SPIDER-SENSE OVERLOAD! SLOW DOWN AND TRY AGAIN IN A MOMENT.';
    case 'passwords-mismatch':
      return "THE SPIDER-SENSE SAYS YOUR PASSWORDS DON'T MATCH.";
    case 'empty-fields':
      return 'HOLY WEB-SLINGER! PLEASE FILL OUT ALL REQUIRED FIELDS.';
    default:
      return 'COULDN’T CONNECT TO THE SPIDER-VERSE. PLEASE TRY AGAIN.';
  }
}

/**
 * Register a new hero account in Firebase Auth and initialize their Firestore profile.
 */
export async function registerSpiderHero(
  email: string,
  pass: string,
  displayName: string
): Promise<{ user: User; profile: UserProfile }> {
  const trimmedName = displayName.trim() || 'True Believer';
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;

  // Set Auth display name
  try {
    await updateProfile(user, { displayName: trimmedName });
  } catch (err) {
    console.warn('Failed to update display name on user profile:', err);
  }

  // Send verification webmail
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Email verification send issue:', err);
  }

  // Initialize strictly isolated Firestore User Profile
  const now = new Date().toISOString();
  const initialProfile: UserProfile = {
    id: user.uid,
    displayName: trimmedName,
    email: user.email || email.trim(),
    createdAt: now,
    lastLoginAt: now,
    totalXP: 0,
    totalScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    currentStreak: 0,
    factsDiscovered: 0,
    gamesPlayed: 0,
    achievementsUnlocked: 0,
    lastPlayedAt: now
  };

  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, initialProfile);

  return { user, profile: initialProfile };
}

/**
 * Log into existing hero account and sync their last login timestamp.
 */
export async function loginSpiderHero(
  email: string,
  pass: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      await updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString()
      });
    } else {
      // Re-initialize if missing
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        id: user.uid,
        displayName: user.displayName || 'True Believer',
        email: user.email || email.trim(),
        createdAt: now,
        lastLoginAt: now,
        totalXP: 0,
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        bestStreak: 0,
        currentStreak: 0,
        factsDiscovered: 0,
        gamesPlayed: 0,
        achievementsUnlocked: 0,
        lastPlayedAt: now
      };
      await setDoc(userDocRef, newProfile);
    }
  } catch (err) {
    console.warn('Error recording login timestamp:', err);
  }

  return user;
}

/**
 * Log out hero from Firebase Authentication.
 */
export async function logoutSpiderHero(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password reset email safely.
 */
export async function sendSpiderPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Resend email verification link.
 */
export async function resendSpiderVerification(user: User): Promise<void> {
  await sendEmailVerification(user);
}
