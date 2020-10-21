import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import socketIOClient from "socket.io-client";
import OrderBook from "./Components/OrderBook";

const ENDPOINT = "http://localhost:5000";

function App() {
    const [price, setPrice] = useState(0);
    const [buyBook, setBuyBook] = useState([]);
    const [sellBook, setSellBook] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", (data) => {
            //console.log(data);
            setBuyBook(data.returnBuyBook);
            setSellBook(data.returnSellBook);
        });

        //can send our socket info with socket.id

        return () => socket.disconnect();
    }, []);

    const createOrder = async (orderType) => {
        try {
            //backend should be doing the parsing.
            const response = await axios.post("http://localhost:5000", {
                uuid: 10,
                orderType: orderType,
                price: parseInt(price),
                amount: 20,
            });

            //setBuyBook(response.data.buyBook);
            //setSellBook(response.data.sellBook);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="App">
            <div className="order">
                <input
                    placeholder="price"
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button onClick={() => createOrder("sell")}>Sell Order</button>
                <button onClick={() => createOrder("buy")}>Buy Order</button>
            </div>

            <div className="orderbooks">
                <OrderBook ordersType="Buy Book" orderData={buyBook} />
                <OrderBook ordersType="Sell Book" orderData={sellBook} />
            </div>
        </div>
    );
}

export default App;
