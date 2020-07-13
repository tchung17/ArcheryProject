const { db } = require('../firebase/init')
const playerRef = db.collection('players')
const sessionRef = db.collection("sessions")


;(function main() {
	console.log(getPlayerNames('0G2PMJtOTdnTM8QT9T9w'))
})()
