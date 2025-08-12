import { PrismaClient } from "@prisma/client";
import type { themes } from "../data/themes";

/**
 * Seeds the database with themed word collections
 * 
 * This seeder creates Theme records and their associated Word records
 * in a single transaction using Prisma's nested create functionality.
 * 
 * The destructuring `{ words, ...theme }` separates the words array
 * from the theme properties (name, category, difficulty).
 * 
 * @param prisma - Database client instance
 * @param themesData - Array of theme objects with their words
 */
export async function themeSeeder(prisma: PrismaClient, themesData: typeof themes) {
    console.log('Seeding themes...');
    for (const themeData of themesData) {
        // Destructure: words array separate from theme properties
        const { words, ...theme } = themeData;
        
        // Create theme and its words in one database transaction
        const createdTheme = await prisma.theme.create({
        data: {
            ...theme, // Spread theme properties (name, category, difficulty)
            words: {
            create: words // Create associated Word records
            }
        },
        include: {
            words: true // Include created words in the response
        }
        });
        
        console.log(`  ${createdTheme.name} (${createdTheme.words.length} words)`);
    }
}
