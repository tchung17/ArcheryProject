
function getSetArrows(arrows) {
    let index1 = Math.floor((arrows.length - 1) / 3) * 3
    let index2 = index1 + 3 > arrows.length ? arrows.length : index1 + 3
	return arrows.slice(index1, index2)
}
function destructure(arrows) {
    return arrows.reduce((result, arrow, index) => {
        const chunkIndex = Math.floor(index / 3)
        if (!result[chunkIndex]) {
            result[chunkIndex] = {}
            result[chunkIndex][`Set ${chunkIndex + 1}`] = [] 
        }
        if (arrow == 10) {
            result[chunkIndex][`Set ${chunkIndex + 1}`].push(`${arrow}` + "\xa0")
        } else {
            result[chunkIndex][`Set ${chunkIndex + 1}`].push(`${arrow}` + "\xa0\xa0")
        }
        return result 
    }, [])
}
function getSetArrowsFilled(arrows, setNumber) {
    let index1 = (setNumber - 1) * 3
    let index2 = index1 + 3 > arrows.length ? arrows.length : index1 + 3
	return arrows.slice(index1, index2)
}
function getSetWinner(arrows1, arrows2) {
    if (!isSetCompleted(arrows1, arrows2)) {
        return - 1
    }
    let p1score = getSetArrows(arrows1).reduce((score, arrow) => 
        score + arrow, 0
    )
    let p2score = getSetArrows(arrows2).reduce((score, arrow) => 
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
    let index1 = arrows1.length //5 means 5 arrows shot
    let index2 = arrows2.length
    if (index1 != index2) {
        return false
    }
    if (index1 % 3 != 0) {
        return false
    }
    return true
}
function getArrowsAverage(arrows) {
	return parseFloat(arrows
		.reduce((score, arrow) => score + arrow / arrows.length, 0)
		.toFixed(2))
}
;(function main() {
    let test1 = [9, 8, 10, 8, 9, 9]
    let test2 = [9, 8, 10, 8, 9]
	console.log(destructure(test1))
})()

export default {
    getSetArrowsFilled,
    getSetWinner, 
    destructure,
    isSetCompleted,
    getArrowsAverage,
}