import React, { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router";
// logo
import logo from "../assets/logo.svg";

// error handlers visuals
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setAvatarRoute } from "../utils/APIroutes";

import Avatar from "@mui/material/Avatar";

import CircularProgress from "@mui/material/CircularProgress";

export const SetAvatar = () => {
  const [user, setUser] = useState({});
  const [selectedImage, setSeletedImage] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // error css
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("saashi-user")));
    if (!localStorage.getItem("saashi-user")) {
      navigate("/login");
    }
  }, []);

  const postImage = async (formData) => {
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dn2zbluhc/upload",
        formData
      );
      // console.log(response.data);
      setSelectedAvatar(response.data.url);
      setIsLoading(false);
      setDisable(true);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImage = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "saashi-chat");
    postImage(formData);
  };

  const setProfilePicture = async (e) => {
    e.preventDefault();
    if (selectedAvatar === undefined) {
      toast.error("Please Select an Aavatar", toastOptions);
      return;
    } else {
      const user = await JSON.parse(localStorage.getItem("saashi-user"));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: selectedAvatar,
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;

        localStorage.setItem("saashi-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Please Try Again", toastOptions);
      }
    }
  };

  return (
    <>
      <Container>
        <FormContainer>
          <form>
            <div className="brand">
              <img src={logo} alt="logo" />
              <h1>SAASHI</h1>
            </div>

            <div className="show__profile">
              <Avatar
                alt=""
                src={selectedAvatar !== undefined ? selectedAvatar : ""}
                sx={{ width: 150, height: 150 }}
              />
            </div>
            <h2 style={{ textAlign: "center" }}>{user.username}</h2>

            <input
              type="file"
              onChange={(e) => {
                setSeletedImage(e.target.files[0]);
              }}
            />

            {disable ? (
              selectedAvatar && (
                <button className="submitBTN" onClick={setProfilePicture}>
                  Set as Profile Picture
                </button>
              )
            ) : (
              <button
                disabled={selectedImage.length === 0 || isLoading}
                className="submitBTN"
                onClick={uploadImage}
              >
                {isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                  "Upload Picture"
                )}
              </button>
            )}
          </form>
        </FormContainer>
      </Container>

      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  padding-bottom: 5rem;
  background: var(--form-bg);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: #380917;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    background: var(--form-color);
    border-radius: 2rem;
    padding: 3rem 5rem;

    .show__profile {
      display: flex;
      justify-content: center;
    }

    input {
      background: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      color: black;
      width: max-content;
      max-width: 15rem;
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

      &:hover {
        background: #4e0eff;
      }
    }

    button:disabled {
      background: gray;
      cursor: default;
    }

    span {
      color: white;
      text-transform: uppercase;

      a {
        color: #40e0ff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }

  @media screen and (max-width: 800px) {
    form {
      width: 75%;
      padding: 2rem 2rem;
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    /* min-inline-size: 100%; */
    height: 50vh;
  }
`;
