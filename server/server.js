const express = require('express');
const path = require('path');
// Import the data directly as a JavaScript module
const hostawayReviews = require('./mock-reviews.js'); 
const app = express();
const port = 3001; 

// Middleware to serve static files (e.g., your React build)
// Note: This path is for local testing. Vercel uses the 'routes' for production serving.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.json());

// --- DATA NORMALIZATION LOGIC ---
const getNormalizedReviews = () => {
    try {
        // 1. Force a Deep Copy using JSON methods. This is the most reliable way 
        //    to prevent caching/immutability issues on the serverless function.
        const hostawayReviewsCopy = JSON.parse(JSON.stringify(hostawayReviews));
        
        // 2. Map and normalize the fresh copy:
        return hostawayReviewsCopy.map(review => ({
            id: String(review.id), 
            // ... (rest of the normalization logic remains the same) ...
            listing_id: review.listing_id || 'UNKNOWN',
            overall_rating: parseFloat(review.overall_rating), 
            submitted_at: new Date(review.submitted_at).toISOString(),
            category_ratings: review.category_ratings || []
        }));
    } catch (error) {
        console.error(`FATAL ERROR: Normalization failed:`, error);
        return [];
    }
};
// --- API Route: GET /api/reviews/hostaway ---
app.get('/api/reviews/hostaway', (req, res) => {
    const normalizedReviews = getNormalizedReviews();
    
    // Returns structured, usable data for the frontend
    res.json({
        status: "success",
        result: normalizedReviews
    });
});

// Serve the React app for all other routes (for local build/production)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Mock API server running on http://localhost:${port}`);
});