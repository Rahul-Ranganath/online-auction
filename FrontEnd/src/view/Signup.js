//SJSU CS 218 Fall 2021 TEAM3
import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import youBidAPI from '../Config';
const success = "SUCCESS";
const failure = "FAILURE";

const Signup = () => {
    document.title = "eAuction"
    const history = useHistory();
    const onSignup = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let itemDetails = {
            email: data.get('email'),
            password: data.get('password'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            bidItems: "N/A",
            sellItems: "N/A",
            bidItemAmount: "N/A",
            bidsWon: "N/A"
        }
        axios.post(`${youBidAPI}/registerUser`, itemDetails)
            .then(response => {
                if (response.data === success) {
                    console.log("Registration successful");
                    history.push("/signIn")
                }
                else if (response.data === failure){
                    alert("Registration failed : email already exists");
                    
                }
                else
                    alert("Error during registration. Check logs for details");
                console.log("response.data :",response.data)
            })
            .catch(err => {
                console.log("Error from catch :",err);
                alert(err)
            });
        console.log("data ", itemDetails);
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
                    <form onSubmit={onSignup} >
                        <h3>Sign Up</h3>

                        <div className="my-form">
                            <label>First name</label>
                            <input type="text" id="firstName" name="firstName" className="form-control" placeholder="First name" required />
                        </div>

                        <div className="my-form">
                            <label>Last name</label>
                            <input type="text" id="lastName" name="lastName" className="form-control" placeholder="Last name" />
                        </div>

                        <div className="my-form">
                            <label>Email address</label>
                            <input type="email" id="email" name="email" className="form-control" placeholder="Enter email" required />
                        </div>

                        <div className="my-form">
                            <label>Password</label>
                            <input type="password" id="password" name="password" className="form-control" placeholder="Enter password" required />
                        </div>

                        <div className="sign-button">
                            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                        </div>
                        <p className="account text-right">
                            Already registered? <a href="/signIn">Sign In!</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );

}
export default Signup;

