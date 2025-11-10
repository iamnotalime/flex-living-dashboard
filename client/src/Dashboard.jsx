import React, { useState, useEffect, useMemo } from 'react';
import { useApprovedReviews } from './useApprovedReviews'; 

// --- Helper Component: Star Rating Display ---
const StarRating = ({ rating }) => {
    // ... (This component code is unchanged)
    const fullStars = Math.floor(rating);
    let stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span key={i} style={{ color: i < fullStars ? 'gold' : 'lightgray' }}>
                ★
            </span>
        );
    }
    return <div style={{ display: 'inline-block' }}>{stars}</div>;
};

// --- MAIN DASHBOARD COMPONENT ---
export function Dashboard() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { approvedIds, toggleApproval } = useApprovedReviews();
    const [filterRating, setFilterRating] = useState(0); 

    useEffect(() => {
        fetch('/api/reviews/hostaway')
            // ... (rest of fetch logic is unchanged)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setReviews(data.result);
                }
            })
            .catch(error => console.error("Could not fetch reviews:", error))
            .finally(() => setLoading(false));
    }, []);

    const filteredAndSortedReviews = useMemo(() => {
        // ... (this logic is unchanged)
        let sorted = [...reviews].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        
        if (filterRating > 0) {
            sorted = sorted.filter(r => r.overall_rating <= filterRating);
        }
        return sorted;
    }, [reviews, filterRating]);

    if (loading) return <div className="loading-container">Loading Flex Insights...</div>;

    // --- RENDER DASHBOARD ---
    return (
        <div className="dashboard-container">
            <h2>📊 Flex Insights Dashboard</h2>
            
            <div className="filter-container">
                <label htmlFor="rating-filter">Filter by Rating: </label>
                <select id="rating-filter" value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}>
                    <option value={0}>Show All Ratings</option>
                    <option value={3}>3 Stars or Less (Issues)</option>
                    <option value="2">2 Stars or Less (Critical)</option>
                </select>
            </div>

            {/* In a real app, Heatmap/Charts would go here */}
            
            <h3>Review Management ({filteredAndSortedReviews.length} Reviews)</h3>
            
            {/* **THIS IS THE CRITICAL CHANGE**
              The <div> wrapper is added to make the table responsive.
            */}
            <div className="table-responsive-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Rating</th>
                            <th>Date</th>
                            <th>Snippet</th>
                            <th>LIVE on Site</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedReviews.map(review => {
                            const isApproved = approvedIds.includes(review.id);
                            const rowStyle = review.overall_rating <= 3 ? { backgroundColor: '#ffebee' } : {};

                            return (
                                <tr key={review.id} style={rowStyle}>
                                    <td data-label="Property">{review.listing_name}</td>
                                    <td data-label="Rating"><StarRating rating={review.overall_rating} /></td>
                                    <td data-label="Date">{new Date(review.submitted_at).toLocaleDateString()}</td>
                                    <td data-label="Snippet">{review.public_review.substring(0, 70)}...</td>
                                    <td data-label="LIVE on Site">
                                        <input 
                                            type="checkbox"
                                            checked={isApproved}
                                            onChange={() => toggleApproval(review.id)}
                                            className="review-toggle"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}