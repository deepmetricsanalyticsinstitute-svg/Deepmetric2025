
import React, { useState } from 'react';
import { Button } from './Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  courseTitle: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, courseTitle }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all scale-100 relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-4 pr-8">Rate "{courseTitle}"</h3>
        
        <div className="flex flex-col items-center mb-6">
            <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star} 
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl focus:outline-none transition-transform hover:scale-110"
                    style={{ color: (hoverRating || rating) >= star ? '#FBBF24' : '#D1D5DB' }}
                >
                ★
                </button>
            ))}
            </div>
            <span className="text-sm text-gray-500">{rating ? `You selected ${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}</span>
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          rows={4}
          placeholder="Share your experience with this course (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        
        <div className="flex justify-end gap-3">
           <Button variant="outline" onClick={onClose}>Cancel</Button>
           <Button onClick={() => onSubmit(rating, comment)} disabled={rating === 0}>Submit Review</Button>
        </div>
      </div>
    </div>
  );
};
