import { useState } from 'react';
import { User, Mail, Lock, MapPin, Wine, Calendar, Camera } from 'lucide-react';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    city: '',
    favoriteDrink: '',
    bio: '',
    interests: [],
    photo: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const [errors, setErrors] = useState({});

  const drinks = ['Jack Daniels', 'Gin Tonic', 'Vodka', 'Вино', 'Бира', 'Ром', 'Текила', 'Уиски', 'Мохито', 'Мартини', 'Уиски Кола', 'Кампари', 'Аперол Шприц'];
  const interestOptions = ['Музика', 'Спорт', 'Танци', 'Пътувания', 'Филми', 'Готвене', 'Изкуство', 'Четене', 'Игри', 'Технологии', 'Фотография', 'Природа', 'Нощен живот', 'Кафенета', 'Фитнес', 'Йога'];

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

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Въведете име';
    if (!formData.email.trim()) newErrors.email = 'Въведете email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Невалиден email';
    if (!formData.password) newErrors.password = 'Въведете парола';
    else if (formData.password.length < 6) newErrors.password = 'Паролата трябва да е поне 6 символа';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Паролите не съвпадат';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.age) newErrors.age = 'Въведете възраст';
    else if (formData.age < 18) newErrors.age = 'Трябва да сте поне 18 години';
    if (!formData.city.trim()) newErrors.city = 'Въведете град';
    if (!formData.favoriteDrink) newErrors.favoriteDrink = 'Изберете любима напитка';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
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
    if (formData.interests.length < 2) {
      setErrors({ interests: 'Изберете поне два интереса за по-добри съвпадения' });
      return;
    }
    if (!formData.photo) {
      setErrors({ photo: 'Качете снимка за профил' });
      return;
    }
    onRegister(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-lg">
              <Wine className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
            DrinkBuddy
          </h1>
          <p className="text-gray-600">Намери си партньор за пиене</p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= num
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-1 ${step > num ? 'bg-pink-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Основна информация</h2>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Парола</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Поне 6 символа"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Потвърди парола</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Повтори паролата"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Напред
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Лична информация</h2>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">За мен (опционално)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="3"
                  placeholder="Разкажи нещо за себе си..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  Напред
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Интереси</h2>
              <p className="text-gray-600 text-sm mb-4">Избери поне един интерес</p>

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
              {errors.interests && <p className="text-red-500 text-sm">{errors.interests}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  Регистрирай се
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Вече имаш акаунт?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-pink-500 font-semibold hover:text-pink-600"
            >
              Влез
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
