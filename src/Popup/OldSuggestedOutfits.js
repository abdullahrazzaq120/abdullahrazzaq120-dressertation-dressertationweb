import React, { useState, useMemo } from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import "reactjs-popup/dist/index.css";
import Rating from "../components/Rating";

const OldSuggestedOutfits = ({
  oldSuggestedArray,
  closeModalOldSuggestedOutfits,
  openOldSuggestedPopup,
  setOldSuggestedArray, // Add this prop if you need to update oldSuggestedArray,
  isNightMode
}) => {
  const [productRatings, setProductRatings] = useState({});
  
  // Grouping outfits by selected time
  const groupedProducts = useMemo(() => {
    return oldSuggestedArray.reduce((acc, product) => {
      const { selectedTime } = product;
      if (!acc[selectedTime]) {
        acc[selectedTime] = [];
      }
      acc[selectedTime].push(product);
      return acc;
    }, {});
  }, [oldSuggestedArray]);

  const handleRating = (productId, newRating) => {
    setProductRatings({
      ...productRatings,
      [productId]: newRating,
    });
  };

  return (
    <Popup open={openOldSuggestedPopup} modal nested>
      <Overlay />
      <ModalContainer isNightMode={isNightMode}>
        <CloseButton onClick={closeModalOldSuggestedOutfits}>
          &times;
        </CloseButton>
        <ModalHeader isNightMode={isNightMode}>Old Suggested Outfits</ModalHeader>
        <OrdersContainer>
          {Object.keys(groupedProducts).map((selectedTime) => (
            <OrderCard key={selectedTime}>
              <OrderInfo>
                <OrderDate>
                  <strong>Date Created:</strong> {selectedTime}
                </OrderDate>
              </OrderInfo>
              
              <ProductRow>
                {groupedProducts[selectedTime].map((product) => (
                  <>
                  <ProductImage
                    key={product.dressId}
                    src={product.url}
                    alt={product.name}
                  /><OutfitDetailsBlock>
                 
                </OutfitDetailsBlock>
                </>
                ))}
              </ProductRow>
              <Rating
                rating={productRatings[selectedTime] || 0}
                onRate={(newRating) => handleRating(selectedTime, newRating)}
              />
            </OrderCard>
          ))}
        </OrdersContainer>
      </ModalContainer>
    </Popup>
  );
};

// Function to select products with timestamp

const Overlay = styled.div`
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ModalContainer = styled.div`
  background-color: ${({ isNightMode }) => (isNightMode ? "#3C3C40" : "#fff")};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 80vh;
  max-width: 90vw;
  width: 100%;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ isNightMode }) => (isNightMode ? "#fff" : "#333")};
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderDate = styled.p`
  font-weight: bold;
  margin: 0;
`;

const ProductRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const OutfitDetailsBlock = styled.div`
  margin: 10px 0;
  font-size: 1rem;
  color: #555;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

export default OldSuggestedOutfits;
