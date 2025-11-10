const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

// Assume 'build' is the directory where React compiles its files
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.json());

// Path to the mock data file
// CRITICAL FIX: Use the Vercel-standard path for included files.
const MOCK_DATA_PATH = path.join(process.cwd(), 'server', 'mock-reviews.json');

const getNormalizedReviews = () => {
    try {
        // CRITICAL FIX: Use path.resolve() to get the absolute path 
        // starting from the Vercel execution environment root.
        // This is necessary because Vercel often places bundled assets 
        // at the root level.
        const pathRelativeToRoot = path.resolve('server', 'mock-reviews.json');

        // Check if the file exists before attempting to read (reliable safeguard)
        if (!fs.existsSync(pathRelativeToRoot)) {
            console.error(`FATAL ERROR: Mock data file not found at: ${pathRelativeToRoot}`);
            // Return empty array instead of throwing an unhandled error
            return []; 
        }

        const rawData = fs.readFileSync(pathRelativeToRoot, 'utf8');
        const hostawayReviews = JSON.parse(rawData);

        // ... (rest of the mapping logic remains the same) ...
        return hostawayReviews.map(review => ({
            // ... (normalization code) ...
        }));
    } catch (error) {
        // Log the failure to the Vercel console for future debugging
        console.error(`ERROR: Failed to process mock data:`, error);
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