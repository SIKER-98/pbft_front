import messageOperations from "../Constants/messageOperations";

const getKeys = (item) => ({
    type: messageOperations.GET_KEYS, item
})

const getKeyHistory = (item) => ({
    type: messageOperations.GET_KEY_HISTORY, item
})

const clearNodeData = () => ({
    type: messageOperations.CLEAR_NODE_DATA,
})

const clearData = () => ({
    type: messageOperations.CLEAR_DATA
})

const sortByType = () =>({
    type:messageOperations.SORT_BY_TYPE
})

const sortByDate = () =>({
    type:messageOperations.SORT_BY_DATE
})

const changeStatus = item =>({
    type:messageOperations.CHANGE_STATUS, item
})


export default {
    getKeys,
    getKeyHistory,
    clearNodeData,
    clearData,
    sortByType,
    sortByDate,
    changeStatus
}
