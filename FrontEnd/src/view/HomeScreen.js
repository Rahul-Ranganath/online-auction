//SJSU CS 218 Fall 2021 TEAM3
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import eAuctionAPI from '../Config';
import stacked from "../../src/images/stacked.svg"

const styleimg = {
  display: 'block',
  margin: 'auto',
  height: '50',
  width: '25'
}

function HomeScreen() {
  
  const history = useHistory()
  const [allItemsCards, setAllItemsCards] = useState([]);
  const [sellItemsCards, setSellItemsCards] = useState([]);
  const [userId, setUserId] = useState([]);  

  const onBidClicked = (card) => {
    localStorage.setItem("name", card.name)
    localStorage.setItem("description", card.description)
    localStorage.setItem("baseAmount", card.baseAmount)
    localStorage.setItem("s3ImageLink", card.s3ImageLink)
    localStorage.setItem("itemId", card.itemId)
    localStorage.setItem("userId", userId)
    history.push("/BidScreen")
    console.log("Bid button clicked")
  }

  function onSellClicked() {
    history.push("/SellScreen")
    localStorage.setItem("userId", userId)
    console.log("Sell Items button clicked")
  }

  function onUserClicked() {
    
    localStorage.setItem("userId", userId)
    console.log("User Profile button clicked")
    history.push("/UserProfile")
  }

  function onSignOutClicked() {   
    localStorage.clear()    
    console.log("Sign Out button clicked")
    history.push("/SignIn")
  }


  const onDeleteClicked = (card) =>{
    if (window.confirm('Are you sure you want to delete?')) {
      console.log("Deleting Item ",card.itemId);
      axios.get(`${eAuctionAPI}/delete/item/${card.itemId}`)
            .then(response => {
                alert("Item Deleted");
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert("Error in deleting item. Check logs for details")
            });
    }
  }

  useEffect(async () => {
    document.title = "eAuction"
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please Sign in to continue")
      history.push("/SignIn")
    }
    else{
    const uId = user['userId'];
    setUserId(uId)

    console.log("Retrieving all items from server for user : ", uId)    
    const response = await axios.get(`${eAuctionAPI}/retrieveData/${uId}`)
    console.log("Retrieved all items");
    console.log(response.data)
    setSellItemsCards(response.data.sellItemsList);
    setAllItemsCards(response.data.itemsList);
    console.log("Populated all cards on the screen")

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
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

  return (
    <div style={styleBg}>
      <CssBaseline />
      <main >
        <Box sx={{ bgcolor: 'background.paper', }}></Box>
        {/* Button to add items to Sell */}
        <br></br>
        <Grid item xs={14}>
          <div style={{ float: 'right' }}>
            <Button variant="contained" size="large" onClick={() => onSellClicked()}><b>Sell Items<br></br></b></Button>           
            <Button style={{ marginLeft: '.5rem' }} variant="contained" size="large"
              onClick={() => onUserClicked()}><b>User Profile<br></br></b></Button>
            <Button style={{ marginLeft: '.5rem' }} variant="contained" size="large"
              onClick={() => onSignOutClicked()}><b>Sign Out<br></br></b></Button>
          </div>
        </Grid>

        {/* My Items */}
        <Container sx={{ py: 2 }} maxWidth="md" height="10">
          <br></br><br></br>
          <h3 align="center">MY ITEMS</h3>
          <Grid container spacing={2}>
            {sellItemsCards.map((card) => (
              <Grid item key={card} xs={10} sm={10} md={3}>
                <Card style={{ backgroundColor: '#FAEBD7' }}
                  sx={{ height: '100%', display: 'block', flexDirection: 'column' }}>
                  <CardMedia
                    component="img" height="45%"
                    image={card.s3ImageLink}
                    alt="No image found" style={styleimg}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h7" fontWeight='bold' align="center">{card.name.toUpperCase()}</Typography>
                    <Typography lineHeight="1" overflow="auto" text-overflow="auto" maxHeight="3" maxWidth="5" paragraph>{card.description}</Typography>
                    <Typography>{"$" + card.baseAmount}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" size="small" disabled={true}><b>Bid</b></Button>
                    <Button variant="contained" style={{ marginLeft: '3rem' }} size="small" onClick={() => onDeleteClicked(card)}><b>Delete</b></Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* All Items */}
        <Container sx={{ py: 0 }} maxWidth="md" height="10">
          <h3 align="center"><br></br><br></br>ALL ITEMS</h3>
          <Grid container spacing={2}>
            {allItemsCards.map((card) => (
              <Grid item key={card} xs={100} sm={10} md={3}>
                <Card style={{ backgroundColor: '#DCDCDC' }}
                  sx={{ height: '100%', display: 'block', flexDirection: 'column' }}>
                  <CardMedia
                    component="img" height="40%"
                    image={card.s3ImageLink}
                    alt="No image found" style={styleimg}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h7" fontWeight='bold' align="center">{card.name.toUpperCase()}</Typography>
                    <Typography lineHeight="1" overflow="auto" text-overflow="auto" maxHeight="3" maxWidth="5" paragraph>{card.description}</Typography>
                    <Typography>{"$" + card.baseAmount}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" size="small" onClick={() => onBidClicked(card)}><b>Bid</b></Button>
                    
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>

  );
}

export default HomeScreen;