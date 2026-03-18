import { useState, useEffect } from 'react';
import Header from './components/Header';
import CardStack from './components/CardStack';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');
  const [matches, setMatches] = useState([]);
  const [availableProfiles, setAvailableProfiles] = useState([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('drinkBuddyAuth');
    const savedUser = localStorage.getItem('drinkBuddyUser');
    const savedMatches = localStorage.getItem('drinkBuddyMatches');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      const currentUser = JSON.parse(savedUser);
      setUserData(currentUser);
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
      loadAvailableProfiles(currentUser);
    }
  }, []);

  const loadAvailableProfiles = (currentUser) => {
    const allUsers = JSON.parse(localStorage.getItem('drinkBuddyUsers') || '[]');
    console.log('Всички потребители:', allUsers);
    console.log('Текущ потребител:', currentUser);
    
    const otherUsers = allUsers
      .filter(user => user.id !== currentUser.id)
      .map(user => ({
        id: user.id,
        name: user.name,
        age: user.age,
        distance: (Math.random() * 3).toFixed(1),
        drink: user.favoriteDrink,
        bio: user.bio || 'Обичам добрата компания!',
        image: user.photo || `https://i.pravatar.cc/400?img=${user.id % 70}`,
        interests: user.interests || []
      }));
    
    console.log('Налични профили за swipe:', otherUsers);
    setAvailableProfiles(otherUsers);
  };

  useEffect(() => {
    if (matches.length > 0) {
      localStorage.setItem('drinkBuddyMatches', JSON.stringify(matches));
    }
  }, [matches]);

  useEffect(() => {
    if (activeTab === 'cards' && userData && isAuthenticated) {
      loadAvailableProfiles(userData);
    }
  }, [activeTab]);

  const handleRegister = (formData) => {
    const users = JSON.parse(localStorage.getItem('drinkBuddyUsers') || '[]');
    
    const emailExists = users.some(user => user.email === formData.email);
    if (emailExists) {
      alert('Този email вече е регистриран!');
      return;
    }
    
    const newUser = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('drinkBuddyUsers', JSON.stringify(users));
    localStorage.setItem('drinkBuddyAuth', 'true');
    localStorage.setItem('drinkBuddyUser', JSON.stringify(newUser));
    
    setUserData(newUser);
    setIsAuthenticated(true);
    loadAvailableProfiles(newUser);
  };

  const handleLogin = (formData) => {
    const users = JSON.parse(localStorage.getItem('drinkBuddyUsers') || '[]');
    
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (!user) {
      alert('Грешен email или парола!');
      return;
    }
    
    localStorage.setItem('drinkBuddyAuth', 'true');
    localStorage.setItem('drinkBuddyUser', JSON.stringify(user));
    
    setUserData(user);
    setIsAuthenticated(true);
    loadAvailableProfiles(user);
  };

  const handleUpdateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('drinkBuddyUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex !== -1) {
      const updatedUser = {
        ...userData,
        ...updatedData
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem('drinkBuddyUsers', JSON.stringify(users));
      localStorage.setItem('drinkBuddyUser', JSON.stringify(updatedUser));
      
      setUserData(updatedUser);
      loadAvailableProfiles(updatedUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('drinkBuddyAuth');
    localStorage.removeItem('drinkBuddyUser');
    localStorage.removeItem('drinkBuddyMatches');
    setIsAuthenticated(false);
    setUserData(null);
    setMatches([]);
    setShowLogin(true);
  };

  const handleMatch = (profile) => {
    const isMatch = Math.random() > 0.5;
    
    if (isMatch) {
      setMatches([...matches, profile]);
      
      setTimeout(() => {
        alert(`🎉 Match! ${profile.name} също ви хареса! ${profile.name} ви чака с ${profile.drink} на ${profile.distance} км от вас!`);
      }, 300);
    }
  };

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
                  Регистрирай повече потребители, за да видиш профили
                </p>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
                >
                  Изход и регистрация на нов потребител
                </button>
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

export default App;
