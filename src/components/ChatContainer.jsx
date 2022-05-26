import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ChatInput } from "./ChatInput";
import { getAllMessagesRoute, host } from "../utils/APIroutes";
import Avatar from "@mui/material/Avatar";

import { useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";

// varibales to socket.io
import { io } from "socket.io-client";
import { addNotify } from "../redux/notifications/notificationAction";
var socket, selectedChatCompare;

export const ChatContainer = ({ currentChat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  let scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      socket = io(host);
      socket.emit("setup_user", currentUser);
      socket.on("connection", () => setSocketConnected(true));
    }
  }, [currentUser]);

  const getAllMsg = async () => {
    let token = localStorage.getItem("saashi_token");

    if (currentChat) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `${getAllMessagesRoute}/${currentChat._id}`,
          config
        );

        setMessages(data);
        socket.emit("join_chat", currentChat._id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getAllMsg();
    selectedChatCompare = currentChat;
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      socket.on("recieve", (newMessage) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessage.chat._id
        ) {
          // notification

          let noti = [];

          if (!noti.includes(newMessage)) {
            setNotifications([newMessage, ...notifications]);
            noti.push(newMessage);
            dispatch(addNotify(noti));
          }
        } else {
          console.log(newMessage);
          setMessages([...messages, newMessage]);
        }
      });
    }
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                {currentChat.isGroupChat ? (
                  <Avatar
                    alt=""
                    src={
                      "https://www.pngitem.com/pimgs/m/58-587137_group-of-people-in-a-formation-free-icon.png"
                    }
                    sx={{ width: 50, height: 50 }}
                  />
                ) : (
                  <Avatar
                    alt=""
                    src={
                      currentUser._id !== currentChat.users[0]._id
                        ? currentChat.users[0].avatarImage
                        : currentChat.users[1].avatarImage
                    }
                    sx={{ width: 50, height: 50 }}
                  />
                )}
              </div>

              <div className="username">
                {currentChat.isGroupChat ? (
                  <h3>{currentChat.chatName}</h3>
                ) : (
                  <h3>
                    {currentUser._id !== currentChat.users[0]._id
                      ? currentChat.users[0].first_name +
                        " " +
                        currentChat.users[0].last_name
                      : currentChat.users[1].first_name +
                        " " +
                        currentChat.users[1].last_name}
                  </h3>
                )}

                <h5>
                  {messages.length === 0
                    ? "Start Sending Message"
                    : `Last Updated ${currentChat.updatedAt}`}
                </h5>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => {
              return (
                msg.sender &&
                currentUser && (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message  ${
                        msg.sender._id === currentUser._id
                          ? "sended"
                          : "recieved"
                      }`}
                    >
                      <div className="content">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>

          {/* <Messages /> */}
          <ChatInput
            currentChat={currentChat}
            currentUser={currentUser}
            setMessages={setMessages}
            messages={messages}
            socket={socket}
          />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 80% 10%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 2rem;
    background: var(--chat-header);
    text-transform: uppercase;

    .user-details {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        height: 100%;
        display: flex;
        align-items: center;
      }

      .username {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-direction: column;
        h3,
        h5 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background: var(--chat-send);
        color: white;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background: var(--chat-recieve);
        color: black;
      }
    }
  }
`;
