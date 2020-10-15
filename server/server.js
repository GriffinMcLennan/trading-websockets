const express = require("express");
const app = express();
const port = 5000;

const {
    sortedAscendingInsert,
    sortedDescendingInsert,
} = require("./sortedInserts");

//middleware
app.use(express.json());

//trading info
var buyBook = [];
var sellBook = [];

//routes
app.post("/", (req, res) => {
    const { orderType, amount } = req.body;

    //try to fulfill the order

    //place what's left of the order into the corresponding book.
    if (orderType === "buy") {
        sortedAscendingInsert(buyBook, amount);
    } else if (orderType === "sell") {
        sortedDescendingInsert(sellBook, amount);
    } else {
        return res.status(400).send("Invalid order type");
    }

    res.send({ buyBook, sellBook });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
