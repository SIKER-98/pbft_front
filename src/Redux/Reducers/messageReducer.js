import messageOperations from "../Constants/messageOperations";
import {nodes, replyNode} from "../../Config/nodes";

const INITIAL_STATE = {
    selectedKey: "",
    keyList: [],
    replyHistory: [],

    nodeList: nodes
    //     [
    //     {
    //         address: "localhost",
    //         port: 7701,
    //         keyHistory: [],
    //     },
    //     {
    //         address: "localhost",
    //         port: 7702,
    //         keyHistory: [],
    //     },
    //     {
    //         address: "localhost",
    //         port: 7703,
    //         keyHistory: [],
    //     },
    //     {
    //         address: "localhost",
    //         port: 7704,
    //         keyHistory: [],
    //     }
    // ]
}

const messageReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case messageOperations.CLEAR_DATA:
            let newState1 = INITIAL_STATE
            newState1.nodeList.forEach(list => {
                list.keyHistory = []
            })
            return {
                ...newState1
            }

        case messageOperations.CLEAR_NODE_DATA:
            let newState = state
            newState.replyHistory = []
            newState.nodeList = INITIAL_STATE.nodeList
            newState.nodeList.forEach(list => {
                list.keyHistory = []
            })
            newState.selectedKey = ""
            return {
                ...newState
            }

        case messageOperations.GET_KEYS:
            return {
                ...state,
                keyList: action.item.keys,
                nodeList: INITIAL_STATE.nodeList
            }

        case messageOperations.GET_KEY_HISTORY:
            return {
                ...state,
                selectedKey: action.item.selectedKey,
                nodeList: action.item.nodeList
            }

        case messageOperations.SORT_BY_DATE:
            state.nodeList.forEach(node => {
                node.keyHistory = node.keyHistory.sort((a, b) => sortByData(a, b))
            })

            return {
                ...state
            }

        case messageOperations.SORT_BY_TYPE:
            state.nodeList.forEach(node => {
                node.keyHistory = node.keyHistory.sort((a, b) => a.type > b.type ? 1 : -1)
            })

            return {
                ...state
            }

        case messageOperations.CHANGE_STATUS:
            state.nodeList.forEach(node => {
                if (node.ip === action.item.ip && node.port === action.item.port) {
                    node.status = action.item.status
                }
            })
            return {
                ...state
            }

        default:
            return state
    }
}

const castData = (time) => {
    let data = time.split(":")

    const hour = Number(data[0])
    const min = Number(data[1])
    const sec = Number(data[2].substring(0, 2))
    const mSec = Number(data[2].slice(-4))

    console.log(hour)
    console.log(min)
    console.log(sec)
    console.log(mSec)


    return {
        hour, min, sec, mSec
    }
}

const sortByData = (a, b) => {
    const aTime = castData(a.time)
    const bTime = castData(b.time)

    if (aTime.hour !== bTime.hour)
        return aTime.hour > bTime.hour ? 1 : -1
    else if (aTime.min !== bTime.min)
        return aTime.min > bTime.min ? 1 : -1
    else if (aTime.sec !== bTime.sec)
        return aTime.sec > bTime.sec ? 1 : -1
    else
        return aTime.mSec > bTime.mSec ? 1 : -1

}


export default messageReducer
