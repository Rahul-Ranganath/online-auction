//SJSU CS 218 Fall 2021 TEAM3
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import eAuctionAPI from '../Config';

export default function Login() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
    document.title = "eAuction"
    const history = useHistory();

    function setUser(userData) {
        localStorage.setItem("user", JSON.stringify(userData))
        console.log("setting user in local storage :", JSON.stringify(userData))
        history.push("/HomeScreen")
    }

    const OnLogin = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')
        const pwd = data.get('password')
        const response = await axios.get(`${eAuctionAPI}/login/${email}/${pwd}`)//need to discuss how to check if email exists in our db and if corresponding pwd is input

        axios.get(`${eAuctionAPI}/login/${email}/${pwd}`)
            .then(response => {
                console.log("Printing user from response: ", response.data)
                if(response.data.userId){
                setUser(response.data)
                history.push("/HomeScreen")
                }
                else{
                    alert("Invalid credentials. Please try again")
                }
            })
            .catch(err => {
                console.log(err);
                alert(err)
            });

    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/signIn"}>Sign in</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/signUp"}>Sign up</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="wrap-form">
                <div className="form-inner">
                    <form onSubmit={OnLogin}>
                        <h3>Sign In</h3>

                        <div className="my-form">
                            <label>Email address</label>
                            <input type="email" id="email" name="email" className="form-control" placeholder="Enter email" required />
                        </div>

                        <div className="my-form">
                            <label>Password</label>
                            <input type="password" id="password" name="password" className="form-control" placeholder="Enter password" required />
                        </div>
                        <div className="sign-button">
                            <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                        </div>
                        <p className="account text-right">
                            Don't have an account? <a href="/signUp">Sign Up!</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
