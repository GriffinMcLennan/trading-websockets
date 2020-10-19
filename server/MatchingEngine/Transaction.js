class Transaction {
    constructor(buyerUUID, sellerUUID, buyerAmount, sellerProfit) {
        this.buyerUUID = buyerUUID;
        this.sellerUUID = sellerUUID;
        this.buyerAmount = buyerAmount;
        this.sellerProfit = sellerProfit;
    }
}

module.exports = Transaction;
