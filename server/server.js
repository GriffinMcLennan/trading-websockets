const express = require("express");
const cors = require("cors");
const MatchingEngine = require("./MatchingEngine/MatchingEngine");
const Order = require("./MatchingEngine/Order");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 5000;

const {
    sortedAscendingInsert,
    sortedDescendingInsert,
} = require("./sortedInserts");

//middleware
app.use(express.json());
app.use(cors());

//socket.io connections
let connections = new Set();

//trading info
const ME = new MatchingEngine(io);

//routes
app.post("/", (req, res) => {
    const { uuid, orderType, amount, price } = req.body;

    if (
        (orderType !== "buy" && orderType !== "sell") ||
        price <= 0 ||
        amount <= 0
    ) {
        return res.status(400).send("Invalid order parameters");
    }

    const order = new Order(uuid, orderType, amount, price);
    ME.processOrder(order);

    /*
    //try to fulfill the order
    if (orderType === "buy") {
        sellBook = sellBook.filter((sellOrder) => sellOrder > price);
    } else if (orderType === "sell") {
        buyBook = buyBook.filter((buyOrder) => buyOrder < price);
    }

    //place what's left of the order into the corresponding book.
    if (orderType === "buy") {
        sortedDescendingInsert(buyBook, price);
    } else if (orderType === "sell") {
        sortedAscendingInsert(sellBook, price);
    }

    io.emit("FromAPI", { sellBook, buyBook });
    */

    res.status(200).send("Successfully handled order");
});

io.on("connection", (socket) => {
    console.log("A client connected to the websocket!");
    connections.add(socket);
    socket.emit("FromAPI", ME.generatePublicOrderBook());

    socket.on("disconnect", () => {
        console.log("A client disconnected to the websocket!");
        connections.delete(socket);
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
