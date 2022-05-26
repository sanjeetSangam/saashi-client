import React, { useEffect, useState } from "react";

import styled from "styled-components";

import { Logout } from "./Logout";
import Avatar from "@mui/material/Avatar";

import { BiGroup } from "react-icons/bi";
import { GrClose } from "react-icons/gr";

export const Contacts = ({
  contacts,
  currentUser,
  changeChat,
  listOfUsers,
}) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupName, setGroupName] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const addGroup = async (e) => {
    e.preventDefault();
    console.log(groupName);
  };

  return (
    <>
      {currentUser && (
        <Container>
          <div className="brand">
            <button onClick={() => setShowAddGroup(true)}>
              Add Group <BiGroup />{" "}
            </button>
          </div>

          <div className="contacts">
            {contacts.length > 0 &&
              contacts.map((contact, index) => {
                return (
                  <div
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    } `}
                    key={index}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    {contact.isGroupChat ? (
                      <div className="avatar">
                        <Avatar
                          alt=""
                          src="https://www.pngitem.com/pimgs/m/58-587137_group-of-people-in-a-formation-free-icon.png"
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
                      </div>
                    ) : (
                      <div className="username">
                        <h3>
                          {currentUser._id !== contact.users[0]._id
                            ? contact.users[0].first_name
                            : contact.users[1].first_name}
                        </h3>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="current-user">
            <div className="avatar">
              <Avatar
                alt=""
                src={currentUser.avatarImage}
                sx={{ width: 40, height: 40 }}
              />
            </div>

            <div className="username">
              <h2>{currentUser.first_name}</h2>
            </div>

            <Logout />
          </div>

          {showAddGroup && (
            <div className="addGroup">
              <form onSubmit={addGroup}>
                <button
                  onClick={() => setShowAddGroup(false)}
                  className="close"
                >
                  {<GrClose />}
                </button>
                <div className="group">
                  <h2>Create a new Group </h2>
                </div>

                <input
                  type="text"
                  name="group"
                  placeholder="Enter Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="lists">
                  {listOfUsers.length > 0 &&
                    listOfUsers.map((user, index) => {
                      return (
                        <div
                          key={user._id}
                          className="list"
                          onClick={() => {
                            // addChatToList(user, index);
                          }}
                        >
                          <Avatar
                            alt=""
                            src={user.avatarImage}
                            sx={{ width: 35, height: 35 }}
                          />

                          <h4>{user.first_name + " " + user.last_name}</h4>
                        </div>
                      );
                    })}
                </div>

                <button>Create Group</button>
              </form>
            </div>
          )}
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;
  background: #074d6e;
  /* position: relative; */

  .brand {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    background: #0d0d30;

    img {
      height: 2rem;
    }

    h3 {
      color: white;
      text-transform: uppercase;
    }

    button {
      background: white;
      border: none;
      color: black;
      font-size: 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      cursor: pointer;
      padding: 0.8rem 1rem;
      border-radius: 1rem 0;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding-top: 0.7rem;

    &::-webkit-scrollbar {
      display: none;
    }

    .contact {
      background: #ffffffbd;
      min-height: 4rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.5rem;
      padding: 0.4rem 1.5rem;
      gap: 1rem;
      display: flex;
      align-items: center;
      transition: 0.3s ease-in-out;

      &:hover {
        background: gray;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
          rgba(0, 0, 0, 0.23) 0px 6px 6px;
      }

      .username {
        h3 {
          color: #2d0404;
          text-transform: capitalize;
        }
      }
    }

    .selected {
      background: #0b0827;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
        rgba(0, 0, 0, 0.22) 0px 10px 10px;

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .current-user {
    background: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .avatar {
      img {
        height: 2.5rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white;
        font-weight: bold;
        text-transform: uppercase;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 1rem;
      .username {
        font-size: 1rem;
      }
    }
  }

  .addGroup {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      background: var(--form-color);
      border-radius: 2rem;
      padding: 3rem 5rem;
      max-height: 50vh;

      .close {
        background: none;
        &:hover {
          background: none;
        }
      }

      input {
        background: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        color: black;
        width: 100%;
        font-size: 1rem;
        border-radius: 1rem 0;

        &:focus {
          border: 0.1rem solid #997af0;
          outline: none;
        }
      }

      button {
        background: #997af0;
        color: white;
        padding: 1rem 2rem;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 1rem 0;
        font-size: 1rem;
        transition: 0.5s ease-in-out;
        border: transparent;

        &:hover {
          background: #4e0eff;
        }
      }
    }

    .lists {
      /* margin-top: 2rem; */
      display: flex;
      flex-direction: column;
      gap: 1rem;

      overflow: auto;
      max-height: 50vh;
      &::-webkit-scrollbar {
        display: none;
      }

      .list {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.7rem 2rem;
        background: #010325;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: 0.2s ease-in-out;

        &:hover {
          background: gray;
          color: #010325;
        }
      }
    }
  }
`;
