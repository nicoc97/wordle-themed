import * as path from 'path';
import * as fs from 'fs';
import { WordListOptions, WORD_SOURCES } from '../data/word-sources';

/**
 * Fetches and processes word lists from external sources
 * 
 * This service handles:
 * - HTTP requests to word list APIs
 * - Local file caching (1 week expiration)
 * - Word filtering and processing
 * - Fallback words if download fails
 * 
 * The caching system prevents repeated API calls and makes seeding faster.
 * Words are normalized to uppercase and filtered to only include A-Z characters.
 * 
 * @param options - Configuration for which words to fetch and how to process them
 * @returns Promise<string[]> - Array of processed words ready for database insertion
 */
export async function getWordList(options: WordListOptions = {}): Promise<string[]> {
    const {
        source = 'COMMON_10K',
        minLength = 3,
        maxLength = 12,
        maxWords = 10000,
        useCache = true
    } = options;

    // Check for cached file to avoid repeated downloads
    const cacheDir = path.join(__dirname, '.cache');
    const cacheFile = path.join(cacheDir, `words_${source}.json`);

    if (useCache && fs.existsSync(cacheFile)) {
        console.log('Loading words from cache...');
        try {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            const cacheAge = Date.now() - cached.timestamp;
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // Cache expires after 1 week

            if (cacheAge < oneWeek) {
                console.log(`Loaded ${cached.words.length} words from cache`);
                return cached.words;
            } else {
                console.log('Cache expired, downloading fresh list...');
            }
        } catch (error) {
            console.warn('⚠️  Cache file corrupted, downloading fresh list...');
        }
    }

    // Download fresh word list
    console.log(`📥 Downloading word list from ${source}...`);
    const url = WORD_SOURCES[source];

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        let words = text
            .split('\n')
            .map(word => word.trim().toUpperCase()) // Normalize to uppercase
            .filter(word => word.length >= minLength && word.length <= maxLength) // Length filtering
            .filter(word => /^[A-Z]+$/.test(word)); // Only letters A-Z (no numbers/symbols)

        // Limit number of words if specified
        if (maxWords && words.length > maxWords) {
            words = words.slice(0, maxWords);
        }

        console.log(`Downloaded ${words.length} valid words`);

        // Save to cache
        if (useCache) {
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            fs.writeFileSync(cacheFile, JSON.stringify({
                timestamp: Date.now(),
                source,
                words
            }, null, 2));
            console.log('Saved to cache');
        }

        return words;

    } catch (error) {
        console.error('❌ Failed to download word list:', error);
        console.log('📋 Using fallback word list...');

        // Minimal fallback list in case all downloads fail
        return [
            'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
            'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
            'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE'
        ];
    }
}