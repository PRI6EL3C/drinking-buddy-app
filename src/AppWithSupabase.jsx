import { useState, useEffect } from 'react';
import Header from './components/Header';
import CardStack from './components/CardStack';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import NotificationSettings from './components/NotificationSettings';
import { onAuthChange } from './supabase/authService';
import { 
  getUserProfile, 
  getAllUsers,
  createUserProfile,
  updateUserProfile,
  saveMatch,
  getUserMatches,
  getCompatibleUsers
} from './supabase/dbService';
import { registerUser, loginUser, logoutUser } from './supabase/authService';
import { 
  sendMatchNotification,
  sendNewUserNotification,
  initializeNotifications 
} from './supabase/notificationService';
import { isSupabaseConfigured } from './supabase/config';

function AppWithSupabase() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');
  const [matches, setMatches] = useState([]);
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = onAuthChange(async (event, session) => {
      if (session?.user) {
        const result = await getUserProfile(session.user.id);
        if (result.success) {
          setUserData(result.data);
          setIsAuthenticated(true);
          loadAvailableProfiles(result.data);
          loadUserMatches(session.user.id);
        } else {
          // User exists in auth but not in users table
          setIsAuthenticated(false);
          setUserData(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setMatches([]);
        setAvailableProfiles([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadAvailableProfiles = async (currentUser) => {
    const result = await getCompatibleUsers(currentUser);
    if (result.success) {
      const otherUsers = result.data.map(user => ({
        id: user.id,
        name: user.name,
        age: user.age,
        distance: user.distance.toFixed(1),
        drink: user.favoriteDrink,
        bio: user.bio || 'Обичам добрата компания!',
        image: user.photo || `https://i.pravatar.cc/400?img=${Date.now() % 70}`,
        interests: user.interests || [],
        compatibilityScore: user.compatibilityScore
      }));
      
      console.log('Налични профили от Supabase (сортирани по съвместимост):', otherUsers);
      setAvailableProfiles(otherUsers);
    }
  };

  const loadUserMatches = async (userId) => {
    const result = await getUserMatches(userId);
    if (result.success) {
      setMatches(result.data);
    }
  };

  useEffect(() => {
    if (activeTab === 'cards' && userData && isAuthenticated) {
      loadAvailableProfiles(userData);
    }
  }, [activeTab]);

  const handleRegister = async (formData) => {
    setLoading(true);
    
    // Register with Supabase Auth
    const authResult = await registerUser(formData.email, formData.password);
    
    if (!authResult.success) {
      alert('Грешка при регистрация: ' + authResult.error);
      setLoading(false);
      return;
    }

    // Create user profile in database
    const { password, confirmPassword, ...profileData } = formData;
    const dbResult = await createUserProfile(authResult.user.id, {
      ...profileData,
      email: formData.email
    });

    if (!dbResult.success) {
      alert('Грешка при създаване на профил: ' + dbResult.error);
      setLoading(false);
      return;
    }

    // Notify existing users about new user
    const allUsersResult = await getAllUsers();
    if (allUsersResult.success) {
      for (const user of allUsersResult.data) {
        if (user.id !== authResult.user.id) {
          await sendNewUserNotification(user.id, formData.name);
        }
      }
    }

    setLoading(false);
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    const result = await loginUser(formData.email, formData.password);
    
    if (!result.success) {
      alert('Грешка при вход: ' + result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleUpdateProfile = async (updatedData) => {
    if (!userData) return;

    const result = await updateUserProfile(userData.id, updatedData);
    
    if (result.success) {
      const newUserData = { ...userData, ...updatedData };
      setUserData(newUserData);
      loadAvailableProfiles(newUserData);
    } else {
      alert('Грешка при обновяване: ' + result.error);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setShowLogin(true);
    }
  };

  const handleMatch = async (profile) => {
    // Enhanced matching algorithm based on compatibility score
    const matchProbability = Math.min(0.9, 0.3 + (profile.compatibilityScore || 0) / 100);
    const isMatch = Math.random() < matchProbability;
    
    if (isMatch && userData) {
      const matchData = {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        drink: profile.drink,
        distance: profile.distance,
        compatibilityScore: profile.compatibilityScore
      };

      await saveMatch(userData.id, matchData);
      setMatches([...matches, matchData]);
      
      // Send notification to matched user
      await sendMatchNotification(
        profile.id,
        userData.name,
        userData.favoriteDrink,
        profile.distance
      );
      
      // Show enhanced local notification
      const compatibilityMessage = profile.compatibilityScore > 50 
        ? ` Вие сте ${profile.compatibilityScore}% съвместими!` 
        : '';
      
      setTimeout(() => {
        alert(`🎉 Match! ${profile.name} също ви хареса!${compatibilityMessage} ${profile.name} ви чака с ${profile.drink} на ${profile.distance} км от вас!`);
      }, 300);
    }
  };

  if (loading) {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return (
        <div className="h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-4">Supabase не е конфигуриран</h1>
              <p className="text-gray-600 mb-6">
                Трябва да настроите Supabase, за да работи приложението между различни устройства.
              </p>
              <a
                href="/SUPABASE-SETUP.md"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Инструкции за настройка
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Зареждане...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowLogin(false)}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowLogin(true)}
        />
      );
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {activeTab === 'cards' && (
          <div className="h-full">
            {availableProfiles.length > 0 ? (
              <CardStack profiles={availableProfiles} onMatch={handleMatch} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="text-8xl mb-6">😕</div>
                <h2 className="text-3xl font-bold mb-4">Няма налични потребители</h2>
                <p className="text-gray-500 text-lg mb-6">
                  Регистрирай повече потребители от друго устройство, за да видиш профили
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'matches' && (
          <MatchesView matches={matches} />
        )}
        
        {activeTab === 'profile' && (
          <div className="max-w-md mx-auto">
            <NotificationSettings userId={userData?.id} />
            <ProfileView 
              userData={userData} 
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default AppWithSupabase;
