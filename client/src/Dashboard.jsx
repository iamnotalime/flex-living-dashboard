import React, { useState, useEffect, useMemo } from 'react';
import { useApprovedReviews } from './useApprovedReviews'; 

// --- Helper Component: Star Rating Display ---
const StarRating = ({ rating }) => {
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
    // FIX: Ensure correct destructuring
    const [reviews, setReviews] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState(0); 
    const { approvedIds, toggleApproval } = useApprovedReviews();

    // 1. Fetch data from the mock API
    useEffect(() => {
        fetch('/api/reviews/hostaway')
            .then(res => res.json())
            .then(data => {
                setLoading(false); 
                // CRITICAL CHECK: Ensure data is an array before setting state
                if (data && data.status === 'success' && Array.isArray(data.result)) {
                   setReviews(data.result);
                } else {
                    console.error("API Response structure invalid or not success:", data);
                    setReviews([]); 
                }
            })
            .catch(error => {
                console.error("Fetch failed entirely (CORS/Network error):", error);
                setLoading(false);
                setReviews([]);
            });
    }, []);

    // 2. Filter and Sort Logic (unchanged)
    const filteredAndSortedReviews = useMemo(() => {
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
            
            <h3>Review Management ({filteredAndSortedReviews.length} Reviews)</h3>
            
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