/**
 * Prompts user for confirmation before reseeding the database
 * 
 * This utility handles user interaction via command line interface.
 * It's extracted from the main seed logic to:
 * - Keep the main function focused on orchestration
 * - Make the prompt logic reusable
 * - Make it easier to test (could mock this function)
 * 
 * The readline interface is properly closed after getting the answer
 * to prevent the process from hanging.
 * 
 * @param existingCount - Current number of words in database
 * @param threshold - The threshold that triggered this prompt
 * @returns Promise<boolean> - true if user wants to proceed with reseeding
 */
export async function confirmReseed(existingCount: number, threshold: number): Promise<boolean> {
    console.log(`⚠️  Dictionary contains ${existingCount} words (threshold: ${threshold})`);
    console.log('This suggests the database may need cleaning up.');
    
    // Create readline interface for command line input
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Wrap readline.question in a Promise for async/await usage
    const answer = await new Promise<string>(resolve => {
      readline.question('Clear and reseed? (y/N): ', resolve);
    });
    readline.close(); // Important: close interface to prevent hanging
    
    return answer.toLowerCase() === 'y';
  }
  