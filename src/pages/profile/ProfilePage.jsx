import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { AGE_LEVELS } from '../../data/vocabulary';
import { getStatistics } from '../../services/progressService';
import { Settings, Trophy, Target, Flame, Star, BookOpen, Calendar } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const ProfilePage = () => {
  const { currentChild } = useChild();
  const [stats, setStats] = useState({
    totalWordsLearned: 0,
    wordsLearnedToday: 0,
    wordsForReview: 0,
    streak: 0,
    totalLearningTime: 0,
  });

  // Load statistics
  useEffect(() => {
    const statistics = getStatistics();
    setStats(statistics);
  }, []);

  // Get age level info
  const ageLevel = AGE_LEVELS[currentChild?.age_level?.toUpperCase()] || AGE_LEVELS.AGE_1;

  // Calculate mastery level based on words learned
  const masteryLevel = Math.min(5, Math.floor(stats.totalWordsLearned / 10));

  const recentActivity = [
    // Mock data - would come from database
  ];

  const achievements = [
    { id: 1, name: 'First Word', description: 'Learn your first word', icon: '🎯', unlocked: stats.totalWordsLearned >= 1 },
    { id: 2, name: 'Quick Learner', description: 'Learn 10 words', icon: '⚡', unlocked: stats.totalWordsLearned >= 10 },
    { id: 3, name: 'Word Master', description: 'Learn 50 words', icon: '👑', unlocked: stats.totalWordsLearned >= 50 },
    { id: 4, name: 'On Fire!', description: '7 day streak', icon: '🔥', unlocked: stats.streak >= 7 },
    { id: 5, name: 'Dedicated', description: '30 day streak', icon: '💪', unlocked: stats.streak >= 30 },
    { id: 6, name: 'Category Explorer', description: 'Complete 5 categories', icon: '🗺️', unlocked: false },
  ];

  // Calculate achievements unlocked
  const achievementsUnlocked = achievements.filter(a => a.unlocked).length;

  // Mock data - in real app this would come from database
  const statsData = {
    wordsLearned: stats.totalWordsLearned,
    streak: stats.streak,
    masteryLevel: masteryLevel,
    achievements: achievementsUnlocked,
    totalLearningTime: stats.totalLearningTime,
    lastActive: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen p-6 bg-dark-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white font-kids">Profile</h1>
          <Link
            to="/settings"
            className="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 text-white px-4 py-3 rounded-full transition-all font-kids"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="mb-10 bg-gradient-to-br from-spotify-700 to-spotify-900 rounded-2xl p-8 animate-pop">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="bg-white rounded-full p-6">
                <EmojiImage emoji={ageLevel.icon} size="80" />
              </div>

              {/* Info */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-2 font-kids">
                  {currentChild?.name || 'Little Friend'}
                </h2>
                <p className="text-xl text-spotify-200 mb-2 font-kids">
                  {ageLevel.displayName}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="bg-spotify-500 text-dark-900 px-4 py-1 rounded-full text-sm font-bold font-kids">
                    {ageLevel.wordCount} words available
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white font-kids">{statsData.wordsLearned}</div>
                <p className="text-spotify-200 text-sm font-kids">Words</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white font-kids">{statsData.streak}</div>
                <p className="text-spotify-200 text-sm font-kids">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6 font-kids">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 bg-gradient-to-br from-spotify-600 to-spotify-800">
              <div className="text-center">
                <Target className="mx-auto mb-3 text-spotify-200" size={40} />
                <div className="text-4xl font-bold text-white font-kids mb-1">{statsData.wordsLearned}</div>
                <p className="text-sm font-medium text-spotify-100 font-kids">Words Learned</p>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-orange-600 to-orange-800">
              <div className="text-center">
                <Flame className="mx-auto mb-3 text-orange-200" size={40} />
                <div className="text-4xl font-bold text-white font-kids mb-1">{statsData.streak}</div>
                <p className="text-sm font-medium text-orange-100 font-kids">Day Streak</p>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-purple-600 to-purple-800">
              <div className="text-center">
                <Star className="mx-auto mb-3 text-purple-200" size={40} />
                <div className="text-4xl font-bold text-white font-kids mb-1">{statsData.masteryLevel}</div>
                <p className="text-sm font-medium text-purple-100 font-kids">Mastery Level</p>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-yellow-600 to-yellow-800">
              <div className="text-center">
                <Trophy className="mx-auto mb-3 text-yellow-200" size={40} />
                <div className="text-4xl font-bold text-white font-kids mb-1">{statsData.achievements}</div>
                <p className="text-sm font-medium text-yellow-100 font-kids">Achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6 font-kids">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`card p-6 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-spotify-600 to-spotify-800'
                    : 'opacity-50'
                }`}
              >
                <div className="mb-3">
                  <EmojiImage emoji={achievement.icon} size="56" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 font-kids">
                  {achievement.name}
                </h3>
                <p className="text-sm text-light-300 font-kids">
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-3 text-spotify-500 font-bold text-sm font-kids">
                    ✓ Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6 font-kids">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="mb-4">
                <BookOpen className="mx-auto text-light-400" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-kids">
                No activity yet
              </h3>
              <p className="text-light-300 mb-6 font-kids">
                Start learning to see your progress here!
              </p>
              <Link to="/learn/new" className="btn-primary inline-block font-kids">
                Start Learning
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      <EmojiImage emoji={activity.icon} size="40" />
                    </div>
                    <div>
                      <p className="text-white font-bold font-kids">{activity.title}</p>
                      <p className="text-light-300 text-sm font-kids">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-light-400 text-sm font-kids">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
