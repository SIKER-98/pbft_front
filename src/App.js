import React from "react";
import TestComponent from "./Components/TestComponent";
import {Provider} from "react-redux";
import store from "./Redux/store";


function App() {
    return (
        <Provider store={store}>
            <div>
                <TestComponent/>
            </div>
        </Provider>
    );
}

export default App;
