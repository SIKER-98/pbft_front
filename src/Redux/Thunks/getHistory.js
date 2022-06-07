import axios from 'axios'
import messageActions from "../Actions/messageActions";

export const apiGetHistory = (key) =>
    async (dispatch, getState) => {
        const messageReducer = getState().messageReducer
        let nodeHistoryList = []

        messageReducer.nodeList.forEach((node) => {
            axios.get(`https://${node.address}:${node.port}/history/records`, {params: {key: key}})
                .then(data => {
                    console.log(`getHistory - get from ${node.address}:${node.port} - ${data.data.length}`)

                    let historyNode = node
                    historyNode.keyHistory = data.data

                    nodeHistoryList.push(historyNode)

                    dispatch(messageActions.getKeyHistory({selectedKey: key, nodeList: nodeHistoryList}))
                })
                .catch(e => {
                    console.log('getHistory PROBLEM', e)
                    // dispatch(messageActions.clearNodeData())
                    dispatch(messageActions.getKeyHistory({selectedKey:key, nodeList:nodeHistoryList}))
                })
        })

    }
