import { useState } from 'react';
import { MapPin, Settings, Edit, Wine, LogOut } from 'lucide-react';
import EditProfileForm from './EditProfileForm';

const ProfileView = ({ userData, onLogout, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (updatedData) => {
    onUpdateProfile(updatedData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditProfileForm
        userData={userData}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Профил</h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={24} className="text-gray-600" />
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="relative h-80">
          <img
            src={userData?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <button className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Edit size={20} className="text-gray-700" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-2xl font-bold">{userData?.name || 'Вие'}</h3>
            <span className="text-xl text-gray-600">{userData?.age || '28'}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <MapPin size={18} />
            <span>{userData?.city || 'София'}, България</span>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Любима напитка</h4>
            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-full px-4 py-2 w-fit">
              <Wine size={20} className="text-pink-600" />
              <span className="font-semibold text-pink-700">{userData?.favoriteDrink || 'Jack Daniels'}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">За мен</h4>
            <p className="text-gray-600">
              {userData?.bio || 'Обичам добрата компания, интересни разговори и качествени напитки. Нека се срещнем за по едно питие! 🍺'}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Интереси</h4>
            <div className="flex flex-wrap gap-2">
              {(userData?.interests || ['Уиски', 'Музика', 'Спорт', 'Пътувания', 'Коктейли']).map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={() => setIsEditing(true)}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
        >
          Редактирай профил
        </button>
        <button className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          Настройки
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Изход
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
