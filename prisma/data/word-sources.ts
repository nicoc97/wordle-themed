/**
 * Configuration for external word list sources
 * 
 * Different sources provide different types of words:
 * - WORDLE_ANSWERS: Official Wordle answer words (best for games)
 * - WORDLE_ALLOWED: All words Wordle accepts as guesses
 * - COMMON_10K: Most common English words (good for general use)
 * - COMPREHENSIVE: Large dictionary including obscure words
 */
export const WORD_SOURCES = {
    // Wordle's actual word lists (best for word games)
    WORDLE_ANSWERS: 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words',
    WORDLE_ALLOWED: 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words-allowed',
    
    // Common English words (good for general use)
    COMMON_10K: 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt',
    
    // Comprehensive dictionary (includes obscure words)
    COMPREHENSIVE: 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
  };

/**
 * Options for configuring word list fetching
 * 
 * @param source - Which word source to use (defaults to COMMON_10K)
 * @param minLength - Minimum word length to include (defaults to 3)
 * @param maxLength - Maximum word length to include (defaults to 12)
 * @param maxWords - Maximum number of words to return (defaults to 50000)
 * @param useCache - Whether to cache results locally (defaults to true)
 */
export interface WordListOptions {
  source?: keyof typeof WORD_SOURCES;
  minLength?: number;
  maxLength?: number;
  maxWords?: number;
  useCache?: boolean;
}