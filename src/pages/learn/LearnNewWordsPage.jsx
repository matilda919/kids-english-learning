import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { SAMPLE_WORDS, AGE_LEVELS } from '../../data/vocabulary';
import { Volume2, ChevronLeft, ChevronRight, Check, X, Home } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';
import { markWordLearned, getLearnedWords } from '../../services/progressService';

const LearnNewWordsPage = () => {
  const { currentChild } = useChild();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter words by age level and shuffle
  const ageLevel = currentChild?.age_level || 'age_1';

  useEffect(() => {
    const availableWords = SAMPLE_WORDS.filter(word => word.ageLevel === ageLevel);
    const shuffled = shuffleArray(availableWords);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);

    // Load already learned words from progressService
    const learned = getLearnedWords();
    const learnedIds = Object.keys(learned);
    setLearnedWords(learnedIds);
  }, [ageLevel]);

  const currentWord = shuffledWords[currentIndex];

  // Text-to-Speech function with American female voice
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch for friendly sound

      // Try to get available voices and select an American female voice
      const voices = window.speechSynthesis.getVoices();

      // Prefer American English female voices
      const preferredVoices = [
        'Samantha', // macOS - American female
        'Google US English Female', // Chrome
        'Microsoft Zira Desktop', // Windows US female
        'Microsoft Aria Online', // Windows US female
        'Karen', // macOS - Australian but close
        'Alex', // macOS - male but American (fallback)
      ];

      // First priority: Find US English female voice
      let selectedVoice = voices.find(voice =>
        voice.lang === 'en-US' &&
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('aria'))
      );

      // Second priority: Find any en-US voice from preferred list
      if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
          voice.lang === 'en-US' &&
          preferredVoices.some(name => voice.name.includes(name))
        );
      }

      // Third priority: Any en-US female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
          voice.lang === 'en-US' &&
          voice.name.toLowerCase().includes('female')
        );
      }

      // Fourth priority: Any en-US voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'en-US');
      }

      // Final fallback: Any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  // Load voices when they become available
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle next word
  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  // Handle previous word
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // Mark word as learned
  const handleMarkLearned = () => {
    if (!learnedWords.includes(currentWord.id)) {
      // Save to progressService
      markWordLearned(currentWord.id);
      setLearnedWords([...learnedWords, currentWord.id]);
    }
    handleNext();
  };

  // Skip word
  const handleSkip = () => {
    handleNext();
  };

  // Stop learning and return home
  const handleStopLearning = () => {
    navigate('/');
  };

  // Auto-play pronunciation when card appears
  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentWord && !isFlipped) {
      const timer = setTimeout(() => {
        speakWord(currentWord.word);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isFlipped]);

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-kids">No words available</h2>
          <p className="text-light-300 mb-6 font-kids">Check back later for new words!</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary font-kids"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-dark-900 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-light-300 hover:text-white transition-colors font-kids"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white font-kids">Learn New Words</h1>
            <p className="text-light-300 font-kids">
              {currentIndex + 1} / {shuffledWords.length}
            </p>
          </div>
          <button
            onClick={handleStopLearning}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors font-kids"
          >
            <Home size={20} />
            <span>Stop</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-spotify-500 transition-all duration-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / shuffledWords.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Word Card */}
        <div className="mb-8 perspective-1000">
          <div
            className={`card-flip ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            {/* Front Side */}
            <div className="card-face card-front bg-gradient-to-br from-spotify-700 to-spotify-900 rounded-2xl p-4 sm:p-8 cursor-pointer relative flex items-center justify-center">
              {/* Learned Badge */}
              {learnedWords.includes(currentWord.id) && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold font-kids flex items-center space-x-1 text-xs sm:text-base">
                  <Check size={14} />
                  <span>Learned</span>
                </div>
              )}
              <div className="text-center w-full">
                {/* Word Image - Mixed Display: Real Image + Emoji */}
                <div className="mb-4 sm:mb-6">
                  {currentWord.imageUrl ? (
                    <div className="relative inline-block">
                      {/* Real Image */}
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={currentWord.imageUrl}
                          alt={currentWord.word}
                          className="w-40 h-40 sm:w-64 sm:h-64 object-cover"
                        />
                      </div>
                      {/* Emoji Badge */}
                      <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white rounded-full p-2 sm:p-3 shadow-lg border-2 sm:border-4 border-spotify-700">
                        <EmojiImage emoji={currentWord.icon || '📷'} size="32" />
                      </div>
                    </div>
                  ) : (
                    /* Only Emoji if no image */
                    <div className="bg-white rounded-xl p-4 sm:p-6 inline-block">
                      <EmojiImage emoji={currentWord.icon || '📷'} size="80 sm:[120px]" />
                    </div>
                  )}
                </div>

                {/* Word */}
                <h2 className="text-4xl sm:text-6xl font-bold text-white mb-2 sm:mb-4 font-kids">
                  {currentWord.word}
                </h2>

                {/* Pronunciation Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.word);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 mx-auto transition-all font-kids text-sm sm:text-base"
                >
                  <Volume2 size={20} />
                  <span>Listen</span>
                </button>

                <p className="text-spotify-200 mt-4 sm:mt-6 font-kids text-xs sm:text-base">Tap to see more</p>
              </div>
            </div>

            {/* Back Side */}
            <div className="card-face card-back bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-4 sm:p-8 cursor-pointer flex items-center justify-center overflow-y-auto">
              <div className="text-center w-full max-h-full py-2 sm:py-4">
                <h2 className="text-3xl sm:text-5xl font-bold text-white mb-1 sm:mb-2 font-kids">
                  {currentWord.word}
                </h2>

                {/* Phonetic */}
                <p className="text-lg sm:text-2xl text-orange-100 mb-4 sm:mb-6 font-kids">
                  {currentWord.phonetic}
                </p>

                {/* Translation */}
                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-base sm:text-xl text-white font-kids">
                    {currentWord.translation}
                  </p>
                </div>

                {/* Definition */}
                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-sm sm:text-base text-white font-kids">
                    {currentWord.definition}
                  </p>
                </div>

                {/* Example */}
                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-sm sm:text-base text-white italic font-kids mb-1 sm:mb-2">
                    "{currentWord.example}"
                  </p>
                  <p className="text-orange-100 text-xs sm:text-sm font-kids">
                    {currentWord.exampleTranslation}
                  </p>
                </div>

                {/* Example Pronunciation Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.example);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full flex items-center space-x-2 mx-auto transition-all font-kids mb-2 sm:mb-4 text-xs sm:text-base"
                >
                  <Volume2 size={16} />
                  <span>Listen</span>
                </button>

                <p className="text-orange-100 mt-1 sm:mt-2 font-kids text-xs sm:text-base">Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handleSkip}
            className="bg-dark-700 hover:bg-dark-600 text-white px-8 py-4 rounded-full flex items-center space-x-2 transition-all font-kids"
          >
            <X size={24} />
            <span>Skip</span>
          </button>
          <button
            onClick={handleMarkLearned}
            className="bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-8 py-4 rounded-full flex items-center space-x-2 transition-all font-bold font-kids"
          >
            <Check size={24} />
            <span>Got It!</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all font-kids ${
              currentIndex === 0
                ? 'bg-dark-700 text-light-400 cursor-not-allowed'
                : 'bg-dark-700 hover:bg-dark-600 text-white'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <p className="text-light-300 font-kids">
              {learnedWords.length} words learned
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledWords.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all font-kids ${
              currentIndex === shuffledWords.length - 1
                ? 'bg-dark-700 text-light-400 cursor-not-allowed'
                : 'bg-dark-700 hover:bg-dark-600 text-white'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnNewWordsPage;
