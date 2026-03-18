import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from './config';

const USERS_COLLECTION = 'users';
const MATCHES_COLLECTION = 'matches';

// User operations
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...userData,
      id: userId,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkEmailExists = async (email) => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return { success: true, exists: !querySnapshot.empty };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Match operations
export const saveMatch = async (userId, matchData) => {
  try {
    const matchId = `${userId}_${matchData.id}`;
    await setDoc(doc(db, MATCHES_COLLECTION, matchId), {
      userId,
      matchedUserId: matchData.id,
      matchedAt: new Date().toISOString(),
      ...matchData
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserMatches = async (userId) => {
  try {
    const q = query(collection(db, MATCHES_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const matches = [];
    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
