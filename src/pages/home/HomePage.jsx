import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { AGE_LEVELS, WORD_CATEGORIES } from '../../data/vocabulary';
import { getStatistics } from '../../services/progressService';
import { BookOpen, Sparkles } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const HomePage = () => {
  const { currentChild } = useChild();
  const [stats, setStats] = useState({
    totalWordsLearned: 0,
    wordsLearnedToday: 0,
    wordsForReview: 0,
    streak: 0,
    totalLearningTime: 0,
  });

  useEffect(() => {
    // Load statistics
    const statistics = getStatistics();
    setStats(statistics);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-dark-900 pb-24 md:pb-6">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8 bg-gradient-to-br from-spotify-700 to-spotify-900 rounded-lg p-4 sm:p-6 lg:p-8 animate-pop">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white font-kids">
              Good to see you!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-spotify-200 font-kids">
              {currentChild?.name || 'Little Friend'}
            </p>

            {/* Family Illustrations */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 mt-3 sm:mt-6">
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 transition-all flex-1">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👨" size={32} />
                </div>
                <p className="text-[10px] sm:text-xs text-spotify-200 font-kids">Dad</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 transition-all flex-1">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👩" size={32} />
                </div>
                <p className="text-[10px] sm:text-xs text-spotify-200 font-kids">Mom</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 transition-all flex-1">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="🐕" size={32} />
                </div>
                <p className="text-[10px] sm:text-xs text-spotify-200 font-kids">Corgi</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 transition-all flex-1">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👴" size={32} />
                </div>
                <p className="text-[10px] sm:text-xs text-spotify-200 font-kids">Grandpa</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 transition-all flex-1">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👵" size={32} />
                </div>
                <p className="text-[10px] sm:text-xs text-spotify-200 font-kids">Grandma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white flex items-center font-kids">
            <Sparkles className="mr-2 sm:mr-3 text-spotify-500 animate-pulse-slow" size={20} />
            Jump back in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Link to="/learn/new" className="group card hover:scale-[1.02] transition-all p-3 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="animate-bounce-slow">
                  <EmojiImage emoji="✨" size="32 sm:64" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 font-kids">Learn New Words</h3>
                  <p className="text-xs sm:text-sm sm:text-base text-light-300 font-kids">Discover fun vocabulary</p>
                </div>
              </div>
            </Link>

            <Link to="/learn/review" className="group card hover:scale-[1.02] transition-all p-3 sm:p-6 relative">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="animate-bounce-slow">
                  <EmojiImage emoji="💫" size="32 sm:64" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 font-kids">Review</h3>
                  <p className="text-xs sm:text-sm sm:text-base text-light-300 font-kids">Practice what you learned</p>
                </div>
              </div>
              {stats.wordsForReview > 0 && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-spotify-500 text-dark-900 font-bold rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center font-kids animate-bounce text-[10px] sm:text-base">
                  {stats.wordsForReview}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white flex items-center font-kids">
            <BookOpen className="mr-2 sm:mr-3 text-spotify-500" size={20} />
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.values(WORD_CATEGORIES).map((category, index) => (
              <Link
                key={category.id}
                to={`/learn/category/${category.id}`}
                className="group card hover:scale-105 transition-all text-center p-3 sm:p-6"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="mb-2 sm:mb-3 group-hover:animate-bounce-slow">
                  <EmojiImage emoji={category.icon} size="32 sm:56" />
                </div>
                <h3 className="font-bold text-white text-[10px] sm:text-sm font-kids">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white font-kids">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="card hover:scale-105 transition-transform cursor-pointer p-3 sm:p-6 bg-gradient-to-br from-spotify-600 to-spotify-800">
              <div className="text-center">
                <div className="mb-2 sm:mb-3 animate-pulse-slow">
                  <EmojiImage emoji="🎯" size="28 sm:56" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-white font-kids mb-0.5 sm:mb-1">{stats.totalWordsLearned}</div>
                <p className="text-[10px] sm:text-sm font-medium text-spotify-100 font-kids">Words Learned</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-3 sm:p-6 bg-gradient-to-br from-orange-600 to-orange-800">
              <div className="text-center">
                <div className="mb-2 sm:mb-3 animate-bounce-slow">
                  <EmojiImage emoji="🔥" size="28 sm:56" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-white font-kids mb-0.5 sm:mb-1">{stats.streak}</div>
                <p className="text-[10px] sm:text-sm font-medium text-orange-100 font-kids">Day Streak</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-3 sm:p-6 bg-gradient-to-br from-purple-600 to-purple-800">
              <div className="text-center">
                <div className="mb-2 sm:mb-3 animate-float">
                  <EmojiImage emoji="⭐" size="28 sm:56" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-white font-kids mb-0.5 sm:mb-1">0</div>
                <p className="text-[10px] sm:text-sm font-medium text-purple-100 font-kids">Mastery Level</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-3 sm:p-6 bg-gradient-to-br from-yellow-600 to-yellow-800">
              <div className="text-center">
                <div className="mb-2 sm:mb-3 animate-wiggle">
                  <EmojiImage emoji="🏆" size="28 sm:56" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-white font-kids mb-0.5 sm:mb-1">0</div>
                <p className="text-[10px] sm:text-sm font-medium text-yellow-100 font-kids">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
