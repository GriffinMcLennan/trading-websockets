class Transaction {
    constructor(
        buyerUUID,
        sellerUUID,
        buyerAmount,
        sellerProfit,
        transactionPrice
    ) {
        this.buyerUUID = buyerUUID;
        this.sellerUUID = sellerUUID;
        this.buyerAmount = buyerAmount;
        this.sellerProfit = sellerProfit;
        this.transactionPrice = transactionPrice;
    }
}

module.exports = Transaction;
