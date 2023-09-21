//SJSU CS 218 Fall 2021 TEAM3
import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import youBidAPI from '../Config';
import wave from "../../src/images/waves.svg"
import stacked from "../../src/images/stacked.svg"

const success="SUCCESS";
const duplicate="DUPLICATE BID";
const theme = createTheme();


const BidScreen = () => {

    const history = useHistory();
    const [name, setItemName] = useState('');
    const [description, setItemDesc] = useState('');
    const [baseAmount, setItemPrice] = useState('');
    const [s3ImageLink, setImageUrl] = useState('');
    const [userId, setUserId] = useState([]);
    const [itemId, setItemId] = useState([]);
    const [user, setUser] = useState([]);
    const [bidItemAmount, setBidItemAmount] = useState([]);


    useEffect(() => {
        document.title = "eAuction"
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please Sign in to continue")
            history.push("/SignIn")
        }
        else {
            const name = localStorage.getItem("name");
            const description = localStorage.getItem("description");
            const baseAmount = localStorage.getItem("baseAmount");
            const s3ImageLink = localStorage.getItem("s3ImageLink");
            const userId = localStorage.getItem("userId");
            const itemId = localStorage.getItem("itemId");
            const user = localStorage.getItem("user");
            console.log("user ID :", userId);
            console.log("item ID :", itemId);
            console.log("User : ", user);

            setItemName(name);
            setItemDesc(description);
            setItemPrice(baseAmount);
            setImageUrl(s3ImageLink);
            setUserId(userId);
            setItemId(itemId);
            setUser(user);
        }
    }, [])


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submit Clicked")
        const formData = new FormData(event.currentTarget);
        let itemDetails = {
            userId: userId,
            bidItemAmount: parseInt(formData.get('bidItemAmount'), 10),
        }
        console.log("Bit Item details : ", itemDetails)

        axios.post(`${youBidAPI}/bidItem/${itemId}`, itemDetails)
            .then(response => {
                console.log("response : ", response);
                if (response.data === success)
                    alert("Successfuly placed the bid");
                else if (response.data === duplicate)
                    alert("Error in placing bid : Duplicate Bid");
                else
                    alert("Error in placing bid. Check logs for details");
                history.push("/HomeScreen")
            })
            .catch(err => {
                console.log(err);
                alert("Error in placing bid. Check logs for details")
                history.push("/HomeScreen")
            });
    }
    

    const isFormValid = () => {
        console.log("bid amount : ", bidItemAmount)
        if (bidItemAmount < 1) {
            return false;
        }
        if (!bidItemAmount.match(/^\d{1,9}(\.\d{0,2})?$/)) {
            return false;
        }
        return true;
    }

    const back = () => {
        history.push("/HomeScreen")
        console.log("routing to homescreen")
    }
    const styleBg = {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${stacked})`
    }
    return (
        <div style={styleBg}>
            <ThemeProvider theme={theme}  >
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <CssBaseline />
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <img src={s3ImageLink} width="100%" height="100%"></img>
                            <br></br><br></br>
                            <Grid container spacing={1} >
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Item Name"
                                        name="name"
                                        autoComplete="name"
                                        value={name}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="desc"
                                        label="Description"
                                        name="desc"
                                        value={description}
                                        autoFocus
                                        multiline
                                        minRows="2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        value={baseAmount}
                                        type="text"
                                        id="baseAmount"
                                        label="Minimum Bid Amount"
                                        name="minAmount"
                                        autoComplete="minAmount"
                                        autoFocus
                                    >
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        onChange={(e) => setBidItemAmount(e.target.value)}
                                        id="bidItemAmount"
                                        label="Enter Bid"
                                        name="bidItemAmount"
                                        autoComplete="bidItemAmount"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={!isFormValid()}
                                    >
                                        Place Bid
                                    </Button>
                                    <Button onClick={back}>back</Button>
                                </Grid>

                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default BidScreen;