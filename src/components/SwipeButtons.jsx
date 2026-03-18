const SwipeButtons = ({ onPass, onLike, onSuperLike, onUndo }) => {
  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button
        onClick={onUndo}
        className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
      >
        <span className="text-2xl">↩️</span>
      </button>
      
      <button
        onClick={onPass}
        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
      >
        <span className="text-3xl">✖️</span>
      </button>
      
      <button
        onClick={onSuperLike}
        className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
      >
        <span className="text-2xl">⭐</span>
      </button>
      
      <button
        onClick={onLike}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
      >
        <span className="text-3xl">❤️</span>
      </button>
    </div>
  );
};

export default SwipeButtons;
