import { useState } from 'react';
import { MessageCircle, MapPin, Wine } from 'lucide-react';
import ChatView from './ChatView';

const MatchesView = ({ matches }) => {
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return <ChatView match={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Съвпадения</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍺</div>
          <p className="text-gray-500 text-lg">Все още нямате съвпадения</p>
          <p className="text-gray-400 mt-2">Продължете да swipe-вате!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center p-4">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{match.name}</h3>
                    <span className="text-gray-500">{match.age}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{match.distance} км</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-red-100 rounded-full px-3 py-1 w-fit">
                    <Wine size={16} className="text-pink-600" />
                    <span className="text-sm font-semibold text-pink-700">
                      {match.drink}
                    </span>
                  </div>
                </div>
                
                <button className="p-3 bg-gradient-to-br from-pink-500 to-red-500 rounded-full hover:scale-110 transition-transform">
                  <MessageCircle size={24} className="text-white" />
                </button>
              </div>
              
              <div className="bg-green-50 border-t border-green-100 px-4 py-3">
                <p className="text-green-700 text-sm font-medium">
                  ✨ Вие и {match.name} си харесахте взаимно!
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesView;
