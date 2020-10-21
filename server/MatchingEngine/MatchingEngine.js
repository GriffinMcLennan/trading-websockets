const {
    sortedAscendingInsert,
    sortedDescendingInsert,
} = require("./sortedInserts");
const Order = require("./Order");
const Transaction = require("./Transaction");

class MatchingEngine {
    constructor(io) {
        this.buyBook = [];
        this.sellBook = [];
        this.socketIO = io;
    }

    processOrder(order) {
        const buyBook = this.buyBook;
        const sellBook = this.sellBook;
        console.log("buyBook:", buyBook);
        console.log("sellBook:", sellBook);

        if (order.type === "buy") {
            this.processBuyOrder(order);
        } else if (order.type === "sell") {
            this.processSellOrder(order);
        }

        this.socketIO.emit("FromAPI", this.generatePublicOrderBook());
    }

    processBuyOrder(buyOrder) {
        //try to fulfill order
        let transactions = [];
        let i = 0;
        const sellBook = this.sellBook;

        while (
            i < sellBook.length &&
            buyOrder.amount > 0 &&
            buyOrder.price >= sellBook[i].price
        ) {
            let sellOrder = sellBook[i];

            let amountToTransfer = Math.min(buyOrder.amount, sellOrder.amount);
            let sellerProfit = amountToTransfer * buyOrder.price;

            transactions.push(
                new Transaction(
                    buyOrder.userUUID,
                    sellOrder.userUUID,
                    amountToTransfer,
                    sellerProfit
                )
            );

            buyOrder.amount -= amountToTransfer;
            sellOrder.amount -= amountToTransfer;

            if (sellOrder.amount === 0) {
                sellBook.shift();
            } else {
                i++;
            }
        }

        if (buyOrder.amount > 0) {
            console.log("Inserting Order into buyOrders:", buyOrder);
            sortedDescendingInsert(this.buyBook, buyOrder);
        }

        console.log(transactions);
    }

    processSellOrder(sellOrder) {
        let transactions = [];
        let i = 0;
        const buyBook = this.buyBook;

        while (
            i < buyBook.length &&
            sellOrder.amount > 0 &&
            sellOrder.price <= buyBook[i].price
        ) {
            let buyOrder = buyBook[i];

            console.log(sellOrder.price, buyBook[i].price);
            console.log(sellOrder.price <= buyBook[i].price);

            const amountToTransfer = Math.min(
                sellOrder.amount,
                buyOrder.amount
            );

            const sellerProfit = amountToTransfer * sellOrder.price;

            transactions.push(
                new Transaction(
                    buyOrder.userUUID,
                    sellOrder.userUUID,
                    amountToTransfer,
                    sellerProfit
                )
            );

            buyOrder.amount -= amountToTransfer;
            sellOrder.amount -= amountToTransfer;

            if (buyOrder.amount === 0) {
                buyBook.shift();
            } else {
                i++;
            }
        }

        if (sellOrder.amount > 0) {
            console.log("Inserting Order into SellOrders:", sellOrder);
            sortedAscendingInsert(this.sellBook, sellOrder);
        }

        console.log(transactions);
    }

    generatePublicOrderBook() {
        const buyBook = this.buyBook;
        const sellBook = this.sellBook;

        const returnBuyBook = buyBook.map((order) => ({
            price: order.price,
            amount: order.amount,
        }));

        const returnSellBook = sellBook.map((order) => ({
            price: order.price,
            amount: order.amount,
        }));

        return { returnBuyBook, returnSellBook };
    }
}

module.exports = MatchingEngine;

/*
const ME = new MatchingEngine();

const o1 = new Order(1, "sell", 0.5, 10000);
const o2 = new Order(2, "sell", 0.5, 11000);
const o3 = new Order(3, "sell", 0.5, 12000);
const o4 = new Order(4, "buy", 1.5, 14000);

console.time("time");
ME.processOrder(o1);
ME.processOrder(o2);
ME.processOrder(o3);
ME.processOrder(o4);
console.timeEnd("time");
*/
