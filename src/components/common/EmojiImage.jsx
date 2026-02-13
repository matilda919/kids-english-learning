/**
 * EmojiImage Component
 * Converts emoji characters to Twemoji SVG images
 * Using Twemoji CDN (MIT License)
 */

const EmojiImage = ({ emoji, size = '72', className = '' }) => {
  // Convert emoji to unicode codepoint for Twemoji URL
  const getEmojiCodePoint = (emoji) => {
    if (!emoji) return null;

    // Get the codepoint(s) of the emoji
    const codePoints = [];
    for (const char of emoji) {
      const codePoint = char.codePointAt(0);
      if (codePoint) {
        codePoints.push(codePoint.toString(16));
      }
    }
    return codePoints.join('-');
  };

  const codePoint = getEmojiCodePoint(emoji);

  if (!codePoint) {
    return <span className={className}>{emoji}</span>;
  }

  // Twemoji CDN URL
  const twemojiUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`;

  return (
    <img
      src={twemojiUrl}
      alt={emoji}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback to original emoji if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'inline';
      }}
    />
  );
};

export default EmojiImage;
