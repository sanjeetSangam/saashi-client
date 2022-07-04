import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ChatInput } from "./ChatInput";
import { getAllMessagesRoute, host } from "../utils/APIroutes";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import mp3 from "../assets/mp3.mp3";

import group from "../assets/group.png";

// io from socket.io
import { io } from "socket.io-client";

import { addNotify } from "../redux/notifications/notificationAction";
import { CircularProgress } from "@mui/material";
import { EditGroups } from "./EditGroups";
import { giveLastseen } from "../logic/Lastseen";
import { ViewGroup } from "./ViewGroup";

// some variables for socket.io
var socket, selectedChatCompare;

export const ChatContainer = ({
  currentChat,
  setCurrentChat,
  currentUser,
  getChats,
}) => {
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  let scrollRef = useRef();
  const dispatch = useDispatch();
  const noti = useSelector((store) => store.notifyReducer.notifications);
  // console.log(noti);
  const [audio] = useState(new Audio(mp3));

  // if there is currentUser, then set the socket with host and send user to socket for making the connection
  useEffect(() => {
    if (currentUser) {
      socket = io(host);
      socket.emit("setup_user", currentUser);
    }
  }, [currentUser]);


  // getting all the messages from the server
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

  // if there is current chat, get the existing messages if already there in database, and set the compare selected chat
  useEffect(() => {
    getAllMsg();
    selectedChatCompare = currentChat;
  }, [currentChat]);


  // used for getting realtime chat with socket and updating all the messages also from DB and playing tone,
  //  renders everytime when the new messages arrives
  useEffect(() => {
    if (currentChat) {
      socket.on("recieve", (newMessage) => {
        getChats();
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessage.chat._id
        ) {
          // notification
          // if (!noti.includes(newMessage.sender._id)) {
          //   // setNotifications([newMessage, ...notifications]);
          //   // noti.push(newMessage);
          //   dispatch(addNotify(newMessage));
          // }
        } else {
          setMessages([...messages, newMessage]);

          audio.play();
        }
      });
    }
  });

  // to scroll into latest message that arrives with smooth animation
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
    });

    // console.log(giveLastseen(messages, currentUser));
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
                  {currentChat.isGroupChat
                    ? ""
                    : messages.length === 0
                    ? "Start Sending Message"
                    : `Last seen ${
                        giveLastseen(messages, currentUser)
                          ? giveLastseen(messages, currentUser)
                          : "(wait for message)"
                      }`}
                </h5>
              </div>
            </div>

            {currentChat.isGroupChat &&
            currentChat.groupAdmin._id === currentUser._id ? (
              <EditGroups
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
                getChats={getChats}
              />
            ) : (
              currentChat.isGroupChat && <ViewGroup currentChat={currentChat} />
            )}
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
                        {currentChat.isGroupChat &&
                          msg.sender._id !== currentUser._id && (
                            <Avatar
                              sx={{ width: 18, height: 18 }}
                              src={msg.sender.avatarImage}
                            />
                          )}

                        <div className="content">
                          <p>{msg.content}</p>
                          {currentChat.isGroupChat &&
                            msg.sender._id !== currentUser._id && (
                              <small>{msg.sender.first_name}</small>
                            )}
                        </div>

                        {currentChat.isGroupChat &&
                          msg.sender._id === currentUser._id && (
                            <Avatar
                              sx={{ width: 18, height: 18 }}
                              src={msg.sender.avatarImage}
                            />
                          )}
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
            getChats={getChats}
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
    background: var(--chat-primary);
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
    background: var(--chat-container);
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
      gap: 0.3rem;

      .content {
        color: #d1d1d1;
        overflow-wrap: break-word;
        max-width: 40%;

        p {
          padding: 1rem;
          font-size: 1rem;
          border-radius: 1rem;
        }

        small {
          color: #555;
        }
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        p {
          background: #005c4b;
          color: white;
        }
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        p {
          background: #202c33;
          color: #ffffff;
        }

        small {
          margin-left: 1rem;
          margin-top: 1rem;
        }
      }
    }
  }
`;
