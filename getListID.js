let token = 'token'
let key = 'key'
let id = 'boardID'
let url = `https://api.trello.com/1/boards/${id}/lists/?key=${key}&token=${token}`
const request = require('request')
const fs = require('fs')

request(url, {
	json: true
}, (err, res, body) => {
	if (err) {
		return console.log(err)
	} else {
		let trello = Object.assign({}, body)
		trello = JSON.stringify(trello);
		fs.writeFileSync('json/listasQuadro.json', trello);
	}
});