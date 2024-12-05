import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import 'reactjs-popup/dist/index.css';





const DetailsPopup = ({ open, closeModal,detailProduct,brokenImageProduct,setProducts,showEditImagePopUp ,showDetailsPopUp}) => {
  const formatToPDT = (dateString, pastFitCount) => {
    if (pastFitCount === 0) {
      return 'Never';
    }
  
    const date = new Date(dateString);
    const pdtDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  
    return pdtDate;
  };

 
  const [imageLink, setImageLink] = useState(brokenImageProduct.url);
  const [error, setError] = useState('');

  const handleSave = () => {
    // Basic validation to check if the URL is not empty
    if (!imageLink) {
      setError('Image link cannot be empty.');
      return;
    }

    setProducts(prevProducts =>
      prevProducts.map(product => 
        product.dressId === brokenImageProduct.dressId
          ? { ...product, url: imageLink } // Update the image link for the matching product
          : product // Return the unchanged product
      )
    );

    closeModal()

    
  };
  
  

  return (
    <Popup open={open} modal nested>
      <Overlay onClick={closeModal} />
      {showDetailsPopUp ? ( // Check if detailProduct exists
        <ModalContainer>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalHeader>{detailProduct.name}</ModalHeader>
          <ProductImage src={detailProduct.url} alt={detailProduct.name} />
          <ProductDetails>
            <DetailRow>
              <DetailLabel>Price:</DetailLabel>
              <DetailValue>{detailProduct.price}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Material:</DetailLabel>
              <DetailValue>{detailProduct.material}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Color:</DetailLabel>
              <DetailValue>{detailProduct.color}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Type:</DetailLabel>
              <DetailValue>{detailProduct.dresstype}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Last Worn:</DetailLabel>
              <DetailValue>{formatToPDT(detailProduct.lastworn, detailProduct.pastFitCount)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Times Worn (Fits):</DetailLabel>
              <DetailValue>{detailProduct.pastFitCount}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Added In Closet:</DetailLabel>
              <DetailValue>{formatToPDT(detailProduct.insertDate)}</DetailValue>
            </DetailRow>
          </ProductDetails>
        </ModalContainer>
      ) : showEditImagePopUp ? ( // If detailProduct doesn't exist, check for brokenImageProduct
        <ModalContainer>
          <h3>Edit Image Link</h3>
          <InputField
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="Enter new image URL"
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
        </ModalContainer>
      ) : null} {/* Render nothing if neither exists */}
    </Popup>
  );
};

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
  background-color: white;
  border-radius: 10px;
  padding: 4.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
 // align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: auto;
  max-height: 600px;
  //padding: 20px; /* Adds space between content and the edges of the div */
  box-sizing: border-box;
  

`;

const ModalHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

const ProductImage = styled.img`
  max-height: 200px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  width: 100%;
  padding: 0.5rem 0;
`;

const DetailLabel = styled.span`
  flex: 1;
  text-align: left;
  font-weight: bold;
`;

const DetailValue = styled.span`
  flex: 1;
  text-align: right;
  word-wrap: break-word;
  
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

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SaveButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
`;

export default DetailsPopup;
//hello