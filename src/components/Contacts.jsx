import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { addGroups } from "../utils/APIroutes";
import { CircularProgress } from "@mui/material";

// error handlers visuals
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import group from "../assets/group.png";

export const Contacts = ({
  contacts,
  currentUser,
  changeChat,
  listOfUsers,
  setListOfUsers,
  showAddGroup,
  setShowAddGroup,
  searchChat,
  setSearch,
  setContacts,
  setCurrentChat,
  loading,
}) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupName, setGroupName] = useState("");
  const [groupPeople, setGroupPeople] = useState([]);

  // error css
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(contact._id);
    changeChat(contact);
  };

  return (
    <>
      {currentUser && (
        <Container>
          <div className="brand">
            <h3>Chats</h3>
          </div>

          <div className="contacts">
            {loading ? (
              <div className="loading">
                <CircularProgress />
              </div>
            ) : (
              contacts.length > 0 &&
              contacts.map((contact, index) => {
                return (
                  <div
                    className={`contact ${
                      contact._id === currentSelected ? "selected" : ""
                    } `}
                    key={index}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    {contact.isGroupChat ? (
                      <div className="avatar">
                        <Avatar
                          alt=""
                          src={group}
                          sx={{ width: 45, height: 45 }}
                        />
                      </div>
                    ) : (
                      <div className="avatar">
                        <Avatar
                          alt=""
                          src={
                            currentUser._id !== contact.users[0]._id
                              ? contact.users[0].avatarImage
                              : contact.users[1].avatarImage
                          }
                          sx={{ width: 45, height: 45 }}
                        />
                      </div>
                    )}

                    {contact.isGroupChat ? (
                      <div className="username">
                        <h3>{contact.chatName}</h3>
                        <h5>
                          {contact.latestMessage &&
                            contact.latestMessage.content}
                        </h5>
                      </div>
                    ) : (
                      <div className="username">
                        <h3>
                          {currentUser._id !== contact.users[0]._id
                            ? contact.users[0].first_name
                            : contact.users[1].first_name}
                        </h3>
                        <h5>
                          {contact.latestMessage &&
                            contact.latestMessage.content}
                        </h5>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <ToastContainer />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  background: #202c33;
  border-right: 0.01px solid #404040;
  /* position: relative; */

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding-top: 0.7rem;
    background: #111b21;

    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::-webkit-scrollbar {
      display: none;
    }

    .contact {
      min-height: 4rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.5rem;
      padding: 0.4rem 1.5rem;
      gap: 1rem;
      display: flex;
      align-items: center;
      transition: 0.1s ease-in-out;

      &:hover {
        background: #354854;
      }

      .username {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h3 {
          color: #f3ecec;
          text-transform: capitalize;
        }

        h5 {
          color: #1b6b4a;
        }
      }
    }

    .selected {
      background: #2a3942;

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  @media screen and (max-width: 800px) {
    display: none;
  }
`;
