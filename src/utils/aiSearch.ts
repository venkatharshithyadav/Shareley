import { Listing } from '../types';

// This is a simulated AI service. In a real production app, 
// this would call OpenAI or Gemini API to analyze the intent.
export const analyzeSearchIntent = (query: string, listings: Listing[]) => {
    const lowerQuery = query.toLowerCase();

    // 1. Extract intent (buy, rent, lend)
    let type: 'sell' | 'rent' | 'lend' | 'free' | undefined;
    if (lowerQuery.includes('rent')) type = 'rent';
    else if (lowerQuery.includes('buy') || lowerQuery.includes('purchase')) type = 'sell';
    else if (lowerQuery.includes('lend') || lowerQuery.includes('borrow')) type = 'lend';
    else if (lowerQuery.includes('free') || lowerQuery.includes('give away')) type = 'free';

    // 2. Extract keywords for semantic matching
    // Remove common stop words to focus on the core request
    const stopWords = ['i', 'want', 'looking', 'for', 'a', 'an', 'the', 'suggest', 'me', 'outfit', 'clothes', 'wear', 'to', 'in', 'at', 'going'];
    const keywords = lowerQuery.split(' ').filter(word => !stopWords.includes(word));

    // 3. Score listings based on relevance
    const scoredListings = listings.map(listing => {
        let score = 0;

        // Exact type match bonus
        if (type && listing.type === type) score += 10;

        // Keyword matching in title and description
        keywords.forEach(keyword => {
            if (listing.title.toLowerCase().includes(keyword)) score += 5;
            if (listing.description.toLowerCase().includes(keyword)) score += 3;
            if (listing.category.toLowerCase().includes(keyword)) score += 5;
            if (listing.location.toLowerCase().includes(keyword)) score += 2;
        });

        // Contextual "AI" logic (Simulated)

        // Halloween logic
        if (lowerQuery.includes('halloween')) {
            if (listing.title.toLowerCase().includes('black') ||
                listing.description.toLowerCase().includes('costume') ||
                listing.category.toLowerCase().includes('boots') ||
                listing.title.toLowerCase().includes('orange')) {
                score += 5;
            }
        }

        // Party logic
        if (lowerQuery.includes('party')) {
            if (listing.category.toLowerCase().includes('dress') ||
                listing.category.toLowerCase().includes('suit') ||
                listing.category.toLowerCase().includes('shoes')) {
                score += 3;
            }
        }

        // Summer logic
        if (lowerQuery.includes('summer') || lowerQuery.includes('beach')) {
            if (listing.category.toLowerCase().includes('shorts') ||
                listing.category.toLowerCase().includes('t-shirt') ||
                listing.description.toLowerCase().includes('light')) {
                score += 3;
            }
        }

        // Winter logic
        if (lowerQuery.includes('winter') || lowerQuery.includes('cold')) {
            if (listing.category.toLowerCase().includes('jacket') ||
                listing.category.toLowerCase().includes('coat') ||
                listing.category.toLowerCase().includes('sweater')) {
                score += 3;
            }
        }

        return { listing, score };
    });

    // Filter out zero scores and sort by score
    return scoredListings
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.listing);
};
