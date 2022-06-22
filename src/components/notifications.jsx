import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { SocketContext } from '../socketContext';

export default function Notifications() {
    const { call, callAccepted, answerCall } = useContext(SocketContext);

    return (
        <>
            {call.isReceiverCall && !callAccepted && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h1>{call.name} is calling: </h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            )}
        </>
    )
}