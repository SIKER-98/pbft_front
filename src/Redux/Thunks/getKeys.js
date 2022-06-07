import axios from 'axios'
import messageActions from "../Actions/messageActions";

export const apiGetKeys = () =>
    async (dispatch, getState) => {
        const messageReducer = getState().messageReducer
        let keys = []

        messageReducer.nodeList.forEach((node) => {
                axios.get(`https://${node.address}:${node.port}/history/key`)
                    .then(data => {
                        console.log(`getKeys - get from ${node.address}:${node.port} - ${data.data.length}`)

                        data.data.forEach(key => {
                            if (!keys.includes(key)) {
                                keys.push(key)
                            }
                        })
                        dispatch(messageActions.getKeys({keys: keys}))
                    })
                    .catch(e => {
                        console.log('getKeys PROBLEM', e)
                        // dispatch(messageActions.clearData())
                    })

            }
        )
    }


