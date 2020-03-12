let token = 'token'
let key = 'key'
let id = 'idList'
let url = `https://api.trello.com/1/lists/${id}/actions/?key=${key}&token=${token}`
const request = require('request')
const fs = require('fs')
let array = []

let membrosID = fs.readFileSync('json/membrosQuadro.json')
membrosID = JSON.parse(membrosID)

const membroCard = (idMembers) => {
	let result = new Array()
	//console.log(idMembers[0])
	for (let i in membrosID) {
		if (idMembers == membrosID[i].id) {
			result.push(membrosID[i].fullName)
		}
	}
	return result
}

const convertData = (data) => {

	data = new Date(data)
	let dia = ("0" + data.getDate()).slice(-2)
	let mes = ("0" + (data.getMonth() + 1)).slice(-2)
	let ano = data.getFullYear()

	let hora = ("0" + data.getHours()).slice(-2)
	let minuto = ("0" + data.getMinutes()).slice(-2)

	let date = `${dia}/${mes}/${ano} às ${hora}:${minuto}`
	return date
}

request(url, {
	json: true
}, (err, res, body) => {
	if (err) {
		return console.log(err)
	} else {
		let trello = Object.assign({}, body)
		console.log(trello)

		for (let i in trello) {
			//console.log(trello[i].idMembers);
			if (trello[i].idMembers != []) {
				let idAction = trello[i].id
				let dateCreate = convertData(new Date(1000 * parseInt(idAction.substring(0, 8), 16)))

				let dateLastUpdate = convertData(new Date(trello[i].date).toString())

				let membro = membroCard(trello[i].idMemberCreator)

				array.push({
					nome: trello[i].type,
					membro,
					data: dateCreate,
					dateLastUpdate
				})
			}
		}

		let json2xls = require('json2xls')
		let xls = json2xls(array)
		fs.writeFileSync('xls/listaActionsCards.xls', xls, 'binary');
	}
});