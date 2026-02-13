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
    <div className="min-h-screen p-6 bg-dark-900">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-br from-spotify-700 to-spotify-900 rounded-lg p-8 animate-pop">
          <div>
            <h1 className="text-5xl font-bold mb-3 text-white font-kids">
              Good to see you!
            </h1>
            <p className="text-2xl text-spotify-200 font-kids">
              {currentChild?.name || 'Little Friend'}
            </p>

            {/* Family Illustrations */}
            <div className="flex items-center gap-4 mt-6">
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👨" size="48" />
                </div>
                <p className="text-xs text-spotify-200 font-kids">Dad</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👩" size="48" />
                </div>
                <p className="text-xs text-spotify-200 font-kids">Mom</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="🐕" size="48" />
                </div>
                <p className="text-xs text-spotify-200 font-kids">Corgi</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👴" size="48" />
                </div>
                <p className="text-xs text-spotify-200 font-kids">Grandpa</p>
              </div>
              <div className="text-center group cursor-pointer bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                <div className="mb-1 animate-wiggle">
                  <EmojiImage emoji="👵" size="48" />
                </div>
                <p className="text-xs text-spotify-200 font-kids">Grandma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center font-kids">
            <Sparkles className="mr-3 text-spotify-500 animate-pulse-slow" size={32} />
            Jump back in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/learn/new" className="group card hover:scale-[1.02] transition-all p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-bounce-slow">
                  <EmojiImage emoji="✨" size="64" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-kids">Learn New Words</h3>
                  <p className="text-light-300 font-kids">Discover fun vocabulary</p>
                </div>
              </div>
            </Link>

            <Link to="/learn/review" className="group card hover:scale-[1.02] transition-all p-6 relative">
              <div className="flex items-center space-x-4">
                <div className="animate-bounce-slow">
                  <EmojiImage emoji="💫" size="64" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-kids">Review</h3>
                  <p className="text-light-300 font-kids">Practice what you learned</p>
                </div>
              </div>
              {stats.wordsForReview > 0 && (
                <div className="absolute top-4 right-4 bg-spotify-500 text-dark-900 font-bold rounded-full w-10 h-10 flex items-center justify-center font-kids animate-bounce">
                  {stats.wordsForReview}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center font-kids">
            <BookOpen className="mr-3 text-spotify-500" size={32} />
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.values(WORD_CATEGORIES).map((category, index) => (
              <Link
                key={category.id}
                to={`/learn/category/${category.id}`}
                className="group card hover:scale-105 transition-all text-center p-6"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="mb-3 group-hover:animate-bounce-slow">
                  <EmojiImage emoji={category.icon} size="56" />
                </div>
                <h3 className="font-bold text-white text-sm font-kids">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-white font-kids">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card hover:scale-105 transition-transform cursor-pointer p-6 bg-gradient-to-br from-spotify-600 to-spotify-800">
              <div className="text-center">
                <div className="mb-3 animate-pulse-slow">
                  <EmojiImage emoji="🎯" size="56" />
                </div>
                <div className="text-4xl font-bold text-white font-kids mb-1">{stats.totalWordsLearned}</div>
                <p className="text-sm font-medium text-spotify-100 font-kids">Words Learned</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-6 bg-gradient-to-br from-orange-600 to-orange-800">
              <div className="text-center">
                <div className="mb-3 animate-bounce-slow">
                  <EmojiImage emoji="🔥" size="56" />
                </div>
                <div className="text-4xl font-bold text-white font-kids mb-1">{stats.streak}</div>
                <p className="text-sm font-medium text-orange-100 font-kids">Day Streak</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-6 bg-gradient-to-br from-purple-600 to-purple-800">
              <div className="text-center">
                <div className="mb-3 animate-float">
                  <EmojiImage emoji="⭐" size="56" />
                </div>
                <div className="text-4xl font-bold text-white font-kids mb-1">0</div>
                <p className="text-sm font-medium text-purple-100 font-kids">Mastery Level</p>
              </div>
            </div>
            <div className="card hover:scale-105 transition-transform cursor-pointer p-6 bg-gradient-to-br from-yellow-600 to-yellow-800">
              <div className="text-center">
                <div className="mb-3 animate-wiggle">
                  <EmojiImage emoji="🏆" size="56" />
                </div>
                <div className="text-4xl font-bold text-white font-kids mb-1">0</div>
                <p className="text-sm font-medium text-yellow-100 font-kids">Achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Playground Link */}
        <div className="text-center">
          <Link to="/playground" className="btn-primary inline-flex items-center space-x-2 text-lg font-kids">
            <EmojiImage emoji="🎨" size="24" />
            <span>Design Playground</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
