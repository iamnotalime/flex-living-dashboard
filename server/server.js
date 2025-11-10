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
        // Since data is imported directly, we just run the normalization map.
        if (!Array.isArray(hostawayReviews) || hostawayReviews.length === 0) {
            console.warn("Mock data is empty or invalid array.");
            return [];
        }
        
        return hostawayReviews.map(review => ({
            id: String(review.id), // CRITICAL: Ensure ID is a string for localStorage
            listing_id: review.listing_id || 'UNKNOWN',
            listing_name: review.listing_name,
            channel: review.channel,
            overall_rating: parseFloat(review.overall_rating), 
            public_review: review.public_review,
            guest_name: review.guest_name,
            submitted_at: new Date(review.submitted_at).toISOString(), 
            category_ratings: review.category_ratings || []
        }));
    } catch (error) {
        console.error(`FATAL ERROR: Failed to process mock data:`, error);
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