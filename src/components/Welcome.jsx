import React from "react";

import styled from "styled-components";
import robot from "../assets/robot.gif";

export const Welcome = ({ currentUser }) => {
  return (
    <Container>
      <img src={robot} alt="ROBOTA" />

      <h1>
        Welcome, <span>{currentUser.first_name}</span>
      </h1>

      <h3>Select a chat to start messaging</h3>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background: #0c1216;

  img {
    max-inline-size: 100%;
  }

  h1 {
    color: #de05;

    span {
      text-transform: uppercase;
    }
  }

  h3 {
    color: #fff;
  }
`;
