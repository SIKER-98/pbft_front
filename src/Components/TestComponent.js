import React, {useState} from "react";
import {Alert, AlertTitle, Button, Grid, TextField, Typography} from "@mui/material";
import {apiGetKeys} from "../Redux/Thunks/getKeys";
import messageActions from "../Redux/Actions/messageActions";
import {connect} from "react-redux";
import {apiGetHistory} from "../Redux/Thunks/getHistory";
import axios from "axios";
import {replyNode} from "../Config/nodes";

const TestComponent = (props) => {
    // metody do obslugi reduxa
    const {
        getKeys,
        getMessages,
        clearNodeData,
        clearData,
        sortByDate,
        sortByType,
        changeNodeStatus
    } = props

    // dane z reduxa
    const {messageReducer} = props

    const [sort, setSort] = useState("default")
    const [content, setContent] = useState('')


    const updateKeys = async () => {
        await getKeys()
        clearNodeData()
    }

    const updateMessages = async (key) => {
        await getMessages(key)
    }

    const getSeverity = (severity) => {
        switch (severity) {
            case 0:
                return {
                    severity: "error",
                    alertTitle: "REQUEST",
                }
            case 1:
                return {
                    severity: "warning",
                    alertTitle: "PRE-PREPARE",
                }
            case 2:
                return {
                    severity: "info",
                    alertTitle: "PREPARE",
                }
            case 3:
                return {
                    severity: "success",
                    alertTitle: "COMMIT",
                }
            case 4:
                return {
                    severity: "error",
                    alertTitle: "REPLY",
                }
            default:
                return {
                    severity: "error",
                    alertTitle: "REPLY",
                }
        }
    }

    const getHistoryBlock = (message, node) => {
        let {severity, alertTitle} = getSeverity(message.type)


        const direction = node?.address === message?.source?.address && node?.port === message?.source?.port ?
            "SEND" : "RECEIVE"

        const source = message.source
        const destination = message.destination
        const time = message.time

        if ((sort === "SEND" && direction === "RECEIVE")) {
            return (
                <></>
            )
        }

        if ((sort === "RECEIVE" && direction === "SEND")) {
            return (
                <></>
            )
        }

        return (
            <Alert severity={severity}>
                <AlertTitle>{direction} - {alertTitle}</AlertTitle>
                <Typography>FROM - {source?.address}:{source?.port}</Typography>
                <Typography>TO: - {destination?.address}:{destination?.port}</Typography>
                <Typography>TIME - {time}</Typography>
            </Alert>
        )
    }

    const sendRequest = async (node) => {
        console.log(replyNode)

        await axios.post(`https://${node.address}:${node.port}/request`, replyNode, {params: {content: content}})
            .then(res => {
                console.log('Request sending')
            })
            .catch(e => {
                console.log("ERROR with sending Request", e)
            })
    }

    const changeStatus = async (node) => {
        let status = node.status === 'normal' ? 'disabled' : 'normal'

        await axios.post(`https://${node.address}:${node.port}/status`, {}, {params: {status}})
            .then(() => {
                changeNodeStatus({
                    address: node.address,
                    port: node.port,
                    status: status
                })
            })
    }

    return (
        <div>
            <Typography>Send Request</Typography>
            <TextField label={"Content"}
                       variant={"outlined"}
                       onChange={(e) => {
                           setContent(e.target.value)
                       }}
            />

            <Typography>Send to:</Typography>
            <Grid container spacing={1}>
                {messageReducer.nodeList.map((node, index) => (
                    <Grid key={index} item>
                        <Button variant={"contained"}
                                fullWidth
                                onClick={() => changeStatus(node)}
                        >
                            Status: {node.status}
                        </Button>

                        <Button variant={"outlined"}
                                fullWidth
                                onClick={() => sendRequest(node)}
                        >
                            {node.address}:{node.port}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <hr/>

            <Button variant={"contained"} onClick={updateKeys}>GET KEYS</Button>
            <Button variant={"contained"} color={"secondary"} onClick={clearData}>RESET</Button>
            <hr/>
            <Typography variant={"h2"}>Keys:</Typography>

            {/*klucze*/}
            <Grid container spacing={2}>
                {messageReducer.keyList.map((key, index) => (
                    <Grid item key={index} xs={12}>
                        <Button color={'secondary'} variant={'contained'}
                                onClick={() => updateMessages(key)}>{key}</Button>
                    </Grid>
                ))}
            </Grid>

            <hr/>

            {/*filtry*/}
            <Grid container>
                <Grid item>
                    <Button color={"primary"}
                            variant={"contained"}
                            onClick={() => {
                                setSort("SEND")
                            }}>
                        SEND
                    </Button>
                </Grid>

                <Grid item>
                    <Button color={"success"}
                            variant={"contained"}
                            onClick={() => {
                                setSort("RECEIVE")
                            }}>
                        RECEIVE
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        color={"error"}
                        variant={"contained"}
                        onClick={() => {
                            setSort("ALL")
                        }}>
                        ALL MESSAGES
                    </Button>
                </Grid>

                <Grid item>
                    <Button color={"warning"}
                            onClick={sortByType}
                            variant={"contained"}>
                        Sort by TYPE
                    </Button>
                </Grid>

                <Grid item>
                    <Button color={"secondary"}
                            onClick={sortByDate}
                            variant={"contained"}>
                        Sort by DATE
                    </Button>
                </Grid>
            </Grid>

            <hr/>

            {/*messagi*/}
            <Typography variant={"h6"}>Messages of key: {messageReducer.selectedKey}</Typography>
            <Grid container spacing={2} justifyContent={'flex-start'} alignItems={'flex-start'}>
                {messageReducer.nodeList.map((node, index) => (
                    <Grid container item key={index} xs={3}>
                        <Typography variant={"h4"}>Node: {node.address}:{node.port}</Typography>

                        {node.keyHistory.map((history, index) => (
                            <Grid item xs={12} key={index}>
                                {getHistoryBlock(history, node)}
                            </Grid>
                        ))}

                        <hr/>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

const mapStateToProps = state => ({
    messageReducer: state.messageReducer
})

const mapDispatchToProps = dispatch => ({
    getKeys: () => dispatch(apiGetKeys()),
    getMessages: (key) => dispatch(apiGetHistory(key)),
    clearNodeData: () => dispatch(messageActions.clearNodeData()),
    clearData: () => dispatch(messageActions.clearData()),
    sortByDate: () => dispatch(messageActions.sortByDate()),
    sortByType: () => dispatch(messageActions.sortByType()),
    changeNodeStatus: (item) => dispatch(messageActions.changeStatus(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent)
