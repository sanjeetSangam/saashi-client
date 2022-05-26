import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { addChat, allChats, searchUsers } from "../utils/APIroutes";
import { Contacts } from "../components/Contacts";
import { Welcome } from "../components/Welcome";
import { ChatContainer } from "../components/ChatContainer";

import logo from "../assets/logo.svg";

import { Avatar } from "@mui/material";

export const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsloaded] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState(null);
  const [listOfUsers, setListOfUsers] = useState([]);

  const navigate = useNavigate();

  // navigating to login if user is not logged in
  useEffect(() => {
    if (!localStorage.getItem("saashi-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("saashi-user")));
      setIsloaded(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (!currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  // getAll contacts from server for the user
  const getChats = async (e) => {
    let token = localStorage.getItem("saashi_token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(allChats, config);

      setContacts(data);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const searchUser = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem("saashi_token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${searchUsers}?search=${search}`,
        config
      );
      setListOfUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addChatToList = async (user, index) => {
    let token = localStorage.getItem("saashi_token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        addChat,
        {
          userId: user._id,
        },
        config
      );

      getChats();
      setShowSearch(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <div className="navbar">
        <div className="brand">
          <img src={logo} alt="LOGO" />
          <h2>SAASHI</h2>
        </div>

        <div className="search">
          <button onClick={() => setShowSearch(true)}>Search User</button>
        </div>
      </div>

      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          listOfUsers={listOfUsers}
        />

        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} />
        )}
      </div>

      {showSearch ? (
        <div className="search_box">
          <button onClick={() => setShowSearch(false)}>close</button>

          <form onSubmit={searchUser}>
            <div className="title">
              <h3>Search User</h3>
            </div>

            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Enter UserName"
            />

            <button>Search</button>
          </form>

          <div className="lists">
            {listOfUsers.length > 0 &&
              listOfUsers.map((user, index) => {
                return (
                  <div
                    key={user._id}
                    className="list"
                    onClick={() => {
                      addChatToList(user, index);
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
        </div>
      ) : (
        ""
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-direction: column;

  .navbar {
    padding: 1rem;
    color: #130101;
    width: 85vw;
    background: #ffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 1.5rem 1.5rem 0 0;

    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: bolder;

      img {
        height: 2rem;
      }
    }

    .search {
      height: 100%;
      button {
        height: 100%;
        padding: 0 1rem;
        border-radius: 0 1.5rem 0 0;
        border: none;
        outline: none;
        background: #4e0eff;
        cursor: pointer;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .container {
    height: 85vh;
    width: 85vw;
    background: var(--chat-page);
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 0 0 1.5rem 1.5rem;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

  .search_box {
    position: absolute;
    z-index: 500;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--form-color);
    border-radius: 2rem;
    padding: 3rem 5rem;

    button {
      width: max-content;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      /* background: var(--form-color);
      border-radius: 2rem;
      padding: 3rem 5rem; */

      input {
        background: transparent;
        padding: 0.5rem;
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
        padding: 0.5rem 2rem;
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
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
