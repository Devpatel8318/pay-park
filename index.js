const data = {
    name: 'dev',
    address: {
        street: 'gandhinagar link road',
    },
}

const {
    address: { street },
} = data
console.log(street)
