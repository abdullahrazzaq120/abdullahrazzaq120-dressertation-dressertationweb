import React, { useState } from "react";
import "./App.css";

import { Container, Row, Col } from "styled-bootstrap-grid";
import styled from "styled-components";
import DressertationCloset from "./components/DressertationCloset";
const Dressertation = () => {
  const [closetData, setClosetdata] = useState(null);

  const handleReload = () => {
    fetch("/api/closet")
      .then((res) => res.json())
      .then((data) => setClosetdata(data));
  };

  return <DressertationCloset />;
};

export default Dressertation;
