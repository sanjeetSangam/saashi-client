import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";

import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

import mp3 from "../assets/mp3.mp3";

import { sendMessageRoute } from "../utils/APIroutes";
import axios from "axios";

export const ChatInput = ({
  currentChat,
  currentUser,
  setMessages,
  messages,
  socket,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [audio] = useState(new Audio(mp3));

  const handleSendMessage = async (event) => {
    event.preventDefault();
    let token = localStorage.getItem("saashi_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

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
    setMsg("");
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

        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 12% 87%;
  align-items: center;
  background: #160402;
  /* background: #080420; */
  padding: 0.8rem 0.2rem;

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      svg {
        font-size: 2rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .emoji-picker-react {
        position: absolute;
        bottom: 3rem;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        background: #080420;

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
          background: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background: #ffffff34;
    overflow: hidden;

    input {
      width: 90%;
      height: 60%;
      background: transparent;
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
