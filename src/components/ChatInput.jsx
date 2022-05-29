import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";

import { BsEmojiSmileFill } from "react-icons/bs";
import { sendMessageRoute } from "../utils/APIroutes";
import axios from "axios";

export const ChatInput = ({
  currentChat,
  setMessages,
  messages,
  socket,
  getChats,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSendMessage = async (event) => {
    event.preventDefault();
    let token = localStorage.getItem("saashi_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setMsg("");
    setShowEmojiPicker(false);

    const { data } = await axios.post(
      sendMessageRoute,
      {
        chatId: currentChat._id,
        content: msg,
      },
      config
    );

    socket.emit("send_msg", data);
    setMessages([...messages, data]);
    setShowEmojiPicker(false);
    getChats();
  };

  const handleEmojiPickerBhvr = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerBhvr} />

          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>

      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 12% 87%;
  align-items: center;
  background: #202c33;
  /* background: #080420; */
  padding: 0.8rem 0.2rem;

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 1rem;
    height: 100%;

    .emoji {
      position: relative;
      box-shadow: none;
      transition: 0.1s ease-in-out;
      svg {
        font-size: 2rem;
        color: #d9d9d4c7;
        cursor: pointer;
      }

      .emoji-picker-react {
        position: absolute;
        bottom: 4rem;
        background: #2a3942;
        box-shadow: none;
        transition: 0.1s ease-in-out;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }

        .emoji-search {
          background: transparent;
          border-color: #9186f3;
          color: white;
        }

        .emoji-group::before {
          background: #2a3942;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    height: 70%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background: #ffffff34;
    overflow: hidden;

    input {
      width: 100%;
      height: 100%;
      background: #2a3942;
      color: white;
      border: none;
      padding-left: 2rem;
      display: flex;
      align-items: center;
      font-size: 1.2rem;

      &::selection {
        background: #9186f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #241602;
      border: none;
      cursor: pointer;
      transition: 0.2s ease-in-out;

      &:hover {
        background: #441705;
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
