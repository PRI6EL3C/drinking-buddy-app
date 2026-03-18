import { useState, useEffect } from 'react';
import Header from './components/Header';
import CardStack from './components/CardStack';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import { onAuthChange } from './firebase/authService';
import { 
  getUserProfile, 
  getAllUsers,
  createUserProfile,
  updateUserProfile,
  saveMatch,
  getUserMatches 
} from './firebase/dbService';
import { registerUser, loginUser, logoutUser } from './firebase/authService';

function AppWithFirebase() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');
  const [matches, setMatches] = useState([]);
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setUserData(result.data);
          setIsAuthenticated(true);
          loadAvailableProfiles(result.data);
          loadUserMatches(user.uid);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setMatches([]);
        setAvailableProfiles([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAvailableProfiles = async (currentUser) => {
    const result = await getAllUsers();
    if (result.success) {
      const otherUsers = result.data
        .filter(user => user.id !== currentUser.id)
        .map(user => ({
          id: user.id,
          name: user.name,
          age: user.age,
          distance: (Math.random() * 3).toFixed(1),
          drink: user.favoriteDrink,
          bio: user.bio || 'Обичам добрата компания!',
          image: user.photo || `https://i.pravatar.cc/400?img=${Date.now() % 70}`,
          interests: user.interests || []
        }));
      
      console.log('Налични профили от Firebase:', otherUsers);
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
    
    // Register with Firebase Auth
    const authResult = await registerUser(formData.email, formData.password);
    
    if (!authResult.success) {
      alert('Грешка при регистрация: ' + authResult.error);
      setLoading(false);
      return;
    }

    // Create user profile in Firestore
    const { password, confirmPassword, ...profileData } = formData;
    const dbResult = await createUserProfile(authResult.user.uid, {
      ...profileData,
      email: formData.email
    });

    if (!dbResult.success) {
      alert('Грешка при създаване на профил: ' + dbResult.error);
      setLoading(false);
      return;
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
    const isMatch = Math.random() > 0.5;
    
    if (isMatch && userData) {
      const matchData = {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        drink: profile.drink,
        distance: profile.distance
      };

      await saveMatch(userData.id, matchData);
      setMatches([...matches, matchData]);
      
      setTimeout(() => {
        alert(`🎉 Match! ${profile.name} също ви хареса! ${profile.name} ви чака с ${profile.drink} на ${profile.distance} км от вас!`);
      }, 300);
    }
  };

  if (loading) {
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
          <ProfileView 
            userData={userData} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>
    </div>
  );
}

export default AppWithFirebase;
