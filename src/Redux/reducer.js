import {combineReducers} from "redux";
import messageReducer from "./Reducers/messageReducer";

const rootReducer = combineReducers({
    messageReducer:messageReducer
})

export default rootReducer
