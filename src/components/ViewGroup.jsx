import { Avatar } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

export const ViewGroup = ({ currentChat }) => {
  const [showDetails, setDetails] = useState(false);

  return (
    <Container>
      <button onClick={() => setDetails(true)}>Details</button>

      {showDetails && (
        <div className="showDetails">
          <h3>{currentChat.chatName}</h3>

          <div className="groupmembers">
            {currentChat.users.map((user) => {
              return (
                <div className="user">
                  <Avatar src={user.avatarImage} />

                  {user.first_name}
                </div>
              );
            })}
          </div>
          <button onClick={() => setDetails(false)}>Close</button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  color: white;
  button {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: transparent;
    color: white;
    cursor: pointer;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
      rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
      rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
      rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
      rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
      rgba(0, 0, 0, 0.09) 0px 32px 16px;
    transition: 0.2s;

    &:hover {
      background: #040323;
      color: #ded9d9;
    }
  }

  .showDetails {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 500px;
    width: 350px;
    overflow-y: auto;
    z-index: 500;
    background: #040323;
    border-radius: 0.5rem;
    border: 1px solid white;
    padding: 1rem;
    display: grid;
    place-content: center;

    &::-webkit-scrollbar {
      display: none;
    }

    h3 {
      background: white;
      color: red;
      padding: 0.5rem 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    button {
      background: #134197;
      color: #b3cdeb;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;
