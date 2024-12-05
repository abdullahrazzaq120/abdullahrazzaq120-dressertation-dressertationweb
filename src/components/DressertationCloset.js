import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "styled-bootstrap-grid";
import styled from "styled-components";
import FiltersComponent from "./FilterCloset";
import ClipLoader from "react-spinners/ClipLoader";

const DressertationCloset = () => {
  const [closetData, setClosetData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  let [color, setColor] = useState("#ffffff");

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReload = () => {
    setLoading(true); // Start loading
    // Simulate fetching closet data
    setTimeout(() => {
      setClosetData(true); // Set the data (replace this with real API data)
      setLoading(false); // Stop loading
    }, 2000); // Simulate a 2-second delay
  };

  useEffect(() => {
    handleReload(); // Initial data load

    let intervalId;
    if (isActive) {
      // Set interval to reload every 5 seconds when Auto Reload is ON
      intervalId = setInterval(() => {
        handleReload();
      }, 5000); // 5 seconds in milliseconds
    }

    // Cleanup interval on component unmount or when toggle is OFF
    return () => clearInterval(intervalId);
  }, [isActive]);
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  return (
    <CustoamContainer >
      <Row>
        <Col lg={4}>
        <Spacer />
          <MainText>Pick an Outfit</MainText>
          <Spacer />
        </Col>
        <Col lg={4}>
        <Spacer/>
        </Col>
        <Col lg={2}>
        <Spacer />
          <ToggleWrapper>
            <ToggleLabel>Auto Reload</ToggleLabel>
            <ToggleContainer isActive={isActive} onClick={handleToggle}>
              <ToggleCircle isActive={isActive} />
            </ToggleContainer>
          </ToggleWrapper>
          <Spacer />
        </Col>
        <Col lg={2}>
        <Spacer />
          <Button onClick={handleReload}>Reload Latest Closet</Button>
          <Spacer />
        </Col>

        <Col lg={12}>
          {loading ? (
            <ClipLoader
              color={color}
              loading={loading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : closetData ? (
            <FiltersComponent />
          ) : (
            <SubMain>
              <Heading>No Closet Available</Heading>
              <div>Hit the reload button if the closet data is available.</div>
            </SubMain>
          )}
        </Col>
      </Row>
    </CustoamContainer>
  );
};
const CustoamContainer=styled(Container)`
padding-left: 0;
padding-right: 0;
`
// Styled components
const MainText = styled.div`
  font-size: 28px;
  font-weight: 600;
`;

const Button = styled.div`
  background-color: #add8e6;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const SubMain = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-top: 12rem;
`;

const Spacer = styled.div`
  margin-top: 2rem;
`;

const Spinner = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 3rem;
`;
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.span`
  margin-right: 10px;
  font-size: 16px;
  color: #333;
`;

const ToggleContainer = styled.div`
  display: inline-block;
  width: 60px;
  height: 30px;
  border-radius: 50px;
  background-color: ${({ isActive }) => (isActive ? "#4CAF50" : "#ccc")};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const ToggleCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 2px;
  left: ${({ isActive }) => (isActive ? "32px" : "2px")};
  transition: left 0.3s;
`;
export default DressertationCloset;
