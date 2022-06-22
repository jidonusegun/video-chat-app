import React, { useContext, useState } from 'react';
import { Button, TextField, Grid, Container, Paper, Typography, Snackbar, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assessment, Phone, PhoneDisabled } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close'
import { SocketContext } from '../socketContext';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      width: '600px',
      margin: '35px 0',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: '10px 20px',
      border: '2px solid black',
    },
   }));

export default function Options({children}) {
    const { me, callAccepted, callEnded, name, setName, leaveCall, callUser } = useContext(SocketContext);

    const classes = useStyles();
    const [idToCall, setIdToCall] = useState('')

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };


    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper} >
                <form className={classes.root} noValidate autoComplete="off" >
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Account Info
                            </Typography>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                            />
                            <CopyToClipboard text={me} className={classes.margin} onCopy={() => handleClick()} >
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    startIcon={<Assessment fontSize="large" />} 
                                >
                                    Copy your ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                   
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Make a Call
                            </Typography>
                            <TextField
                                label="ID to call"
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                fullWidth
                            />
                            {callAccepted && !callEnded ? (
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    fullWidth 
                                    startIcon={<PhoneDisabled fontSize="large" />} 
                                    onClick={leaveCall}
                                    className={classes.margin}
                                >
                                    Hang Up
                                </Button> 
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    startIcon={<Phone fontSize="large" />}
                                    onClick={() => callUser(idToCall)} 
                                    className={classes.margin} 
                                >
                                    Call
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>

            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                autoHideDuration={6000}
                open={open}
                onClose={handleClose}
                message="Copied!!!"
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    )
}