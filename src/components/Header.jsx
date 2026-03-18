const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'cards', name: 'Карти', icon: '💕' },
    { id: 'matches', name: 'Съвпадения', icon: '💝' },
    { id: 'profile', name: 'Профил', icon: '👤' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🍷</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              DrinkBuddy
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
