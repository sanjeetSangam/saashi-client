import React, { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router";

// error handlers visuals
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// logo
import logo from "../assets/logo.svg";
import { loginRoute } from "../utils/APIroutes";

import { useDispatch } from "react-redux";
import { addUser } from "../redux/users/userAction";

export const Login = () => {
  // values input
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  // navigate
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // error css
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // checking the user has already login or not
  useEffect(() => {
    if (localStorage.getItem("saashi-user")) {
      navigate("/");
    }
  }, []);

  // handling the operations for submitting
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.message, toastOptions);
      }

      if (data.status === true) {
        localStorage.setItem("saashi-user", JSON.stringify(data.user));

        localStorage.setItem("saashi_token", data.token);

        dispatch(addUser(data));
        navigate("/");
      }
    }
  };

  // validating the input by the user
  const handleValidation = () => {
    const { password, username } = values;
    if (username === "") {
      toast.error("Username is required", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required", toastOptions);
      return false;
    }

    return true;
  };

  // handling all the input inside the input box to set the data for {values}
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <FormContainer>
        <form
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <div className="brand">
            <img src={logo} alt="logo" />
            <h1>SAASHI</h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            min={3}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit"> Login </button>

          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
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
    gap: 2rem;
    background: var(--form-color);
    border-radius: 2rem;
    padding: 3rem 5rem;

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
`;