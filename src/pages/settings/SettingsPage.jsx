import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { AGE_LEVELS } from '../../data/vocabulary';
import { ChevronLeft, User, Volume2, Palette, RefreshCw, LogOut, Camera, Edit2, Cake } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const SettingsPage = () => {
  const { currentChild } = useChild();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentChild?.name || 'Little Friend',
    avatar: null, // Will store uploaded image URL
    avatarEmoji: AGE_LEVELS[currentChild?.age_level?.toUpperCase()]?.icon || '🌟',
    birthday: '',
    gender: '',
    ageLevel: currentChild?.age_level || 'age_1', // Add age level to profile data
  });

  // Available avatar emojis
  const avatarEmojis = ['😊', '😄', '🥰', '😎', '🤗', '🌟', '🎨', '🚀', '🦄', '🐻', '🐱', '🐶', '🦊', '🐼', '🦁', '🐯'];

  // Settings state
  const [settings, setSettings] = useState({
    sound: true,
    autoPlay: true,
    animations: true,
    dailyGoal: 10,
  });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result, avatarEmoji: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectEmoji = (emoji) => {
    setProfileData({ ...profileData, avatarEmoji: emoji, avatar: null });
  };

  const handleEditProfile = () => {
    // Initialize profileData with current values when entering edit mode
    setProfileData({
      name: currentChild?.name || 'Little Friend',
      avatar: null,
      avatarEmoji: AGE_LEVELS[currentChild?.age_level?.toUpperCase()]?.icon || '🌟',
      birthday: localStorage.getItem('childBirthday') || '',
      gender: localStorage.getItem('childGender') || '',
      ageLevel: currentChild?.age_level || 'age_1',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setProfileData({
      name: currentChild?.name || 'Little Friend',
      avatar: null,
      avatarEmoji: AGE_LEVELS[currentChild?.age_level?.toUpperCase()]?.icon || '🌟',
      birthday: localStorage.getItem('childBirthday') || '',
      gender: localStorage.getItem('childGender') || '',
      ageLevel: currentChild?.age_level || 'age_1',
    });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    // Save to localStorage and context
    localStorage.setItem('childName', profileData.name);
    localStorage.setItem('childAvatar', profileData.avatar || '');
    localStorage.setItem('childAvatarEmoji', profileData.avatarEmoji || '');
    localStorage.setItem('childBirthday', profileData.birthday || '');
    localStorage.setItem('childGender', profileData.gender || '');

    // Save age level if changed
    if (profileData.ageLevel !== currentChild?.age_level) {
      localStorage.setItem('selectedAge', profileData.ageLevel);
      // Trigger storage event to update ChildContext
      window.dispatchEvent(new Event('storage'));
    }

    setIsEditingProfile(false);
    alert('Profile saved successfully! Page will reload to apply changes.');
    // Reload to apply age level changes
    if (profileData.ageLevel !== currentChild?.age_level) {
      window.location.reload();
    }
  };

  const handleAgeLevelChange = (newAgeLevel) => {
    // Only update profileData, don't navigate away
    setProfileData({ ...profileData, ageLevel: newAgeLevel });
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      // Clear progress data
      // In real app, this would clear from database
      alert('Progress reset! (This is a demo - no data was actually deleted)');
    }
  };

  const handleLogout = () => {
    // Clear local storage and return to age selection
    localStorage.removeItem('selectedAge');
    window.location.href = '/age-selection';
  };

  return (
    <div className="min-h-screen p-6 bg-dark-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-light-300 hover:text-white transition-colors font-kids mr-4"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold text-white font-kids">Settings</h1>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-kids flex items-center">
            <User className="mr-2 text-spotify-500" size={28} />
            Profile
          </h2>
          <div className="card p-6">
            {!isEditingProfile ? (
              <>
                {/* View Mode */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {/* Avatar Display */}
                    <div className="relative">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-spotify-500"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-spotify-500 flex items-center justify-center">
                          <EmojiImage emoji={profileData.avatarEmoji} size="48" />
                        </div>
                      )}
                    </div>

                    {/* Name and Info */}
                    <div>
                      <p className="text-white text-2xl font-bold font-kids mb-1">
                        {profileData.name}
                      </p>
                      {profileData.birthday && (
                        <p className="text-light-300 text-sm font-kids flex items-center">
                          <Cake size={14} className="mr-1" />
                          {profileData.birthday}
                        </p>
                      )}
                      {profileData.gender && (
                        <p className="text-light-300 text-sm font-kids">
                          {profileData.gender === 'boy' ? '👦 Boy' : '👧 Girl'}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleEditProfile}
                    className="bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-4 py-2 rounded-full font-bold font-kids transition-all flex items-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-6">
                  {/* Avatar Selection */}
                  <div>
                    <p className="text-white font-bold mb-3 font-kids">Avatar</p>
                    <div className="flex items-center space-x-4 mb-4">
                      {/* Current Avatar */}
                      <div className="relative">
                        {profileData.avatar ? (
                          <img
                            src={profileData.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-spotify-500"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-spotify-500 flex items-center justify-center">
                            <EmojiImage emoji={profileData.avatarEmoji} size="56" />
                          </div>
                        )}
                        {/* Upload Button */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-dark-900 border-2 border-spotify-500 rounded-full p-2 hover:bg-dark-800 transition-all"
                        >
                          <Camera size={16} className="text-spotify-500" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-light-300 text-sm mb-2 font-kids">Or choose an emoji:</p>
                        <div className="grid grid-cols-8 gap-2">
                          {avatarEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleSelectEmoji(emoji)}
                              className={`p-2 rounded-lg transition-all ${
                                profileData.avatarEmoji === emoji && !profileData.avatar
                                  ? 'bg-spotify-500 scale-110'
                                  : 'bg-dark-700 hover:bg-dark-600'
                              }`}
                            >
                              <EmojiImage emoji={emoji} size="24" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-white font-bold mb-2 block font-kids">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter child's name"
                      className="w-full bg-dark-700 text-white px-4 py-3 rounded-xl border-2 border-dark-600 focus:border-spotify-500 outline-none font-kids placeholder-light-400"
                      style={{ color: '#ffffff', backgroundColor: '#1f1f1f' }}
                    />
                  </div>

                  {/* Birthday Input */}
                  <div>
                    <label className="text-white font-bold mb-2 block font-kids">Birthday (Optional)</label>
                    <input
                      type="text"
                      value={profileData.birthday}
                      onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                      placeholder="YYYY-MM-DD (e.g., 2020-05-15)"
                      className="w-full bg-dark-700 text-white px-4 py-3 rounded-xl border-2 border-dark-600 focus:border-spotify-500 outline-none font-kids placeholder-light-400"
                      style={{ color: '#ffffff', backgroundColor: '#1f1f1f' }}
                    />
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="text-white font-bold mb-2 block font-kids">Gender (Optional)</label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setProfileData({ ...profileData, gender: 'boy' })}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all font-kids ${
                          profileData.gender === 'boy'
                            ? 'border-spotify-500 bg-dark-700'
                            : 'border-dark-700 bg-dark-800 hover:border-spotify-500'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-1">👦</div>
                          <p className="text-white font-bold">Boy</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setProfileData({ ...profileData, gender: 'girl' })}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all font-kids ${
                          profileData.gender === 'girl'
                            ? 'border-spotify-500 bg-dark-700'
                            : 'border-dark-700 bg-dark-800 hover:border-spotify-500'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-1">👧</div>
                          <p className="text-white font-bold">Girl</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-6 py-3 rounded-xl font-bold font-kids transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-xl font-bold font-kids transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Age Level Section - Conditional Based on Edit Mode */}
            <div className="border-t border-dark-700 pt-6 mt-6">
              <p className="text-light-300 text-sm mb-3 font-kids">
                Age Level {isEditingProfile && <span className="text-spotify-500">(Click to change)</span>}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(AGE_LEVELS).map((level) => {
                  const currentAgeLevel = isEditingProfile ? profileData.ageLevel : currentChild?.age_level;
                  const isSelected = currentAgeLevel === level.id;

                  return (
                    <button
                      key={level.id}
                      onClick={() => isEditingProfile && handleAgeLevelChange(level.id)}
                      disabled={!isEditingProfile}
                      className={`p-4 rounded-xl transition-all border-2 ${
                        isSelected
                          ? 'border-spotify-500 bg-dark-700 ring-2 ring-spotify-500'
                          : 'border-dark-700 bg-dark-800'
                      } ${
                        isEditingProfile
                          ? 'hover:border-spotify-500 cursor-pointer'
                          : 'cursor-default opacity-75'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-2">
                          <EmojiImage emoji={level.icon} size="40" />
                        </div>
                        <p className="text-white font-bold text-sm font-kids">
                          {level.name}
                          {isSelected && <span className="text-spotify-500 ml-1">✓</span>}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-kids flex items-center">
            <Volume2 className="mr-2 text-spotify-500" size={28} />
            Audio
          </h2>
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold font-kids">Sound Effects</p>
                <p className="text-light-300 text-sm font-kids">Play sounds during learning</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, sound: !settings.sound })}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.sound ? 'bg-spotify-500' : 'bg-dark-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.sound ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-dark-700 pt-4">
              <div>
                <p className="text-white font-bold font-kids">Auto-play Pronunciation</p>
                <p className="text-light-300 text-sm font-kids">Automatically play word sounds</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoPlay: !settings.autoPlay })}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.autoPlay ? 'bg-spotify-500' : 'bg-dark-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.autoPlay ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-kids flex items-center">
            <Palette className="mr-2 text-spotify-500" size={28} />
            Display
          </h2>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold font-kids">Animations</p>
                <p className="text-light-300 text-sm font-kids">Enable fun animations</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, animations: !settings.animations })}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.animations ? 'bg-spotify-500' : 'bg-dark-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.animations ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Learning Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-kids flex items-center">
            <RefreshCw className="mr-2 text-spotify-500" size={28} />
            Learning
          </h2>
          <div className="card p-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold font-kids">Daily Goal</p>
                <span className="text-spotify-500 font-bold text-xl font-kids">
                  {settings.dailyGoal} words
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={settings.dailyGoal}
                onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-spotify-500"
              />
              <div className="flex justify-between text-light-400 text-xs mt-2 font-kids">
                <span>5</span>
                <span>50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4 font-kids">Danger Zone</h2>
          <div className="card p-6 space-y-4 border-2 border-red-500">
            <button
              onClick={handleResetProgress}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold font-kids transition-all"
            >
              Reset All Progress
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-dark-700 hover:bg-dark-600 text-white px-6 py-4 rounded-xl font-bold font-kids transition-all flex items-center justify-center space-x-2"
            >
              <LogOut size={20} />
              <span>Switch Child / Logout</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-light-400 text-sm font-kids pb-8">
          <p>Kids English Learning v1.0.0</p>
          <p className="mt-2">Made with ❤️ for young learners</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
