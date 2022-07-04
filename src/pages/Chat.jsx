import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { addChat, allChats, searchUsers } from "../utils/APIroutes";
import { Contacts } from "../components/Contacts";
import { Welcome } from "../components/Welcome";
import { ChatContainer } from "../components/ChatContainer";
import { IoMdNotifications } from "react-icons/io";
import { MdContacts } from "react-icons/md";

import logo from "../assets/logo.svg";
import { Avatar } from "@mui/material";
import { Logout } from "../components/Logout";
import { FiSearch } from "react-icons/fi";
import { BiGroup } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import { AddGroups } from "../components/AddGroups";
var selectedChatCompare;

export const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsloaded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState(null);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [handleContacts, setHandleContacts] = useState(false);

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

  // if there id user not having avatar, send to setAvatar page
  useEffect(() => {
    if (currentUser) {
      if (!currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  // getAll function that is called in required place to update fields contacts from server for the user
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
    } catch (err) {
      console.log(err);
    }
  };

  // to get all inital chats that is created already at first
  useEffect(() => {
    try {
      let token = localStorage.getItem("saashi_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios.get(allChats, config).then(({ data }) => {
        setContacts(data);
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  // search user and add to list of searched user
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

      if (!listOfUsers.includes(data)) {
        setListOfUsers(data, ...listOfUsers);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // creating chat from search and adding it to the chat list in contact
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

      if (!contacts.find((c) => c._id === data._id)) {
        setContacts([data, ...contacts]);
      }
      setShowSearch(false);
    } catch (err) {
      console.log(err);
    }
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  return (
    <Container>
      <div className="navbar">
        <div className="brand">
          <img src={logo} alt="LOGO" />
          <h2>SAASHI</h2>

          <button className="search" onClick={() => setShowSearch(true)}>
            <FiSearch />
          </button>

          <button onClick={() => setShowAddGroup(true)}>
            <BiGroup />{" "}
          </button>
        </div>

        <div className="search">
          <div className="showContacts">
            <div className="contacts__list">
              <div
                className={
                  handleContacts
                    ? "smallScreenContacts maxContacts"
                    : "smallScreenContacts"
                }
              >
                {contacts.length > 0 &&
                  contacts.map((contact, i) => {
                    return (
                      <div
                        className="contacts-s"
                        key={i}
                        onClick={() => {
                          handleChatChange(contact);
                          setHandleContacts(false);
                        }}
                      >
                        {contact.isGroupChat ? (
                          <h3>{contact.chatName}</h3>
                        ) : (
                          <h3>
                            {currentUser._id !== contact.users[0]._id
                              ? contact.users[0].first_name
                              : contact.users[1].first_name}
                          </h3>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <button
              onClick={() => {
                setHandleContacts(!handleContacts);
              }}
            >
              <MdContacts />
            </button>
          </div>
          {/* <IoMdNotifications /> */}
          <Logout />
          <Avatar src={currentUser && currentUser.avatarImage} />
        </div>
      </div>

      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          loading={loading}
        />

        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            selectedChatCompare={selectedChatCompare}
            currentChat={currentChat}
            currentUser={currentUser}
            getChats={getChats}
            setCurrentChat={setCurrentChat}
          />
        )}
      </div>

      {showSearch && (
        <div className="search_box">
          <form
            onSubmit={(e) => {
              searchUser(e);
            }}
          >
            <div className="title">
              <h3>Search User</h3>

              <button className="close" onClick={() => setShowSearch(false)}>
                {" "}
                <IoClose />
              </button>
            </div>

            <input
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
              placeholder="Enter UserName"
            />

            <button type="submit">Search</button>
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
      )}

      <AddGroups
        setCurrentChat={setCurrentChat}
        contacts={contacts}
        setContacts={setContacts}
        handleChatChange={handleChatChange}
        setShowAddGroup={setShowAddGroup}
        showAddGroup={showAddGroup}
      />

      <ToastContainer />
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
    color: #fefefe;
    width: 90vw;
    background: var(--chat-primary);
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

      button {
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 50%;
        border: none;
        outline: none;
        background: #f7f5fa;
        cursor: pointer;
        color: #0b062c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .search {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.8rem;
      color: #e8e7ec;

      button {
        cursor: pointer;
      }
    }
  }

  .container {
    height: 85vh;
    width: 90vw;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 0 0 1.5rem 0;
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
    background: #14242f;
    border-radius: 2rem;
    padding: 3rem 5rem;
    color: white;
    box-shadow: var(--form-box-shd);

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      .title {
        button {
          background: none;
          position: absolute;
          right: 0;
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

      button {
        background: var(--form-button);
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

  .showContacts {
    display: none;
  }

  @media screen and (max-width: 800px) {
    .navbar {
      width: 100%;
      border-radius: 0;
    }

    .container {
      grid-template-columns: 100%;
      height: 100%;
      width: 100%;
      overflow: auto;
      border-radius: 0;
    }

    .brand h2 {
      display: none;
    }

    .showContacts {
      display: flex;
      place-items: center;
      position: relative;

      button {
        padding: 0.5rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        font-size: 1rem;
        border: none;
        cursor: pointer;
      }

      .contacts__list {
        position: relative;
      }

      .smallScreenContacts {
        transition: 0.3s ease-in-out;
        opacity: 0;
        visibility: hidden;
        height: 0;
        position: absolute;
        top: 1rem;
        z-index: 5000;
        left: 0;

        .contacts-s {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;

          h3 {
            padding: 0.5rem 2rem;
            width: 100%;
            background: white;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            opacity: 0;
            visibility: hidden;
            height: 0;
            z-index: 5000;
            cursor: pointer;
            color: black;
            font-size: 1rem;
            transition: 0.2s ease-in-out;
          }

          h3:hover {
            background: #400246;
            color: white;
          }
        }
      }

      .smallScreenContacts.maxContacts {
        height: auto;
        max-height: 50vh;
        opacity: 1;
        visibility: visible;
        transform: translateY(10px);
        background: #0b062c;
        padding: 0.5rem;
        border-radius: 0.5rem;
        overflow: auto;

        ::-webkit-scrollbar {
          display: none;
        }

        h3 {
          height: auto;
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
`;
