import React, { useState, useEffect } from 'react';
import { useApprovedReviews } from './useApprovedReviews';

// --- Review Card Component (Now uses CSS classes) ---
const ReviewCard = ({ review }) => (
    <div className="review-card">
        <p>"{review.public_review}"</p>
        <div className="review-card-footer">
            <div>
                <span className="review-card-rating">
                    {review.overall_rating.toFixed(1)} ★
                </span>
                <span>{review.guest_name}</span>
            </div>
            <span>{review.channel} Guest</span>
        </div>
    </div>
);

// --- MAIN PUBLIC DISPLAY COMPONENT ---
export function PublicReviews() {
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { approvedIds } = useApprovedReviews(); 

    useEffect(() => {
        fetch('/api/reviews/hostaway')
            .then(res => res.json())
            .then(data => {
                setLoading(false); // Move loading control here

                // CRITICAL CHECK: Ensure the required structure exists
                if (data && data.status === 'success' && Array.isArray(data.result)) {
                   
                   if (data.result.length === 0) {
                        console.warn("API returned a successful response but an empty array.");
                   }
                   
                   setAllReviews(data.result);

                } else {
                    console.error("API Response structure invalid or not success:", data);
                    // If the structure is wrong, reset state to empty
                    setAllReviews([]); 
                }
            })
            .catch(error => {
                console.error("Fetch failed entirely (CORS/Network error):", error);
                setLoading(false);
                setAllReviews([]);
            });
    }, []);

    // Filter reviews (logic is unchanged)
    const publishedReviews = allReviews.filter(review => 
        approvedIds.includes(String(review.id))
    ).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)); 

    if (loading) return <div className="loading-container">Loading Guest Experiences...</div>;

    // --- RENDER PUBLIC PAGE SECTION ---
    return (
        <div className="public-reviews-section">
            <h2>
                Guest Experiences ({publishedReviews.length} Reviews)
            </h2>
            
            {publishedReviews.length === 0 ? (
                <div className="review-card">
                    <p style={{ textAlign: 'center', fontStyle: 'normal' }}>
                        No public reviews have been selected for display yet.
                    </p>
                </div>
            ) : (
                publishedReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                ))
            )}
        </div>
    );
}