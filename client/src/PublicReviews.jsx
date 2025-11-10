import React, { useState, useEffect } from 'react';
import { useApprovedReviews } from './useApprovedReviews'; 

// --- Review Card Component ---
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
    // FIX: Ensure correct destructuring
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { approvedIds } = useApprovedReviews(); 

    // 1. Fetch ALL data 
    useEffect(() => {
        fetch('/api/reviews/hostaway')
            .then(res => res.json())
            .then(data => {
                setLoading(false); 
                if (data && data.status === 'success' && Array.isArray(data.result)) {
                   setAllReviews(data.result);
                } else {
                    setAllReviews([]); 
                }
            })
            .catch(error => {
                console.error("Fetch failed entirely:", error);
                setLoading(false);
                setAllReviews([]);
            });
    }, []);

    // 2. Filter reviews
    const publishedReviews = allReviews.filter(review => 
        approvedIds.includes(String(review.id))
    ).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)); 

    if (loading) return <div className="loading-container">Loading Guest Experiences...</div>;

    // --- RENDER PUBLIC PAGE SECTION ---
    return (
        <div className="public-reviews-section">
            <h2 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                Guest Experiences ({publishedReviews.length} Reviews)
            </h2>
            
            {publishedReviews.length === 0 ? (
                <div className="review-card">
                    <p style={{ textAlign: 'center', fontStyle: 'normal' }}>
                        Be the first to leave a public review! (Or the manager has not approved any yet.)
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