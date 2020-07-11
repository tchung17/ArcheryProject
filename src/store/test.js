//take in array, setnumber
//return array of most recent set, without -1 / -2
function getSetArrowsFilled(arrows, setNumber) {
	let indices = (setNumber - 1) * 3
	return arrows.slice(indices, indices + 3).filter(arrow => {
		if (arrow == -1 || arrow == -2) {
			arrow = null
		}
		return arrow
	})
}
//take in array, setnumber
//return array of most recent set, with -1 / -2
function getSetArrowsSparse(arrows, setNumber) {
	let indices = (setNumber - 1) * 3
	return arrows.slice(indices, indices + 3)
}
//depends if set is completed
function getSetWinner(arrows1, arrows2) {
    if (!isSetCompleted(arrows1, arrows2)) {
        return -1
    }
    let indices = arrows1.indexOf(-1)
    let p1score = arrows1.slice(indices - 3, indices).reduce((score, arrow) => 
        score + arrow, 0
    )
    let p2score = arrows2.slice(indices - 3, indices).reduce((score, arrow) => 
        score + arrow, 0
    )
    if (p1score == p2score) {
        return 3
    } else if (p2score > p1score) {
        return 2
    } else if (p1score > p2score) {
        return 1
    }
}

function isSetCompleted(arrows1, arrows2) {
    let index1 = arrows1.indexOf(-1) //5 means 5 arrows shot
    let index2 = arrows2.indexOf(-2)
    if (index1 != index2) {
        return false
    }
    if (index1 % 3 != 0) {
        return false
    }
    return true
}
//searches for -1 or -2. Going to migrate to all -1 soon.
function getArrowsAverage(arrows, player) {
    let index = arrows.indexOf(-player)
    if (index == -1) {
        return arrows.reduce((score, arrow) => score + arrow / arrows.length, 0)
    }
	return arrows
		.slice(0, index)
		.reduce((score, arrow) => score + arrow / index, 0)
		.toFixed(2)
}

;(function main() {
    let test1 = [9, 8, 10, 8, 9, 10, 9, 10]
    let test2 = [9, 8, 10, 8, 9, 10, 1, 1]
	console.log(getArrowsAverage(test1, 1))
})()

export default {
    getSetArrowsFilled,
    getSetArrowsSparse,
    getSetWinner, 
    isSetCompleted,
    getArrowsAverage
}