const express = require("express");
const cors = require("cors");
const MatchingEngine = require("./MatchingEngine/MatchingEngine");
const Order = require("./MatchingEngine/Order");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 5000;

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
        typeof uuid !== "number" ||
        typeof orderType !== "string" ||
        typeof amount !== "number" ||
        typeof price !== "number" ||
        (orderType !== "buy" && orderType !== "sell") ||
        price <= 0 ||
        amount <= 0
    ) {
        console.log(typeof uuid);
        console.log(typeof orderType);
        console.log(typeof amount);
        console.log(typeof price);

        return res.status(400).send("Invalid order parameters");
    }

    console.time("time");
    const order = new Order(uuid, orderType, amount, price);
    ME.processOrder(order);
    console.timeEnd("time");
    res.status(200).send("Successfully handled order");
});

io.on("connection", (socket) => {
    console.log("A client connected to the websocket!");
    connections.add(socket);
    socket.emit("FromAPI", ME.generatePublicOrderBook());

    socket.on("disconnect", () => {
        console.log("A client disconnected from the websocket!");
        connections.delete(socket);
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
