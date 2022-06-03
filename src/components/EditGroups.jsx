import { Avatar, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  addUsers,
  removeUsers,
  searchUsers,
  renameGroups,
} from "../utils/APIroutes";

// error handlers visuals
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const EditGroups = ({ currentChat, setCurrentChat, getChats }) => {
  const [showEditPage, setShowEditPage] = useState(false);
  const [groupName, setGroupName] = useState(undefined);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [valueUser, setValueUser] = useState(null);
  const [currentuser, setCurrentuser] = useState({});

  // error css
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    setGroupName(currentChat.chatName);
    setCurrentuser(JSON.parse(localStorage.getItem("saashi-user")));
  }, []);

  const searchUser = async (e) => {
    setValueUser(e.target.value);
    let token = localStorage.getItem("saashi_token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${searchUsers}?search=${e.target.value}`,
        config
      );

      setListOfUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async (userData) => {
    let token = localStorage.getItem("saashi_token");

    let flag = false;

    currentChat.users.find((e) => {
      if (userData._id === e._id) {
        toast.error("User Already exists", toastOptions);
        flag = true;
        return;
      }
    });

    if (!flag) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.put(
          addUsers,
          { userId: userData._id, chatId: currentChat._id },
          config
        );
        setValueUser(null);
        toast.success(`${userData.first_name} added to group`, toastOptions);
        setCurrentChat(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const removeUser = async (userData) => {
    try {
      let token = localStorage.getItem("saashi_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        removeUsers,
        {
          chatId: currentChat._id,
          userId: userData._id,
        },
        config
      );

      toast.success(`${userData.first_name} removed from group`, toastOptions);

      setCurrentChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  const renamegroup = async () => {
    let token = localStorage.getItem("saashi_token");
    console.log(token);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        renameGroups,
        {
          chatId: currentChat._id,
          chatName: groupName,
        },
        config
      );

      getChats();
      toast.success("Group Name changed", toastOptions);
      setCurrentChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(currentChat);

  return (
    <Container>
      <button onClick={() => setShowEditPage(!showEditPage)}>Edit Group</button>

      {showEditPage && (
        <div className="editPage">
          <div className="editName">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <button onClick={renamegroup}>Save Name</button>
          </div>

          <div className="addUser">
            <div className="searchUser">
              <input
                type="text"
                placeholder="Search and add users"
                onChange={searchUser}
              />
              {listOfUsers.length > 0 && valueUser && (
                <div className="showUser">
                  {listOfUsers.map((user) => {
                    return (
                      <div className="search" key={user._id}>
                        <Avatar src={user.avatarImage} />
                        <p>{user.first_name}</p>

                        <button
                          onClick={() => {
                            addUser(user);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="removeMembers">
            {currentChat.users.map((user) => {
              return (
                <div className="user" key={user._id}>
                  <Avatar src={user.avatarImage} />
                  <p>{user.first_name}</p>

                  {currentuser._id !== user._id ? (
                    <button
                      onClick={() => {
                        removeUser(user);
                      }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button style={{ background: "blue", cursor: "default" }}>
                      You
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowEditPage(false)}
            style={{ background: "white", color: "black", marginTop: "1rem" }}
          >
            Close
          </button>
        </div>
      )}

      <ToastContainer />
    </Container>
  );
};

const Container = styled.div`
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

  .editPage {
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

    .editName {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;

      input {
        padding: 0.5rem 1rem;
      }
    }

    .addUser {
      margin-top: 1rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .searchUser {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;

        input {
          width: 100%;
          padding: 0.5rem 1rem;
        }

        .showUser {
          background: white;
          /* max-height: 100px; */
          position: absolute;
          /* bottom: -5rem; */
          top: 5rem;
          z-index: 100;
          padding: 0.5rem;
          width: 100%;
        }
      }
    }

    .removeMembers {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user {
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        color: white;
      }

      button {
        background: red;
      }
    }

    .search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: black;
      padding: 0.5rem;

      button {
        background: #05274e;
      }
    }
  }
`;
