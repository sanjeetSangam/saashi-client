import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { addChat, addGroups, allChats, searchUsers } from "../utils/APIroutes";
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
  const [groupPeople, setGroupPeople] = useState([]);
  const [groupName, setGroupName] = useState("");

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
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleValidation = () => {
    if (groupPeople.length < 2) {
      toast.error("2 or more users is required", toastOptions);
      return false;
    }
    return true;
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
        handleChatChange(data);
        //
      } catch (err) {
        console.log(err);
      }
    }
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
          listOfUsers={listOfUsers}
          setListOfUsers={setListOfUsers}
          showAddGroup={showAddGroup}
          setShowAddGroup={setShowAddGroup}
          searchChat={searchUser}
          setSearch={setSearch}
          setContacts={setContacts}
          setCurrentChat={setCurrentChat}
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

      {showAddGroup && (
        <div className="addGroup">
          <form onSubmit={searchUser}>
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
    background: #202c33;
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
    background: var(--chat-page);
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

  .showContacts {
    display: none;
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

    .addGroup {
      padding: 3rem 2rem;
      min-width: 70%;
      form {
        min-width: 100%;
      }
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
        opacity: 1;
        visibility: visible;
        transform: translateY(10px);
        background: #0b062c;
        padding: 0.5rem;
        border-radius: 0.5rem;

        h3 {
          height: auto;
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
`;
