import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGE_LEVELS } from '../../data/vocabulary';
import EmojiImage from '../../components/common/EmojiImage';

const AgeSelectionPage = ({ onAgeSelect }) => {
  const [selectedAge, setSelectedAge] = useState(null);
  const navigate = useNavigate();

  const handleAgeSelect = (ageLevel) => {
    setSelectedAge(ageLevel);
    setTimeout(() => {
      onAgeSelect(ageLevel);
      navigate('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
      <div className="max-w-4xl w-full">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-kids">
            Kids English Learning
          </h1>
          <div className="w-32 h-1 bg-spotify-500 mx-auto mb-6"></div>
          <p className="text-2xl text-light-300 font-medium font-kids">
            Choose your age level
          </p>
        </div>

        {/* Age Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.values(AGE_LEVELS).map((level) => (
            <button
              key={level.id}
              onClick={() => handleAgeSelect(level.id)}
              className={`age-card text-left ${
                selectedAge === level.id ? 'border-spotify-500 bg-dark-700 scale-105' : ''
              }`}
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <EmojiImage emoji={level.icon} size="64" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 font-kids">
                    {level.displayName}
                  </h3>
                  <p className="text-light-300 mb-2 font-kids">{level.ageRange}</p>
                  <p className="text-light-400 text-sm mb-3 font-kids">{level.description}</p>
                  <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 bg-spotify-500 text-dark-900 text-sm font-bold rounded-full font-kids">
                      {level.wordCount} words
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Hint Text */}
        <div className="text-center">
          <p className="text-light-400 text-sm font-kids">
            💡 You can change this anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeSelectionPage;
