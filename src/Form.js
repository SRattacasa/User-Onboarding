import React, { useState } from "react";
import * as yup from "yup";
import axios from 'axios';

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email()
    .required("Email must follow standard format"),
  password: yup.string().required(),
  terms: yup
    .boolean()
    .oneOf(
      [true],
      "Please agree to the terms of use so we can sell your data."
    ),
});

const Form = (props) => {
  const [formState, setformState] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errorState, seterrorState] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  const [userState, setuserState] = useState([])

  const formSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    axios.post('https://reqres.in/api/users', formState)
    .then(response => {console.log(response)
        setuserState([...userState, response.data.name])})
    .catch(error => {console.log(error)})
  };

  const inputChange = (e) => {
    e.persist();
    validate(e);
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setformState({ ...formState, [e.target.name]: value });
  };

  const validate = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        seterrorState({
          ...errorState,
          [e.target.name]: "",
        });
      })
      .catch((err) => {
        console.log(err.errors);
        seterrorState({ ...errorState, [e.target.name]: err.errors[0] });
      });
  };

  return (
    <div className="Form">
        <p>{userState.map(u => <p>{u}</p>)}</p>
      <form onSubmit={formSubmit}>
        <label htmlFor="name">
          Name{" "}
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange}
          />
           {errorState.name.length > 0 ? (
            <p>{errorState.name} </p>
          ) : null}
        </label>
        <br></br>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={inputChange}
          />
          {errorState.password.length > 0 ? (
            <p>{errorState.password} </p>
          ) : null}
        </label>
        <br></br>
        <label htmlFor="email">
          Email address{" "}
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={inputChange}
          />
          {errorState.email.length > 0 ? <p>{errorState.email} </p> : null}
        </label>
        <br></br>
        <label htmlFor="terms">
          {" "}
          Terms and Conditions Acceptance{" "}
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formState.terms}
            onChange={inputChange}
          />
           {errorState.terms.length > 0 ? (
            <p>{errorState.terms} </p>
          ) : null}
        </label>

        <p>
          <button type="submit">SUBMIT BUTTON</button>
        </p>
      </form>
    </div>
  );
};

export default Form;
