import { MapPin, Wine, Heart } from 'lucide-react';

const SimpleCard = ({ profile, style = {} }) => {
  return (
    <div
      style={{
        ...style,
      }}
      className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-400 to-purple-500"
    >
      <img
        src={profile.image}
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
        {/* Compatibility Score */}
        {profile.compatibilityScore && (
          <div className="absolute top-2 right-2 bg-green-500/90 rounded-full px-3 py-1 flex items-center gap-1">
            <Heart size={14} />
            <span className="text-sm font-bold">{profile.compatibilityScore}%</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <span className="text-2xl">{profile.age}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={18} />
          <span className="text-lg">{profile.distance} км от вас</span>
        </div>
        
        <div className="inline-flex items-center gap-2 mb-3 bg-pink-500/90 rounded-full px-4 py-2">
          <Wine size={20} />
          <span className="text-lg font-bold">{profile.drink}</span>
        </div>
        
        <p className="text-white/90 mb-3 text-sm">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/20 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleCard;
