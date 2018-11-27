const cheerio = require('cheerio')

function parseItem(body) {
    const $ = cheerio.load(body);

	return new Promise((resolve, reject) => {
        resolve({
            description: $('h1')[0].children[0].data
        })
	})
}

module.exports = {
    parseItem
}