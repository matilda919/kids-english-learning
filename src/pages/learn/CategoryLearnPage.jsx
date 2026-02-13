import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import { SAMPLE_WORDS, WORD_CATEGORIES } from '../../data/vocabulary';
import { ChevronLeft, Play } from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const CategoryLearnPage = () => {
  const { categoryId } = useParams();
  const { currentChild } = useChild();
  const navigate = useNavigate();

  // Get category info
  const category = Object.values(WORD_CATEGORIES).find(cat => cat.id === categoryId);

  // Filter words by category only (no age restriction for category browsing)
  const categoryWords = SAMPLE_WORDS.filter(
    word => word.category === categoryId
  );

  // Group words by subcategory
  const wordsBySubcategory = categoryWords.reduce((acc, word) => {
    const sub = word.subcategory || 'Other';
    if (!acc[sub]) {
      acc[sub] = [];
    }
    acc[sub].push(word);
    return acc;
  }, {});

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-kids">Category not found</h2>
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
    <div className="min-h-screen p-6 bg-dark-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-light-300 hover:text-white transition-colors font-kids"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
        </div>

        {/* Category Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 animate-pop">
            <EmojiImage emoji={category.icon} size="96" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 font-kids">
            {category.name}
          </h1>
          <p className="text-xl text-light-300 font-kids">
            {categoryWords.length} words to learn
          </p>
        </div>

        {/* No words message */}
        {categoryWords.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <EmojiImage emoji="📚" size="80" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-kids">
              No words available yet
            </h3>
            <p className="text-light-300 mb-6 font-kids">
              Words for this category will be added soon!
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary font-kids"
            >
              Go Home
            </button>
          </div>
        ) : (
          <>
            {/* Quick Start Button */}
            <div className="mb-12 text-center">
              <Link
                to={`/learn/category/${categoryId}/start`}
                className="btn-primary inline-flex items-center space-x-3 text-xl px-8 py-4 font-kids"
              >
                <Play size={28} />
                <span>Start Learning</span>
              </Link>
            </div>

            {/* Words grouped by subcategory */}
            {Object.entries(wordsBySubcategory).map(([subcategory, words]) => (
              <div key={subcategory} className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-kids">
                  {subcategory}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {words.map((word, index) => (
                    <div
                      key={word.id}
                      className="card hover:scale-105 transition-all cursor-pointer p-6 text-center animate-pop"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => navigate(`/learn/category/${categoryId}/start`, {
                        state: { startWordId: word.id }
                      })}
                    >
                      {/* Word Icon or Image */}
                      <div className="mb-4">
                        {word.imageUrl ? (
                          <div className="relative inline-block">
                            {/* White background for better visibility */}
                            <div className="bg-white rounded-xl p-2 inline-block">
                              <img
                                src={word.imageUrl}
                                alt={word.word}
                                className="w-16 h-16 object-contain mx-auto"
                                onError={(e) => {
                                  // Fallback to emoji if image fails to load
                                  e.target.closest('.bg-white').style.display = 'none';
                                  e.target.closest('.relative').nextElementSibling.style.display = 'block';
                                }}
                              />
                            </div>
                            {/* Fallback emoji container */}
                            <div style={{ display: 'none' }}>
                              <EmojiImage emoji={word.icon || '📷'} size="72" />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl p-2 inline-block">
                            <EmojiImage emoji={word.icon || '📷'} size="72" />
                          </div>
                        )}
                      </div>

                      {/* Word */}
                      <h3 className="text-2xl font-bold text-white mb-2 font-kids">
                        {word.word}
                      </h3>

                      {/* Translation */}
                      <p className="text-light-300 text-sm font-kids">
                        {word.translation}
                      </p>

                      {/* Phonetic */}
                      <p className="text-light-400 text-xs mt-2 font-kids">
                        {word.phonetic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryLearnPage;
