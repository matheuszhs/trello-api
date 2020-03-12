let token = 'token'
let key = 'key'
let id = 'boardID'
let url = `https://api.trello.com/1/boards/${id}/cards/all?key=${key}&token=${token}`
// 5cb75d00487cd94a2ecaed22 - Matheus
let idMembro = 'idMembro'
const request = require('request')
let array = []
let mesCard = "08"

const fs = require('fs')
let quadrosID = fs.readFileSync('json/listasQuadro.json')
quadrosID = JSON.parse(quadrosID)
quadrosID = Object.values(quadrosID)

let membrosID = fs.readFileSync('json/membrosQuadro.json')
membrosID = JSON.parse(membrosID)
membrosID = Object.values(membrosID)

const nomeLista = (idList) => {
	let nome = quadrosID.filter(function(e){
		if (idList == e.id) {
			return e
		}
	});
	return nome[0].name
}

const isMes = e => {
	//console.log(e)
	let dateCreate = convertData(new Date(1000 * parseInt(e.id.substring(0, 8), 16)))
	
	if(dateCreate.substring(3, 5) == mesCard){
		return e
	}	
}

const isMembro = e => e.idMembers.includes(idMembro)

const membroCard = (idMembers) => {
	let result = new Array()
	//console.log(idMembers[0])
	membrosID.map(function(e){
		if (idMembers[0] == e.id) {
			result.push(e.fullName)
		}
		if (idMembers[1] == e.id) {
			result.push(e.fullName)
		}
	})
	return result
}

const pegarCard = e => {

	let dateCreate = convertData(new Date(1000 * parseInt(e.id.substring(0, 8), 16)))
	let dateLastUpdate = convertData(new Date(e.dateLastActivity).toString())
	let lista = nomeLista(e.idList)
	let membros = membroCard(e.idMembers)
	let result =  {
		nome: e.name,
		lista,
		membros,
		data: dateCreate,
		dateLastUpdate
	} 
	return result;
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
		trello = Object.values(trello)

		array = trello.filter(isMembro).filter(isMes).map(pegarCard)

		array.sort(function (a, b) {
			if (a.data < b.data) {
				return -1
			}
			if (a.data > b.data) {
				return 1
			}
			return 0
		});

		//console.log(array)
		//console.log(membrosID)
		let json2xls = require('json2xls')
		let xls = json2xls(array)
		fs.writeFileSync(`xls/listaCards_${mesCard}.xlsx`, xls, 'binary');

		let trelloJS = JSON.stringify(array);
		fs.writeFileSync(`json/listaCards_${mesCard}.json`, trelloJS);
	}
});