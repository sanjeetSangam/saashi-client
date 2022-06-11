import axios from "axios";
import React, { useState } from "react";
import { addGroups, searchUsers } from "../utils/APIroutes";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import { Avatar } from "@mui/material";
import styled from "styled-components";

export const AddGroups = ({
  setContacts,
  contacts,
  setCurrentChat,
  handleChatChange,
  setShowAddGroup,
  showAddGroup,
}) => {
  const [groupPeople, setGroupPeople] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState(null);
  const [listOfUsers, setListOfUsers] = useState([]);

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
    box-shadow: var(--form-box-shd);

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
      background: var(--form-button);
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

  @media screen and (max-width: 800px) {
    .addGroup {
      padding: 3rem 2rem;
      min-width: 70%;
      form {
        min-width: 100%;
      }
    }
  }
`;
