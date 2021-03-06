import React, { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router";
// logo
import logo from "../assets/logo.svg";

// error handlers visuals
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// route
import { setAvatarRoute } from "../utils/APIroutes";

// mui imports
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

// component
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

  // check if user id logged in or not by local storage if not, then send to login page at first
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("saashi-user")));
    if (!localStorage.getItem("saashi-user")) {
      navigate("/login");
    }
  }, []);

  // get form data and sent to function to upload image to cloudinary
  const uploadImage = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "saashi-chat");
    postImage(formData);
  };

  // function to upload in clodinary
  const postImage = async (formData) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_IMAGE_LINK,
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

  // final step to setAvatar url to database in mongodb
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

      // check if the avatar is set then, send to login page
      if (data.isSet) {
        toast.success("User Created", toastOptions);
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;

        localStorage.removeItem("saashi-user", JSON.stringify(user));
        navigate("/login");
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
      color: var(--form-h1);
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
    box-shadow: var(--form-box-shd);

    .show__profile {
      display: flex;
      justify-content: center;
    }

    input {
      background: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      color: var(--form-input);
      width: max-content;
      max-width: 15rem;
      font-size: 1rem;
      border-radius: 1rem 0;

      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    h2 {
      color: var(--form-h1);
    }

    button {
      background: var(--form-button);
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
