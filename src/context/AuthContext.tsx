/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  registerSpiderHero,
  loginSpiderHero,
  logoutSpiderHero,
  sendSpiderPasswordReset,
  resendSpiderVerification
} from '../firebase/authService';
import {
  subscribeToUserProfile,
  subscribeToUserAchievements,
  subscribeToDiscoveredFacts,
  subscribeToGameSessions,
  saveGameSession,
  saveDiscoveredFact,
  unlockUserAchievement,
  syncLiveAnswerResult
} from '../firebase/gameDataService';
import { UserProfile, GameSessionRecord } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  unlockedAchievementIds: string[];
  discoveredFactIds: string[];
  recentGameSessions: GameSessionRecord[];
  loading: boolean;
  networkError: string | null;
  clearNetworkError: () => void;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logIn: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  reloadUserStatus: () => Promise<boolean>;
  recordSession: (session: Omit<GameSessionRecord, 'id' | 'userId'>) => Promise<void>;
  recordFact: (factId: string, gameMode: string) => Promise<boolean>;
  recordAchievement: (achievementId: string) => Promise<boolean>;
  syncAnswerResult: (isCorrect: boolean, points: number, streak: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [discoveredFactIds, setDiscoveredFactIds] = useState<string[]>([]);
  const [recentGameSessions, setRecentGameSessions] = useState<GameSessionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Active Firestore listeners cleanup refs
  const profileUnsubRef = useRef<(() => void) | null>(null);
  const achievementsUnsubRef = useRef<(() => void) | null>(null);
  const factsUnsubRef = useRef<(() => void) | null>(null);
  const sessionsUnsubRef = useRef<(() => void) | null>(null);

  const cleanupListeners = () => {
    if (profileUnsubRef.current) {
      profileUnsubRef.current();
      profileUnsubRef.current = null;
    }
    if (achievementsUnsubRef.current) {
      achievementsUnsubRef.current();
      achievementsUnsubRef.current = null;
    }
    if (factsUnsubRef.current) {
      factsUnsubRef.current();
      factsUnsubRef.current = null;
    }
    if (sessionsUnsubRef.current) {
      sessionsUnsubRef.current();
      sessionsUnsubRef.current = null;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        cleanupListeners();

        if (currentUser) {
          setUser(currentUser);
          setNetworkError(null);

          // 1. Subscribe to profile
          profileUnsubRef.current = subscribeToUserProfile(
            currentUser.uid,
            (profile) => {
              setUserProfile(profile);
              setLoading(false);
            },
            (err) => {
              setNetworkError("THE WEB CONNECTION DROPPED. COULDN'T SYNC YOUR DOSSIER.");
              setLoading(false);
            }
          );

          // 2. Subscribe to achievements
          achievementsUnsubRef.current = subscribeToUserAchievements(
            currentUser.uid,
            (ids) => setUnlockedAchievementIds(ids)
          );

          // 3. Subscribe to discovered facts
          factsUnsubRef.current = subscribeToDiscoveredFacts(
            currentUser.uid,
            (ids) => setDiscoveredFactIds(ids)
          );

          // 4. Subscribe to game sessions
          sessionsUnsubRef.current = subscribeToGameSessions(
            currentUser.uid,
            (sessions) => setRecentGameSessions(sessions)
          );
        } else {
          setUser(null);
          setUserProfile(null);
          setUnlockedAchievementIds([]);
          setDiscoveredFactIds([]);
          setRecentGameSessions([]);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firebase Auth State Change Error:', error);
        setNetworkError("THE WEB CONNECTION DROPPED. PLEASE CHECK YOUR NETWORK.");
        setLoading(false);
      }
    );

    return () => {
      cleanupListeners();
      unsubscribeAuth();
    };
  }, []);

  const clearNetworkError = () => {
    setNetworkError(null);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setNetworkError(null);
    const { user: newUser, profile } = await registerSpiderHero(email, pass, name);
    setUser(newUser);
    setUserProfile(profile);
  };

  const logIn = async (email: string, pass: string) => {
    setNetworkError(null);
    const loggedUser = await loginSpiderHero(email, pass);
    setUser(loggedUser);
  };

  const logOut = async () => {
    cleanupListeners();
    await logoutSpiderHero();
    setUser(null);
    setUserProfile(null);
    setUnlockedAchievementIds([]);
    setDiscoveredFactIds([]);
    setRecentGameSessions([]);
  };

  const sendPasswordReset = async (email: string) => {
    await sendSpiderPasswordReset(email);
  };

  const resendVerification = async () => {
    if (!user) throw new Error('No hero currently logged in');
    await resendSpiderVerification(user);
  };

  const reloadUserStatus = async (): Promise<boolean> => {
    if (!user) return false;
    await user.reload();
    return user.emailVerified;
  };

  const recordSession = async (session: Omit<GameSessionRecord, 'id' | 'userId'>) => {
    if (!user) return;
    await saveGameSession(user.uid, session);
  };

  const recordFact = async (factId: string, gameMode: string): Promise<boolean> => {
    if (!user) return false;
    const { isNew } = await saveDiscoveredFact(user.uid, factId, gameMode);
    return isNew;
  };

  const recordAchievement = async (achievementId: string): Promise<boolean> => {
    if (!user) return false;
    const { isNew } = await unlockUserAchievement(user.uid, achievementId);
    return isNew;
  };

  const syncAnswerResult = async (isCorrect: boolean, points: number, streak: number) => {
    if (!user) return;
    await syncLiveAnswerResult(user.uid, isCorrect, points, streak);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        unlockedAchievementIds,
        discoveredFactIds,
        recentGameSessions,
        loading,
        networkError,
        clearNetworkError,
        signUp,
        logIn,
        logOut,
        sendPasswordReset,
        resendVerification,
        reloadUserStatus,
        recordSession,
        recordFact,
        recordAchievement,
        syncAnswerResult
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSpiderAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSpiderAuth must be used within an AuthProvider');
  }
  return context;
};
