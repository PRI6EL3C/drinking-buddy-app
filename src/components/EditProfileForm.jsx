import { useState } from 'react';
import { User, MapPin, Wine, Calendar, Camera, X } from 'lucide-react';

const EditProfileForm = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age || '',
    city: userData.city || '',
    favoriteDrink: userData.favoriteDrink || '',
    bio: userData.bio || '',
    interests: userData.interests || [],
    photo: userData.photo || ''
  });
  const [photoPreview, setPhotoPreview] = useState(userData.photo || null);
  const [errors, setErrors] = useState({});

  const drinks = ['Jack Daniels', 'Gin Tonic', 'Vodka', 'Вино', 'Бира', 'Ром', 'Текила', 'Уиски', 'Мохито'];
  const interestOptions = ['Музика', 'Спорт', 'Танци', 'Пътувания', 'Филми', 'Готвене', 'Изкуство', 'Четене'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const toggleInterest = (interest) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({ ...formData, interests: newInterests });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: 'Снимката е твърде голяма (максимум 5MB)' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
        setPhotoPreview(reader.result);
        setErrors({ ...errors, photo: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Въведете име';
    if (!formData.age) newErrors.age = 'Въведете възраст';
    else if (formData.age < 18) newErrors.age = 'Трябва да сте поне 18 години';
    if (!formData.city.trim()) newErrors.city = 'Въведете град';
    if (!formData.favoriteDrink) newErrors.favoriteDrink = 'Изберете любима напитка';
    if (formData.interests.length === 0) newErrors.interests = 'Изберете поне един интерес';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Редактирай профил</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Снимка на профил</label>
          <div className="flex flex-col items-center">
            {photoPreview && (
              <div className="relative w-32 h-32 mb-3">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full border-4 border-pink-500"
                />
              </div>
            )}
            <label className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
              <Camera size={18} className="inline mr-2" />
              Смени снимка
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Име</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Вашето име"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Възраст</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="18+"
              min="18"
            />
          </div>
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Град</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="София, България"
            />
          </div>
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Любима напитка</label>
          <select
            name="favoriteDrink"
            value={formData.favoriteDrink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Избери напитка</option>
            {drinks.map((drink) => (
              <option key={drink} value={drink}>{drink}</option>
            ))}
          </select>
          {errors.favoriteDrink && <p className="text-red-500 text-sm mt-1">{errors.favoriteDrink}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">За мен</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows="3"
            placeholder="Разкажи нещо за себе си..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Интереси</label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  formData.interests.includes(interest)
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Отказ
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            Запази промените
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
