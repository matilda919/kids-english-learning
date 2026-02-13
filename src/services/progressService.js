// Learning progress management service
// Uses localStorage for data persistence

const STORAGE_KEY = 'kids_english_progress';

// Spaced repetition intervals (in days)
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

// Initialize default progress structure
const getDefaultProgress = () => ({
  learnedWords: {}, // { wordId: { learnedDate, reviewCount, nextReviewDate, masteryLevel } }
  todayLearned: [], // Word IDs learned today
  lastActiveDate: new Date().toISOString().split('T')[0],
  statistics: {
    totalWordsLearned: 0,
    streak: 0,
    totalLearningTime: 0, // in minutes
    lastStreakUpdate: new Date().toISOString().split('T')[0]
  }
});

// Load progress from localStorage
export const loadProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultProgress();
    }

    const progress = JSON.parse(data);

    // Update streak if needed
    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.statistics.lastStreakUpdate;

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (lastDate === yesterday) {
        // Continue streak
        progress.statistics.streak += 1;
      } else if (lastDate < yesterday) {
        // Streak broken
        progress.statistics.streak = 0;
      }

      progress.statistics.lastStreakUpdate = today;
      progress.todayLearned = []; // Reset daily learning
      saveProgress(progress);
    }

    return progress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return getDefaultProgress();
  }
};

// Save progress to localStorage
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Mark a word as learned
export const markWordLearned = (wordId) => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];

  if (!progress.learnedWords[wordId]) {
    // First time learning this word
    progress.learnedWords[wordId] = {
      learnedDate: today,
      reviewCount: 0,
      nextReviewDate: getNextReviewDate(0),
      masteryLevel: 1,
      lastReviewDate: null
    };

    progress.statistics.totalWordsLearned += 1;

    // Add to today's learned words if not already there
    if (!progress.todayLearned.includes(wordId)) {
      progress.todayLearned.push(wordId);
    }
  } else {
    // Already learned, update review info
    const wordData = progress.learnedWords[wordId];
    wordData.reviewCount += 1;
    wordData.lastReviewDate = today;
    wordData.nextReviewDate = getNextReviewDate(wordData.reviewCount);
    wordData.masteryLevel = Math.min(5, wordData.reviewCount + 1);
  }

  saveProgress(progress);
  return progress;
};

// Get next review date based on review count
const getNextReviewDate = (reviewCount) => {
  const intervalIndex = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  const daysToAdd = REVIEW_INTERVALS[intervalIndex];

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  return nextDate.toISOString().split('T')[0];
};

// Get words that need review today
export const getWordsForReview = () => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];

  const reviewWords = [];

  Object.entries(progress.learnedWords).forEach(([wordId, data]) => {
    if (data.nextReviewDate <= today) {
      reviewWords.push({
        wordId,
        ...data
      });
    }
  });

  // Sort by next review date (oldest first)
  reviewWords.sort((a, b) =>
    new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
  );

  return reviewWords;
};

// Check if a word has been learned
export const isWordLearned = (wordId) => {
  const progress = loadProgress();
  return !!progress.learnedWords[wordId];
};

// Get mastery level for a word (1-5)
export const getWordMasteryLevel = (wordId) => {
  const progress = loadProgress();
  return progress.learnedWords[wordId]?.masteryLevel || 0;
};

// Get statistics
export const getStatistics = () => {
  const progress = loadProgress();
  const reviewCount = getWordsForReview().length;

  return {
    totalWordsLearned: progress.statistics.totalWordsLearned,
    wordsLearnedToday: progress.todayLearned.length,
    wordsForReview: reviewCount,
    streak: progress.statistics.streak,
    totalLearningTime: progress.statistics.totalLearningTime,
    lastActiveDate: progress.lastActiveDate
  };
};

// Add learning time (in minutes)
export const addLearningTime = (minutes) => {
  const progress = loadProgress();
  progress.statistics.totalLearningTime += minutes;
  progress.lastActiveDate = new Date().toISOString().split('T')[0];
  saveProgress(progress);
};

// Reset all progress (for testing or user request)
export const resetProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultProgress();
};

// Get learned words by category
export const getLearnedWordsByCategory = (categoryId) => {
  const progress = loadProgress();
  const learnedIds = Object.keys(progress.learnedWords);
  return learnedIds;
};

// Get all learned words
export const getLearnedWords = () => {
  const progress = loadProgress();
  return progress.learnedWords;
};

// Export all functions
export default {
  loadProgress,
  saveProgress,
  markWordLearned,
  getWordsForReview,
  isWordLearned,
  getWordMasteryLevel,
  getStatistics,
  addLearningTime,
  resetProgress,
  getLearnedWordsByCategory,
  getLearnedWords
};
