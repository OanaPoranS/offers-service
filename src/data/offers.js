const fs = require('node:fs/promises')

async function getStoredOffers() {
    const data = require('../offers.json')
    const storedOffers = data.userOffers ?? []
    return storedOffers
}

function storeOffers(offers) {
    return fs.writeFile('../offers.json', JSON.stringify({ userOffers: offers || [] }))
}

exports.getStoredOffers = getStoredOffers
exports.storeOffers = storeOffers
