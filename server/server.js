const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

// Assume 'build' is the directory where React compiles its files
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.json());

// Path to the mock data file
const MOCK_DATA_PATH = path.join(__dirname, 'mock-reviews.json');

// --- DATA NORMALIZATION LOGIC ---
const getNormalizedReviews = () => {
    try {
        const rawData = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
        const hostawayReviews = JSON.parse(rawData);

        // Map and normalize the data to a clean, consistent structure
        return hostawayReviews.map(review => ({
            id: String(review.id), // CRITICAL: Ensure ID is a string for localStorage
            listing_id: review.listing_id || 'UNKNOWN',
            listing_name: review.listing_name,
            channel: review.channel,
            // Ensure overall_rating is a number (crucial for charting/filtering)
            overall_rating: parseFloat(review.overall_rating), 
            public_review: review.public_review,
            guest_name: review.guest_name,
            // Ensure date is standardized
            submitted_at: new Date(review.submitted_at).toISOString(), 
            category_ratings: review.category_ratings || []
        }));
    } catch (error) {
        console.error("Error reading or parsing mock data:", error);
        return [];
    }
};

// --- API Route: GET /api/reviews/hostaway ---
app.get('/api/reviews/hostaway', (req, res) => {
    const normalizedReviews = getNormalizedReviews();
    
    // Returns the structured data
    res.json({
        status: "success",
        result: normalizedReviews
    });
});

// Serve the React app for all other routes (for production build)
app.get('*', (req, res) => {
    // Assuming client build is in '../client/build'
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Mock API server running on http://localhost:${port}`);
});