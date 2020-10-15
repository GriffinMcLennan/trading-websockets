import React from "react";
import "./OrderBook.css";

function orderBook({ ordersType }) {
    return (
        <div className="orderbook">
            <h1>{ordersType}</h1>
        </div>
    );
}

export default orderBook;
