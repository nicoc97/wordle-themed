/**
 * Static theme data for word puzzle games
 * 
 * Each theme contains:
 * - name: Display name for the theme
 * - category: Grouping category (Home, Nature, etc.)
 * - difficulty: Game difficulty level (easy, medium, hard)
 * - words: Array of words with their lengths for this theme
 * 
 * This data is separated from logic to make it easy to:
 * - Add new themes without touching code
 * - Reuse themes in other parts of the app
 * - Test with different theme sets
 */
export const themes = [
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