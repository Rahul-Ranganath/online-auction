//SJSU CS 218 Fall 2021 TEAM3
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import eAuctionAPI from '../Config';
import stacked from "../../src/images/stacked.svg"
import { margin } from "@mui/system";

export default function UserProfile() {
 
  const [bidRows, setBidRows] = useState([])
  const [sellRows, setSellRows] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const history = useHistory()

  
  useEffect(async () => {
    document.title = "eAuction"
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please Sign in to continue")
      history.push("/SignIn")
    }
    else{
    const userId = localStorage.getItem("userId");
    console.log("User ID from home : ", userId)
    const resp_user = await axios.get(`${eAuctionAPI}/user/${userId}`)
    console.log("resp user", resp_user.data)
    const fullName = resp_user.data.firstName + " " + resp_user.data.lastName
    const email = resp_user.data.email
    setName(fullName)
    setEmail(email)
    const resp_items = await axios.get(`${eAuctionAPI}/allItems`)
    console.log("resp items", resp_items.data)
    const bidItems = resp_user.data.bidItems.split(',');
    const sellItems = resp_user.data.sellItems.split(',');
    const bidPrices = []
    const sellPrices = []
    const temp_prices = resp_user.data.bidItemAmount.split(',')
    temp_prices.forEach(element => {
      bidPrices.push(parseInt(element))
    })
    const bidItem_names = []
    const sellItem_names = []
    const bidStatuses = []
    const items = resp_items.data
    for (let i = 0; i < bidItems.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (bidItems[i] == items[j].itemId) {
          bidItem_names.push(items[j].name)
          if(items[j].expired){
            if (bidPrices[i] == items[j].highestBid) {
              bidStatuses.push("Won")
            }
            else {
              bidStatuses.push("Lost")
            }
          }
          else{
            bidStatuses.push("Pending")
          }
          
        }

      }
    }
    for (let i = 0; i < sellItems.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (sellItems[i] == items[j].itemId) {
          sellItem_names.push(items[j].name)
          sellPrices.push(items[j].baseAmount)
        }
      }
    }
    //const sellItems = ['r','g','t']
    const bidRow = []
    for (let i = 0; i < bidItem_names.length; i++) {
      var a = { Sl_No: i + 1, bidItem: bidItem_names[i], bidPrice: bidPrices[i], bidStatus: bidStatuses[i] }
      bidRow.push(a)
    }
    const sellRow = []
    for (let i = 0; i < sellItem_names.length; i++) {
      var a = { Sl_No: i + 1, sellItem: sellItem_names[i], sellPrice: sellPrices[i] }
      sellRow.push(a)
    }
    setBidRows(bidRow)
    setSellRows(sellRow)
  }
  }, [])


  const styleBg = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: 'auto',
    height: 'auto',
    backgroundImage: `url(${stacked})`
  }

  function onHomeClicked() {
    console.log("Home button clicked")
    history.push("/HomeScreen")
  }


  return (
    <div style={{backgroundImage: `url(${stacked})` }}>     
      <div className="profile-info">
      <Button style={{ float: 'right', marginRight:20}} variant="contained" size="large" onClick={() => onHomeClicked()}><b>HOME</b></Button>
        <h3><b>NAME:</b>  {name}</h3>
        <h3><b>EMAIL:</b> {email}</h3>                
      </div>
      
      <h4 className="table-title"  style={{  marginRight:180}} >My Bids</h4>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell h1 align="center"><b>SERIAL NUMBER</b></TableCell>
              <TableCell h1 align="center"><b>BID ITEMS</b></TableCell>
              <TableCell h1 align="center"><b>BID PRICE</b></TableCell>
              <TableCell h1 align="center"><b>BID STATUS</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bidRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {row.Sl_No}
                </TableCell>
                <TableCell align="center">{row.bidItem}</TableCell>
                <TableCell align="center">{row.bidPrice}</TableCell>
                <TableCell align="center">{row.bidStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <br></br><br></br><br></br><br></br><br></br>
        </Table>
      </TableContainer>
      
      <h4 className="table-title" style={{  marginRight:180}} >My Sale Items</h4>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
            <TableCell h1 align="center"><b>SERIAL NUMBER</b></TableCell>
              <TableCell h1 align="center"><b>ITEM</b></TableCell>
              <TableCell h1 align="center"><b>MINIMUM AMOUNT</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {row.Sl_No}
                </TableCell>
                <TableCell align="center">{row.sellItem}</TableCell>
                <TableCell align="center">{row.sellPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    
  );

}
