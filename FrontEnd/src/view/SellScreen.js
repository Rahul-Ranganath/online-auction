//SJSU CS 218 Fall 2021 TEAM3
import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import S3FileUpload from 'react-s3'
import eAuctionAPI from '../Config';
import stacked from "../../src/images/stacked.svg"

const theme = createTheme();

const config = {
    bucketName: 'eauction-images',
    region: 'us-west-1',
    accessKeyId: 'AKIAQK34O2JKP46PBXWY',
    secretAccessKey: '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'
}

const SellScreen = () => {
    const history = useHistory();

    useEffect(() => {
        document.title = "eAuction"
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please Sign in to continue")
            history.push("/SignIn")
        }
    }, [])

    

    const [itemName, setName] = useState('');
    const [itemDesc, setDesc] = useState('');
    const [baseAmount, setBaseAmount] = useState('');
    const [localImageUrl, setLocalImageUrl] = useState('');
    const [file, setFile] = useState('');
    const [s3ImageLink, setS3ImageLink] = useState('');
    const [userId, setUserId] = useState([]);
    
    console.log("User ID : ", localStorage.getItem("userId"));
    


    const back = () => {
        history.push("/HomeScreen")
        console.log("routing to homescreen")
    }

    const imageStyle = {
        "marginLeft": '45%'
    }

    const uploadImage = (event) => {
        setFile(event.target.files[0]);        
        const localImg = URL.createObjectURL(event.target.files[0])
        setLocalImageUrl(localImg)
        console.log("uploaded to local : ", localImg)
    };

    const isFormValid = () => {
        if (!file || !itemName || !itemDesc || !baseAmount) {            
            return false;
        }
        if (!baseAmount.match(/^\d{1,9}(\.\d{0,2})?$/)) {
            return false;
        }
        return true;       

    }
    const styleBg = {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${stacked})`
    }

    const handleSellItem = async (event) => {
        event.preventDefault();
        console.log(event.currentTarget);
        const formData = new FormData(event.currentTarget);
        if (isFormValid()) {
            console.log("uploading to S3 for config ",config)   
            S3FileUpload.uploadFile(file, config)
                .then((data) => {
                    console.log("uploaded to S3 at URL : ", data.URL)                
                    setS3ImageLink(data.location)
                    console.log("uploaded to S3 at : ", data.location)

                    // send POST req to API

                    let itemDetails = {
                        name: formData.get('name'),
                        description: formData.get('description'),
                        baseAmount: formData.get('baseAmount'),
                        highestBid: formData.get('baseAmount'),
                        highestBidder: "N/A",
                        s3ImageLink: data.location,
                        creationTime: "N/A"
                    }
                    const userid = localStorage.getItem("userId");
                    console.log("Item Details : ", itemDetails);
                    console.log(`${eAuctionAPI}/sellItem/${userId}`);
                    axios.post(`${eAuctionAPI}/sellItem/${userid}`, itemDetails)
                        .then(response => {
                            console.log(response)
                            history.push("/HomeScreen")
                        })
                        .catch(err => {
                            console.log(err);
                            alert(err)
                            history.push("/HomeScreen")
                        });
                    alert("Successfuly added item to sell")
                    history.push("/HomeScreen")
                })
                .catch((err) => {
                    alert(err)
                })

            console.log("Submit Clicked")
        }        
    }

    return (
        <div style={styleBg}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <CssBaseline />
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Box component="form" onSubmit={handleSellItem} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                    <div>Upload image</div>
                                    <br></br><br></br>
                                    <input
                                        type="file"
                                        id="file"
                                        accept="image/*"
                                        onChange={uploadImage}
                                    />
                                    <img src={localImageUrl} width="300" height="300"></img>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Item Name"
                                        name="name"
                                        autoComplete="name"
                                        //value={itemName}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        autoFocus
                                        multiline
                                        minRows="2"
                                        onChange={(e) => setDesc(e.target.value)}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="none"
                                        required
                                        fullWidth
                                        type="number" step="0.1"
                                        id="baseAmount"
                                        label="Minimum Bid Amount"
                                        name="baseAmount"
                                        autoComplete="baseAmount"
                                        autoFocus
                                        onChange={(e) => setBaseAmount(e.target.value)}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={!isFormValid()}
                                    >
                                        Sell Item
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

export default SellScreen;