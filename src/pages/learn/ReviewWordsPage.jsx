import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { SAMPLE_WORDS } from '../../data/vocabulary';
import { getWordsForReview, markWordLearned, addLearningTime } from '../../services/progressService';
import { Volume2, ChevronLeft, Check, X, RotateCcw, Trophy, Home } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const ReviewWordsPage = () => {
  const navigate = useNavigate();
  const { currentChild } = useChild();

  const [reviewWords, setReviewWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedWords, setReviewedWords] = useState([]);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Load words that need review
    const wordsForReview = getWordsForReview();

    // Get full word data
    const fullWords = wordsForReview.map(reviewData => {
      const word = SAMPLE_WORDS.find(w => w.id === reviewData.wordId);
      return {
        ...word,
        reviewData
      };
    }).filter(w => w.id); // Filter out words not found

    setReviewWords(fullWords);

    if (fullWords.length === 0) {
      setIsCompleted(true);
    }

    // Track learning time on unmount
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 60000);
      if (timeSpent > 0) {
        addLearningTime(timeSpent);
      }
    };
  }, [startTime]);

  const currentWord = reviewWords[currentIndex];

  // Text-to-Speech function
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

  // Load voices
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
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // All words reviewed
      setIsCompleted(true);
    }
  };

  // Mark as remembered
  const handleRemembered = () => {
    markWordLearned(currentWord.id);
    setReviewedWords([...reviewedWords, { ...currentWord, remembered: true }]);
    handleNext();
  };

  // Mark as forgotten
  const handleForgotten = () => {
    setReviewedWords([...reviewedWords, { ...currentWord, remembered: false }]);
    handleNext();
  };

  // Auto-play pronunciation
  useEffect(() => {
    if (currentWord && !isFlipped) {
      const timer = setTimeout(() => {
        speakWord(currentWord.word);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isFlipped]);

  // Completion screen
  if (isCompleted) {
    const rememberedCount = reviewedWords.filter(w => w.remembered).length;
    const totalReviewed = reviewedWords.length;
    const accuracy = totalReviewed > 0 ? Math.round((rememberedCount / totalReviewed) * 100) : 0;

    return (
      <div className="min-h-screen p-6 bg-dark-900">
        <div className="max-w-2xl mx-auto">
          {totalReviewed === 0 ? (
            // No words to review
            <div className="text-center py-20">
              <div className="mb-6">
                <Trophy className="mx-auto text-spotify-500" size={120} />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 font-kids">
                All Caught Up!
              </h1>
              <p className="text-2xl text-light-300 mb-8 font-kids">
                No words need review right now.
              </p>
              <p className="text-light-400 mb-8 font-kids">
                Come back later or learn new words to practice!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/learn/new')}
                  className="bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-8 py-4 rounded-full font-bold font-kids transition-all"
                >
                  Learn New Words
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-8 py-4 rounded-full font-bold font-kids transition-all"
                >
                  Go Home
                </button>
              </div>
            </div>
          ) : (
            // Review completed
            <div className="text-center py-20">
              <div className="mb-6">
                <Trophy className="mx-auto text-spotify-500 animate-bounce" size={120} />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 font-kids">
                Review Complete!
              </h1>
              <p className="text-2xl text-light-300 mb-8 font-kids">
                Great job reviewing!
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                <div className="card p-6 bg-gradient-to-br from-spotify-600 to-spotify-800">
                  <div className="text-4xl font-bold text-white font-kids mb-2">
                    {totalReviewed}
                  </div>
                  <div className="text-spotify-100 font-kids">Words Reviewed</div>
                </div>
                <div className="card p-6 bg-gradient-to-br from-green-600 to-green-800">
                  <div className="text-4xl font-bold text-white font-kids mb-2">
                    {accuracy}%
                  </div>
                  <div className="text-green-100 font-kids">Accuracy</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-8 py-4 rounded-full font-bold font-kids transition-all"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-8 py-4 rounded-full font-bold font-kids transition-all flex items-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Review Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
        <div className="text-center">
          <p className="text-white text-xl font-kids">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-dark-900">
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
            <h1 className="text-3xl font-bold text-white font-kids mb-2">Review Words</h1>
            <p className="text-light-300 font-kids">
              {currentIndex + 1} / {reviewWords.length}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
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
              style={{ width: `${((currentIndex + 1) / reviewWords.length) * 100}%` }}
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
            <div className="card-face card-front bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-8 cursor-pointer flex items-center justify-center">
              <div className="text-center w-full">
                {/* Word Image - Mixed Display: Real Image + Emoji */}
                <div className="mb-6">
                  {currentWord.imageUrl ? (
                    <div className="relative inline-block">
                      {/* Real Image */}
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={currentWord.imageUrl}
                          alt={currentWord.word}
                          className="w-64 h-64 object-cover"
                        />
                      </div>
                      {/* Emoji Badge */}
                      <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg border-4 border-purple-700">
                        <EmojiImage emoji={currentWord.icon || '📷'} size="48" />
                      </div>
                    </div>
                  ) : (
                    /* Only Emoji if no image */
                    <div className="bg-white rounded-xl p-6 inline-block">
                      <EmojiImage emoji={currentWord.icon || '📷'} size="120" />
                    </div>
                  )}
                </div>

                <h2 className="text-6xl font-bold text-white mb-4 font-kids">
                  {currentWord.word}
                </h2>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.word);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-full flex items-center space-x-2 mx-auto transition-all font-kids"
                >
                  <Volume2 size={24} />
                  <span>Listen</span>
                </button>

                <p className="text-purple-200 mt-6 font-kids">Do you remember this word?</p>
              </div>
            </div>

            {/* Back Side */}
            <div className="card-face card-back bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-8 cursor-pointer flex items-center justify-center overflow-y-auto">
              <div className="text-center w-full max-h-full py-4">
                <h2 className="text-5xl font-bold text-white mb-2 font-kids">
                  {currentWord.word}
                </h2>

                <p className="text-2xl text-orange-100 mb-6 font-kids">
                  {currentWord.phonetic}
                </p>

                <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
                  <p className="text-xl text-white font-kids">
                    {currentWord.translation}
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
                  <p className="text-white font-kids">
                    {currentWord.definition}
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
                  <p className="text-white italic font-kids mb-2">
                    "{currentWord.example}"
                  </p>
                  <p className="text-orange-100 text-sm font-kids">
                    {currentWord.exampleTranslation}
                  </p>
                </div>

                <p className="text-orange-100 mt-2 font-kids">Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={handleForgotten}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full flex items-center space-x-2 transition-all font-kids"
          >
            <X size={24} />
            <span>Forgot</span>
          </button>
          <button
            onClick={handleRemembered}
            className="bg-spotify-500 hover:bg-spotify-600 text-dark-900 px-8 py-4 rounded-full flex items-center space-x-2 transition-all font-bold font-kids"
          >
            <Check size={24} />
            <span>Remember!</span>
          </button>
        </div>

        <p className="text-center text-light-400 text-sm font-kids">
          Review count: {currentWord.reviewData?.reviewCount || 0} times
        </p>
      </div>
    </div>
  );
};

export default ReviewWordsPage;
