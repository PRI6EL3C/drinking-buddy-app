import { useState } from 'react';
import Card from './Card';
import SimpleCard from './SimpleCard';
import SwipeButtons from './SwipeButtons';
import { motion, AnimatePresence } from 'framer-motion';

const CardStack = ({ profiles, onMatch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);

  const handleSwipe = (direction) => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    setHistory([...history, { profile, direction }]);

    if (direction === 'right') {
      onMatch(profile);
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    setCurrentIndex(currentIndex - 1);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Няма повече профили</h2>
          <p className="text-gray-500 text-lg mb-6">
            Разгледахте всички потребители в района
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setHistory([]);
            }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            Започни отначало
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="relative w-full max-w-sm" style={{ height: '550px' }}>
          {profiles.slice(currentIndex, currentIndex + 1).map((profile, index) => (
            <SimpleCard
              key={profile.id}
              profile={profile}
              style={{
                zIndex: 1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0">
        <SwipeButtons
          onPass={() => handleSwipe('left')}
          onLike={() => handleSwipe('right')}
          onSuperLike={() => handleSwipe('super')}
          onUndo={handleUndo}
        />
      </div>
    </div>
  );
};

export default CardStack;
