const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// --- MOCK DATA ARRAY (MERGED FROM mock-reviews.js) ---
const MOCK_DATA_ARRAY = [
    {
        "id": 1001,
        "listing_id": "P101",
        "listing_name": "The Shoreditch Loft - Unit A",
        "channel": "Airbnb",
        "overall_rating": 5.0,
        "public_review": "A perfect stay! Seamless check-in, spotless apartment, and the host was super responsive. Highly recommend this loft for a central London trip.",
        "guest_name": "Sarah K.",
        "submitted_at": "2025-10-25T14:30:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 5},
            {"category": "Communication", "rating": 5},
            {"category": "Accuracy", "rating": 5},
            {"category": "Maintenance", "rating": 5}
        ]
    },
    {
        "id": 1002,
        "listing_id": "P205",
        "listing_name": "Hampstead Family Retreat",
        "channel": "Booking.com",
        "overall_rating": 3.2,
        "public_review": "The location is great, but the Wi-Fi was constantly dropping, making work impossible. We waited 30 minutes for the entry code at check-in. Needs maintenance fast.",
        "guest_name": "The Miller Family",
        "submitted_at": "2025-11-05T10:00:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 4},
            {"category": "Communication", "rating": 3},
            {"category": "Accuracy", "rating": 4},
            {"category": "Maintenance", "rating": 1} 
        ]
    },
    {
        "id": 1003,
        "listing_id": "P303",
        "listing_name": "Covent Garden Studio",
        "channel": "Hostaway Direct",
        "overall_rating": 2.8,
        "public_review": "Disappointed by the smell and dust upon arrival. The towels were stained. Communication was fine, but the cleanliness was a serious issue this time.",
        "guest_name": "Marcus A.",
        "submitted_at": "2025-11-08T09:15:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 1},
            {"category": "Communication", "rating": 4},
            {"category": "Accuracy", "rating": 3},
            {"category": "Maintenance", "rating": 4}
        ]
    },
    {
        "id": 1004,
        "listing_id": "P101",
        "listing_name": "The Shoreditch Loft - Unit A",
        "channel": "Vrbo",
        "overall_rating": 4.5,
        "public_review": "Great location and comfortable beds. Minor note: the washing machine was quite loud, but otherwise perfect.",
        "guest_name": "Jenna L.",
        "submitted_at": "2025-10-30T11:00:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 5},
            {"category": "Communication", "rating": 5},
            {"category": "Accuracy", "rating": 4},
            {"category": "Maintenance", "rating": 3} 
        ]
    },
    {
        "id": 1005,
        "listing_id": "P205",
        "listing_name": "Hampstead Family Retreat",
        "channel": "Airbnb",
        "overall_rating": 4.9,
        "public_review": "The best place we've stayed in London! Spacious and beautifully decorated. Highly recommend for families.",
        "guest_name": "Chen Family",
        "submitted_at": "2025-10-15T16:45:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 5},
            {"category": "Communication", "rating": 5},
            {"category": "Accuracy", "rating": 5},
            {"category": "Maintenance", "rating": 4}
        ]
    },
    {
        "id": 1006,
        "listing_id": "P303",
        "listing_name": "Covent Garden Studio",
        "channel": "Booking.com",
        "overall_rating": 4.0,
        "public_review": "Good value for the money. The shower took a while to heat up, but the check-in process was very smooth.",
        "guest_name": "Diana V.",
        "submitted_at": "2025-11-12T20:00:00Z",
        "category_ratings": [
            {"category": "Cleanliness", "rating": 4},
            {"category": "Communication", "rating": 5},
            {"category": "Accuracy", "rating": 4},
            {"category": "Maintenance", "rating": 3}
        ]
    }
];

// Middleware to serve static files (e.g., your React build)
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.json());

// --- DATA NORMALIZATION LOGIC ---
const getNormalizedReviews = () => {
    try {
        // Force a Deep Copy. This is the most reliable way to prevent caching/immutability issues 
        // on the serverless function and allows Node to send a clean JSON object.
        const hostawayReviewsCopy = JSON.parse(JSON.stringify(MOCK_DATA_ARRAY));
        
        if (!Array.isArray(hostawayReviewsCopy) || hostawayReviewsCopy.length === 0) {
            console.error("MOCK DATA ARRAY IS EMPTY/INVALID.");
            return [];
        }

        return hostawayReviewsCopy.map(review => ({
            id: String(review.id), 
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

// Serve the React app for all other routes (for production)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Mock API server running on http://localhost:${port}`);
});