import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [amount, setAmount] = useState(0);

    const createOrder = async (orderType) => {
        try {
            const response = await axios.post("http://localhost:5000", {
                orderType: orderType,
                amount: amount,
            });

            console.log(response);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="App">
            <input
                placeholder="amount"
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={() => createOrder("sell")}>Sell Order</button>
            <button onClick={() => createOrder("buy")}>Buy Order</button>
        </div>
    );
}

export default App;
