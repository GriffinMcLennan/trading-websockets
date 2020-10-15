const express = require("express");
const cors = require("cors");
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

//trading info
var buyBook = [];
var sellBook = [];

//routes
app.post("/", (req, res) => {
    const { orderType, price } = req.body;

    if ((orderType !== "buy" && orderType !== "sell") || price <= 0) {
        return res.status(400).send("Invalid order parameters");
    }

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

    res.send({ buyBook, sellBook });
});

io.on("connection", (socket) => {
    console.log("a user connected");
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
