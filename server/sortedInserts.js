const sortedAscendingInsert = (list, amount) => {
    let low = 0;
    let high = list.length;

    while (low < high) {
        let mid = low + (high - low) / 2;

        if (list[mid] >= amount) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    list.splice(low, 0, amount);
};

const sortedDescendingInsert = (list, amount) => {
    let low = 0;
    let high = list.length;

    while (low < high) {
        let mid = low + (high - low) / 2;

        if (list[mid] <= amount) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    list.splice(low, 0, amount);
};

module.exports = { sortedAscendingInsert, sortedDescendingInsert };
