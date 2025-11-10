import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'flexLivingApprovedReviewIds';

export const useApprovedReviews = () => {
    const [approvedIds, setApprovedIds] = useState([]);

    useEffect(() => {
        const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedIds) {
            try {
                // Load IDs, ensuring they are strings (matching the normalized data)
                const parsedIds = JSON.parse(storedIds).map(String);
                setApprovedIds(parsedIds);
            } catch (e) {
                console.error("Failed to parse approved review IDs from localStorage", e);
                setApprovedIds([]);
            }
        }
    }, []);

    const toggleApproval = (reviewId) => {
        const idString = String(reviewId);

        setApprovedIds(prevIds => {
            let updatedIds;
            if (prevIds.includes(idString)) {
                updatedIds = prevIds.filter(id => id !== idString);
            } else {
                updatedIds = [...prevIds, idString];
            }

            // Write the new list to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIds));
            return updatedIds;
        });
    };

    return { approvedIds, toggleApproval };
};