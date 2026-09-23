/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import {
  UserProfile,
  GameSessionRecord,
  DiscoveredFactRecord,
  AchievementRecord
} from '../types';

/**
 * Subscribes to real-time updates for the authenticated user's profile document.
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Omit<UserProfile, 'id'>;
        onUpdate({ id: snap.id, ...data });
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('UserProfile snapshot subscription error:', err);
      onError?.(err);
    }
  );
}

/**
 * Subscribes to the user's unlocked achievements subcollection.
 */
export function subscribeToUserAchievements(
  userId: string,
  onUpdate: (achievementIds: string[]) => void
): Unsubscribe {
  const colRef = collection(db, 'users', userId, 'achievements');
  return onSnapshot(
    colRef,
    (snap) => {
      const ids = snap.docs.map((d) => d.id);
      onUpdate(ids);
    },
    (err) => {
      console.warn('Achievements subscription error:', err);
    }
  );
}

/**
 * Subscribes to the user's discovered facts subcollection.
 */
export function subscribeToDiscoveredFacts(
  userId: string,
  onUpdate: (factIds: string[]) => void
): Unsubscribe {
  const colRef = collection(db, 'users', userId, 'discoveredFacts');
  return onSnapshot(
    colRef,
    (snap) => {
      const ids = snap.docs.map((d) => d.id);
      onUpdate(ids);
    },
    (err) => {
      console.warn('Discovered facts subscription error:', err);
    }
  );
}

/**
 * Subscribes to the user's recent game sessions.
 */
export function subscribeToGameSessions(
  userId: string,
  onUpdate: (sessions: GameSessionRecord[]) => void
): Unsubscribe {
  const colRef = collection(db, 'users', userId, 'gameSessions');
  const q = query(colRef, orderBy('completedAt', 'desc'), limit(10));
  return onSnapshot(
    q,
    (snap) => {
      const sessions = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GameSessionRecord, 'id'>)
      }));
      onUpdate(sessions);
    },
    (err) => {
      console.warn('Game sessions subscription error:', err);
    }
  );
}

/**
 * Records a completed game session into the user's private subcollection
 * and atomically updates the aggregate stats on their profile.
 */
export async function saveGameSession(
  userId: string,
  session: Omit<GameSessionRecord, 'id' | 'userId'>
): Promise<void> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const sessionRef = doc(db, 'users', userId, 'gameSessions', sessionId);
  const userRef = doc(db, 'users', userId);

  const sessionPayload: GameSessionRecord = {
    id: sessionId,
    userId,
    ...session
  };

  // 1. Write the immutable session record
  await setDoc(sessionRef, sessionPayload);

  // 2. Fetch existing best streak to preserve the peak record
  let newBestStreak = session.bestStreak;
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentData = userSnap.data() as UserProfile;
      newBestStreak = Math.max(currentData.bestStreak || 0, session.bestStreak);
    }
  } catch (err) {
    console.warn('Could not read existing profile for bestStreak calculation:', err);
  }

  // 3. Atomically update user totals
  await updateDoc(userRef, {
    totalScore: increment(session.score),
    totalXP: increment(session.xpEarned),
    totalQuestions: increment(session.questionsAnswered),
    correctAnswers: increment(session.correctAnswers),
    gamesPlayed: increment(1),
    bestStreak: newBestStreak,
    currentStreak: session.bestStreak,
    lastPlayedAt: session.completedAt
  });
}

/**
 * Records a discovered comic fact for the user.
 * Strictly guarantees that duplicate discoveries DO NOT increment the user's total count.
 */
export async function saveDiscoveredFact(
  userId: string,
  factId: string,
  gameMode: string
): Promise<{ isNew: boolean }> {
  const factRef = doc(db, 'users', userId, 'discoveredFacts', factId);
  const existing = await getDoc(factRef);

  if (existing.exists()) {
    // Fact already discovered earlier; do not double count
    return { isNew: false };
  }

  const factRecord: DiscoveredFactRecord = {
    id: factId,
    userId,
    factId,
    discoveredAt: new Date().toISOString(),
    gameMode
  };

  await setDoc(factRef, factRecord);

  // Increment user's aggregate facts count
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    factsDiscovered: increment(1)
  });

  return { isNew: true };
}

/**
 * Unlocks an achievement for the user if not already unlocked.
 */
export async function unlockUserAchievement(
  userId: string,
  achievementId: string
): Promise<{ isNew: boolean }> {
  const achRef = doc(db, 'users', userId, 'achievements', achievementId);
  const existing = await getDoc(achRef);

  if (existing.exists()) {
    return { isNew: false };
  }

  const record: AchievementRecord = {
    id: achievementId,
    userId,
    achievementId,
    unlockedAt: new Date().toISOString()
  };

  await setDoc(achRef, record);

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    achievementsUnlocked: increment(1),
    totalXP: increment(250) // Bonus XP for achievement
  });

  return { isNew: true };
}

/**
 * Lightweight real-time progress update for live answers.
 */
export async function syncLiveAnswerResult(
  userId: string,
  isCorrect: boolean,
  pointsEarned: number,
  currentStreak: number
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    const userSnap = await getDoc(userRef);
    let bestStreakUpdate: number | undefined = undefined;
    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      if (currentStreak > (data.bestStreak || 0)) {
        bestStreakUpdate = currentStreak;
      }
    }

    const updates: Record<string, any> = {
      totalScore: increment(pointsEarned),
      totalXP: increment(Math.floor(pointsEarned * 0.8)),
      totalQuestions: increment(1),
      correctAnswers: isCorrect ? increment(1) : increment(0),
      currentStreak: currentStreak,
      lastPlayedAt: new Date().toISOString()
    };

    if (bestStreakUpdate !== undefined) {
      updates.bestStreak = bestStreakUpdate;
    }

    await updateDoc(userRef, updates);
  } catch (err) {
    console.warn('Failed to sync live answer result:', err);
  }
}
