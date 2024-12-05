import React from 'react'
import styled from 'styled-components';





// Sleek Rating component
const Rating = ({ rating, onRate }) => (
  <StarWrapper>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        isFilled={i < rating}
        onClick={() => onRate(i + 1)}
        onMouseEnter={(e) => e.target.style.color = '#FFD700'}
        onMouseLeave={(e) => e.target.style.color = i < rating ? '#FFD700' : '#ccc'}
      >
        ★
      </Star>
    ))}
    <RatingText>{rating} / 5</RatingText>
  </StarWrapper>
);

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
`;

const Star = styled.span`
  color: ${(props) => (props.isFilled ? '#FFD700' : '#ccc')};  /* Gold for filled stars, grey for unfilled */
  transition: color 0.3s ease-in-out;
  font-size: 28px;
  &:hover {
    color: #FFD700;
    transform: scale(1.2);
  }
`;

const RatingText = styled.span`
  margin-left: 10px;
  font-size: 1rem;
  color: #555;
`;


export default Rating