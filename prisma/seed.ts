/**
 * Main database seeding orchestrator
 * 
 * This file coordinates the entire seeding process by:
 * 1. Checking if database already has substantial data
 * 2. Clearing existing data if proceeding
 * 3. Seeding themes with their associated words
 * 4. Fetching and seeding dictionary words from external sources
 * 5. Providing a summary of what was created
 * 
 * The separation of concerns means this file is just orchestration -
 * all the complex logic is handled by specialized services and seeders.
 */

import { PrismaClient } from '@prisma/client';
import { getWordList } from './services/word-fetcher';
import { themes } from './data/themes';
import { seedDictionary } from './seeders/dictionary-seeder';
import { themeSeeder } from './seeders/theme-seeder';
import { confirmReseed } from './utils/user-prompt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  console.log('');

  // Safety check: avoid unnecessary work if database is already populated
  const existingCount = await prisma.dictionary.count();
  const maxWordThreshold = 20000; // Matches the maxWords we're planning to seed
  if (existingCount > maxWordThreshold) {
    const shouldReseed = await confirmReseed(existingCount, maxWordThreshold);
    if (!shouldReseed) {
      console.log('Skipping seed. Goodbye!');
      return;
    }
  }

  // Clear existing data to ensure clean slate
  // Order matters: delete child records (words) before parent records (themes)
  console.log('Clearing existing data...');
  await prisma.word.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.dictionary.deleteMany();

  // Seed themes
  await themeSeeder(prisma, themes);

  // Fetch dictionary words from external source
  console.log('');
  const wordList = await getWordList({
    source: 'WORDLE_ANSWERS', // Use official Wordle word list
    minLength: 3,
    maxLength: 10,
    maxWords: 20000, // Limit to prevent excessive data
    useCache: true // Use local cache to speed up repeated runs
  });

  // Seed dictionary
  console.log('');
  const insertedCount = await seedDictionary(prisma, wordList);
  
  console.log('');
  console.log('Summary:');
  console.log(`  • Themes created: ${themes.length}`);
  console.log(`  • Theme words: ${themes.reduce((acc, t) => acc + t.words.length, 0)}`);
  console.log(`  • Dictionary words: ${insertedCount}`);
  console.log('');
  console.log('Seed completed successfully!');
}

// Execute the main function with proper error handling
main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1); // Exit with error code
  })
  .finally(async () => {
    await prisma.$disconnect(); // Always close database connection
  });