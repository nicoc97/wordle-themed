import { PrismaClient } from "@prisma/client";

/**
 * Seeds the database with dictionary words using batch processing
 * 
 * This seeder processes large word lists efficiently by:
 * - Inserting words in batches of 1000 (prevents memory issues)
 * - Using createMany with skipDuplicates (handles conflicts gracefully)
 * - Showing progress updates during long operations
 * 
 * The batch processing is crucial for large datasets - inserting 20k words
 * one-by-one would be extremely slow.
 * 
 * @param prisma - Database client instance
 * @param words - Array of words to insert into dictionary table
 * @returns Promise<number> - Number of words actually inserted
 */
export async function seedDictionary(prisma: PrismaClient, words: string[]) {
    console.log(`Seeding dictionary with ${words.length} words...`);
    
    const batchSize = 1000; // Process 1000 words at a time for optimal performance
    let inserted = 0;
    
    // Process words in batches to avoid memory issues with large datasets
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const result = await prisma.dictionary.createMany({
        data: batch.map(word => ({ word })), // Transform strings to objects
        skipDuplicates: true // Ignore words that already exist
      });
      inserted += result.count;
      
      const progress = Math.min(i + batchSize, words.length);
      const percentage = Math.round((progress / words.length) * 100);
      console.log(`Progress: ${progress}/${words.length} (${percentage}%) - Inserted: ${inserted}`);
    }
    
    return inserted;
  }