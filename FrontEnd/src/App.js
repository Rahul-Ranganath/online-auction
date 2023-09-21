//SJSU CS 218 Fall 2021 TEAM3

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import  {BrowserRouter , Route}  from 'react-router-dom';
import Login from "./view/Login";
import SignUp from "./view/Signup";
import UserProfile from './view/UserProfile';
import HomeScreen from "./view/HomeScreen"
import BidScreen from "./view/BidScreen"
import SellScreen from "./view/SellScreen"

function App() {
  return (
    <div className="App">
       <Route exact path='/' component={Login} />
       <Route path="/SignIn" component={Login} />
       <Route path="/SignUp" component={SignUp} />
       <Route path="/UserProfile" component={UserProfile} />
       <Route path="/HomeScreen" component={HomeScreen}></Route>
       <Route path="/BidScreen" component={BidScreen}></Route>
       <Route path="/SellScreen" component={SellScreen}></Route>

    </div>
  );
}

export default App;
