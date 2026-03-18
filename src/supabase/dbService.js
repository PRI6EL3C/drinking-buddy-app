import { supabase } from './config';

export const createUserProfile = async (userId, userData) => {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        ...userData,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async (currentUserCity = null, currentUserAge = null) => {
  try {
    let query = supabase
      .from('users')
      .select('*')
      .neq('status', 'inactive'); // Exclude inactive users
    
    // Optional: Filter by city if provided (for better matching)
    if (currentUserCity) {
      query = query.ilike('city', `%${currentUserCity}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, exists: data.length > 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveMatch = async (userId, matchData) => {
  try {
    const { error } = await supabase
      .from('matches')
      .insert({
        user_id: userId,
        matched_user_id: matchData.id,
        matched_at: new Date().toISOString(),
        ...matchData
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserMatches = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .order('matched_at', { ascending: false });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// New function for better matching algorithm
export const getCompatibilityScore = (user1, user2) => {
  let score = 0;
  
  // Age compatibility (closer ages = higher score)
  if (user1.age && user2.age) {
    const ageDiff = Math.abs(user1.age - user2.age);
    score += Math.max(0, 20 - ageDiff * 2); // Max 20 points
  }
  
  // Same city bonus
  if (user1.city && user2.city && user1.city.toLowerCase() === user2.city.toLowerCase()) {
    score += 30; // Big bonus for same city
  }
  
  // Interest compatibility
  if (user1.interests && user2.interests) {
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    score += commonInterests.length * 10; // 10 points per common interest
  }
  
  // Same favorite drink bonus
  if (user1.favoriteDrink && user2.favoriteDrink && user1.favoriteDrink === user2.favoriteDrink) {
    score += 15;
  }
  
  return score;
};

// Enhanced user search with compatibility scoring
export const getCompatibleUsers = async (currentUser) => {
  try {
    const { data: allUsers, error } = await getAllUsers(currentUser.city, currentUser.age);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Filter out current user and calculate compatibility scores
    const compatibleUsers = allUsers
      .filter(user => user.id !== currentUser.id)
      .map(user => ({
        ...user,
        compatibilityScore: getCompatibilityScore(currentUser, user),
        distance: calculateDistance(currentUser.city, user.city)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore); // Sort by compatibility
    
    return { success: true, data: compatibleUsers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Simple distance calculation (placeholder - could be enhanced with real geolocation)
const calculateDistance = (city1, city2) => {
  if (!city1 || !city2) return Math.random() * 10; // Random distance if cities unknown
  
  if (city1.toLowerCase() === city2.toLowerCase()) {
    return Math.random() * 2; // 0-2 km if same city
  }
  
  return Math.random() * 20 + 5; // 5-25 km if different cities
};
