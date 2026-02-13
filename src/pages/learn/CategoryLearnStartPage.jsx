import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { SAMPLE_WORDS, WORD_CATEGORIES } from '../../data/vocabulary';
import { markWordLearned, addLearningTime } from '../../services/progressService';
import { Volume2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const CategoryLearnStartPage = () => {
  const { categoryId } = useParams();
  const { currentChild } = useChild();
  const navigate = useNavigate();
  const location = useLocation();
  const startWordId = location.state?.startWordId;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [startTime] = useState(Date.now());

  // Get category info
  const category = Object.values(WORD_CATEGORIES).find(cat => cat.id === categoryId);

  // Filter words by category only (no age restriction for category learning)
  const availableWords = SAMPLE_WORDS.filter(
    word => word.category === categoryId
  );

  // Set initial index if starting from a specific word
  useEffect(() => {
    if (startWordId) {
      const index = availableWords.findIndex(word => word.id === startWordId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }

    // Track learning time on unmount
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 60000);
      if (timeSpent > 0) {
        addLearningTime(timeSpent);
      }
    };
  }, [startWordId, availableWords, startTime]);

  const currentWord = availableWords[currentIndex];

  // Text-to-Speech function with American female voice
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice =>
        voice.lang === 'en-US' &&
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('aria'))
      );

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'en-US');
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Load voices when they become available
  useEffect(() => {
    if ('speechSynthesis' in window) {
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
    if (currentIndex < availableWords.length - 1) {
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
      setLearnedWords([...learnedWords, currentWord.id]);
      markWordLearned(currentWord.id);
    }
    handleNext();
  };

  // Skip word
  const handleSkip = () => {
    handleNext();
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

  if (!currentWord || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-kids">No words available</h2>
          <p className="text-light-300 mb-6 font-kids">Check back later for new words!</p>
          <button
            onClick={() => navigate(`/learn/category/${categoryId}`)}
            className="btn-primary font-kids"
          >
            Back to Category
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
            onClick={() => navigate(`/learn/category/${categoryId}`)}
            className="flex items-center space-x-2 text-light-300 hover:text-white transition-colors font-kids"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <div className="text-center">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <EmojiImage emoji={category.icon} size="32" />
              <h1 className="text-3xl font-bold text-white font-kids">{category.name}</h1>
            </div>
            <p className="text-light-300 font-kids">
              {currentIndex + 1} / {availableWords.length}
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-spotify-500 transition-all duration-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / availableWords.length) * 100}%` }}
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
            <div className="card-face card-front bg-gradient-to-br from-spotify-700 to-spotify-900 rounded-2xl p-4 sm:p-8 cursor-pointer">
              <div className="text-center">
                <div className="mb-4 sm:mb-6 bg-white rounded-xl p-4 sm:p-6 inline-block">
                  <EmojiImage emoji={currentWord.icon || '📷'} size="80 sm:[120px]" />
                </div>

                <h2 className="text-4xl sm:text-6xl font-bold text-white mb-2 sm:mb-4 font-kids">
                  {currentWord.word}
                </h2>

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
            <div className="card-face card-back bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-4 sm:p-8 cursor-pointer">
              <div className="text-center">
                <h2 className="text-3xl sm:text-5xl font-bold text-white mb-1 sm:mb-2 font-kids">
                  {currentWord.word}
                </h2>

                <p className="text-lg sm:text-2xl text-orange-100 mb-4 sm:mb-6 font-kids">
                  {currentWord.phonetic}
                </p>

                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-base sm:text-xl text-white font-kids">
                    {currentWord.translation}
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-sm sm:text-base text-white font-kids">
                    {currentWord.definition}
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-sm sm:text-base text-white italic font-kids mb-1 sm:mb-2">
                    "{currentWord.example}"
                  </p>
                  <p className="text-orange-100 text-xs sm:text-sm font-kids">
                    {currentWord.exampleTranslation}
                  </p>
                </div>

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
            disabled={currentIndex === availableWords.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all font-kids ${
              currentIndex === availableWords.length - 1
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

export default CategoryLearnStartPage;
