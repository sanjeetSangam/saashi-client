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
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = () => {
    if (groupPeople.length < 2) {
      toast.error("2 or more users is required", toastOptions);
      return false;
    }
    return true;
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(contact._id);
    changeChat(contact);
  };

  const addPeopleToGroup = (user, index) => {
    if (!groupPeople.includes(user)) {
      setGroupPeople([...groupPeople, user]);
    }
  };

  const removefromList = (user) => {
    // console.log(user);

    let allLists = groupPeople;
    let lists = listOfUsers;

    let newList = allLists.filter((list) => {
      return list._id !== user._id;
    });

    let newLists = lists.filter((list) => {
      return list._id !== user._id;
    });

    setListOfUsers(newLists);
    setGroupPeople(newList);
  };

  const addGroupToChat = async () => {
    let token = localStorage.getItem("saashi_token");

    if (handleValidation()) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        setShowAddGroup(false);
        let { data } = await axios.post(
          addGroups,
          {
            name: groupName,
            users: JSON.stringify(groupPeople.map((u) => u._id)),
          },
          config
        );

        if (data.status === false) {
          toast.error(data.message, toastOptions);
          return;
        }

        setContacts([data, ...contacts]);
        setCurrentChat(data);
        changeChat(data);
        //
      } catch (err) {
        console.log(err);
      }
    }
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

          {showAddGroup && (
            <div className="addGroup">
              <form onSubmit={searchChat}>
                <div className="group">
                  <h2>Create a new Group </h2>
                  <button
                    onClick={() => {
                      setShowAddGroup(false);
                    }}
                    className="close"
                  >
                    <IoClose />
                  </button>
                </div>

                <input
                  type="text"
                  name="group"
                  placeholder="Enter Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <input
                  type="text"
                  name="group"
                  placeholder="Search and add users"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button>Search Users</button>

                <div className="lists">
                  {listOfUsers.length > 0 &&
                    listOfUsers.map((user, index) => {
                      return (
                        <div
                          key={index}
                          className="list"
                          onClick={() => {
                            addPeopleToGroup(user, index);
                          }}
                        >
                          <Avatar
                            alt=""
                            src={user.avatarImage}
                            sx={{ width: 35, height: 35 }}
                          />
                        </div>
                      );
                    })}
                </div>

                {groupPeople && (
                  <h3>
                    {groupPeople.length === 0
                      ? "Add Members in Group"
                      : "Added in group"}
                  </h3>
                )}
                <div className="groupPeople">
                  {groupPeople &&
                    groupPeople.map((user) => {
                      return (
                        <div
                          onClick={() => removefromList(user)}
                          className="list_of_user"
                          key={user._id}
                        >
                          <h4>{user.first_name}</h4>
                          <IoClose />
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => {
                    addGroupToChat();
                  }}
                >
                  Create Group
                </button>
              </form>
            </div>
          )}

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
    color: white;
    background: #14242f;
    border-radius: 2rem;
    padding: 3rem 5rem;
    z-index: 1000;

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 50vh;
      max-width: 400px;

      .group {
        display: flex;
        button {
          background: none;
          position: absolute;
          right: 1rem;
          top: 1rem;
          color: white;
          &:hover {
            background: none;
          }
        }
      }

      input {
        background: transparent;
        padding: 0.5rem;
        border: 0.1rem solid #4e0eff;
        color: #ffffff;
        width: 100%;
        font-size: 1rem;
        border-radius: 1rem 0;

        &:focus {
          border: 0.1rem solid #997af0;
          outline: none;
        }
      }
    }

    button {
      background: #997af0;
      color: white;
      padding: 0.5rem;
      cursor: pointer;
      font-weight: bold;
      text-transform: uppercase;
      border-radius: 1rem 0;
      /* font-size: 1rem; */
      transition: 0.5s ease-in-out;
      border: transparent;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #4e0eff;
      }
    }

    .lists {
      display: flex;
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
        color: white;
        cursor: pointer;
        transition: 0.2s ease-in-out;
      }
    }
  }

  .groupPeople {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 0.5rem;
  }

  .list_of_user {
    display: flex;
    background: white;
    color: #111b21;
    padding: 0.5rem;
  }
`;
