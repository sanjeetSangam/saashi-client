import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ChatInput } from "./ChatInput";
import { getAllMessagesRoute, host } from "../utils/APIroutes";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import mp3 from "../assets/mp3.mp3";

import group from "../assets/group.png";
// varibales to socket.io
import { io } from "socket.io-client";
import { addNotify } from "../redux/notifications/notificationAction";
import { CircularProgress } from "@mui/material";
var socket, selectedChatCompare;

export const ChatContainer = ({ currentChat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [comingMessage, setComingMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  let scrollRef = useRef();
  const dispatch = useDispatch();
  const [audio] = useState(new Audio(mp3));

  useEffect(() => {
    if (currentUser) {
      socket = io(host);
      socket.emit("setup_user", currentUser);
    }
  }, [currentUser]);

  const getAllMsg = async () => {
    setLoading(true);
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

        if (!messages.find((c) => c._id === data._id)) {
        }

        setMessages(data);
        setLoading(false);

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
          setMessages([...messages, newMessage]);
          setComingMessage(newMessage);
          audio.play();
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
                  <Avatar alt="" src={group} sx={{ width: 50, height: 50 }} />
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
                    : `Last Updated ${new Date(
                        currentChat.updatedAt
                      ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`}
                </h5>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {loading ? (
              <div className="loading">
                <CircularProgress />
              </div>
            ) : (
              messages &&
              messages.map((msg) => {
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
              })
            )}
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
  position: relative;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 80% 10%;
  }

  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate((-50%, -50%));
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 2rem;
    background: #202c33;
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
    background: #0b141a;
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
        background: #005c4b;
        color: white;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background: #202c33;
        color: #ffffff;
      }
    }
  }
`;
