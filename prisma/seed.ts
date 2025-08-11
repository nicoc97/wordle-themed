import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const themes = [
  {
    name: "Kitchen Appliances",
    category: "Home",
    difficulty: "easy",
    words: [
      { word: "OVEN", length: 4 },
      { word: "FRIDGE", length: 6 },
      { word: "MICROWAVE", length: 9 }
    ]
  },
  {
    name: "Ocean Creatures",
    category: "Nature",
    difficulty: "medium",
    words: [
      { word: "SHARK", length: 5 },
      { word: "DOLPHIN", length: 7 },
      { word: "JELLYFISH", length: 9 }
    ]
  },
  {
    name: "Musical Instruments",
    category: "Arts",
    difficulty: "medium",
    words: [
      { word: "PIANO", length: 5 },
      { word: "GUITAR", length: 6 },
      { word: "SAXOPHONE", length: 9 }
    ]
  },
  {
    name: "Weather Phenomena",
    category: "Nature",
    difficulty: "hard",
    words: [
      { word: "RAIN", length: 4 },
      { word: "TORNADO", length: 7 },
      { word: "LIGHTNING", length: 9 }
    ]
  },
  {
    name: "Space Objects",
    category: "Science",
    difficulty: "medium",
    words: [
      { word: "MOON", length: 4 },
      { word: "PLANET", length: 6 },
      { word: "ASTEROID", length: 8 }
    ]
  },
  {
    name: "British Cuisine",
    category: "Food",
    difficulty: "easy",
    words: [
      { word: "SCONE", length: 5 },
      { word: "CRUMPET", length: 7 },
      { word: "BANGERS", length: 7 }
    ]
  },
  {
    name: "Garden Tools",
    category: "Garden",
    difficulty: "easy",
    words: [
      { word: "SPADE", length: 5 },
      { word: "TROWEL", length: 6 },
      { word: "SECATEURS", length: 10 }
    ]
  },
  {
    name: "Transportation",
    category: "Travel",
    difficulty: "medium",
    words: [
      { word: "TRAIN", length: 5 },
      { word: "BICYCLE", length: 7 },
      { word: "AEROPLANE", length: 9 }
    ]
  },
  {
    name: "Board Games",
    category: "Entertainment",
    difficulty: "easy",
    words: [
      { word: "CHESS", length: 5 },
      { word: "SCRABBLE", length: 8 },
      { word: "MONOPOLY", length: 8 }
    ]
  },
  {
    name: "Programming Languages",
    category: "Technology",
    difficulty: "hard",
    words: [
      { word: "PYTHON", length: 6 },
      { word: "JAVASCRIPT", length: 10 },
      { word: "TYPESCRIPT", length: 10 }
    ]
  }
];

// Configuration for different word sources
const WORD_SOURCES = {
  // Wordle's actual word lists (best for word games)
  WORDLE_ANSWERS: 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words',
  WORDLE_ALLOWED: 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words-allowed',
  
  // Common English words (good for general use)
  COMMON_10K: 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt',
  
  // Comprehensive dictionary (includes obscure words)
  COMPREHENSIVE: 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
};

interface WordListOptions {
  source?: keyof typeof WORD_SOURCES;
  minLength?: number;
  maxLength?: number;
  maxWords?: number;
  useCache?: boolean;
}

async function getWordList(options: WordListOptions = {}): Promise<string[]> {
  const {
    source = 'COMMON_10K',
    minLength = 3,
    maxLength = 12,
    maxWords = 50000,
    useCache = true
  } = options;

  // Check for cached file
  const cacheDir = path.join(__dirname, '.cache');
  const cacheFile = path.join(cacheDir, `words_${source}.json`);
  
  if (useCache && fs.existsSync(cacheFile)) {
    console.log('Loading words from cache...');
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const cacheAge = Date.now() - cached.timestamp;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
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
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length >= minLength && word.length <= maxLength)
      .filter(word => /^[A-Z]+$/.test(word));
    
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
    
    // Minimal fallback list
    return [
      'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
      'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
      'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE'
    ];
  }
}

async function seedDictionary(words: string[]) {
  console.log(`💾 Seeding dictionary with ${words.length} words...`);
  
  const batchSize = 1000;
  let inserted = 0;
  
  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const result = await prisma.dictionary.createMany({
      data: batch.map(word => ({ word })),
      skipDuplicates: true
    });
    inserted += result.count;
    
    const progress = Math.min(i + batchSize, words.length);
    const percentage = Math.round((progress / words.length) * 100);
    console.log(`Progress: ${progress}/${words.length} (${percentage}%) - Inserted: ${inserted}`);
  }
  
  return inserted;
}

async function main() {
  console.log('Starting seed...');
  console.log('');

  // Optional: Check if already seeded
  const existingCount = await prisma.dictionary.count();
  if (existingCount > 1000) {
    console.log(`ℹ️  Dictionary already contains ${existingCount} words`);
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise<string>(resolve => {
      readline.question('Do you want to reseed? (y/N): ', resolve);
    });
    readline.close();
    
    if (answer.toLowerCase() !== 'y') {
      console.log('Skipping seed. Goodbye!');
      return;
    }
  }

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.word.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.dictionary.deleteMany();

  // Seed themes
  console.log('Seeding themes...');
  for (const themeData of themes) {
    const { words, ...theme } = themeData;
    
    const createdTheme = await prisma.theme.create({
      data: {
        ...theme,
        words: {
          create: words
        }
      },
      include: {
        words: true
      }
    });
    
    console.log(`  ✅ ${createdTheme.name} (${createdTheme.words.length} words)`);
  }

  // Get word list with options
  console.log('');
  const wordList = await getWordList({
    source: 'WORDLE_ANSWERS',
    minLength: 3,
    maxLength: 10,
    maxWords: 20000,      
    useCache: true
  });

  // Seed dictionary
  console.log('');
  const insertedCount = await seedDictionary(wordList);
  
  console.log('');
  console.log('Summary:');
  console.log(`  • Themes created: ${themes.length}`);
  console.log(`  • Theme words: ${themes.reduce((acc, t) => acc + t.words.length, 0)}`);
  console.log(`  • Dictionary words: ${insertedCount}`);
  console.log('');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });