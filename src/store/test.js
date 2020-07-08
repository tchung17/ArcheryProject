import db from "../firebase/init"
let testJSON =  {
  turn: 1,
  p1arrows: [10, 10, 9, 8, 10, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
  setNumber: 2,
  p1score: 0,
  p2score: 0,
}
let testStr = JSON.stringify({
  turn: 1,
  p1arrows: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
  setNumber: 1,
  p1score: 0,
  p2score: 0,
});
let ref = db.collection("sessions").doc("0GRe7jSbCgYOLDIyifbx")
let listener1 = ref.onSnapshot(doc => console.log(doc.data().meta))
let listener2 = ref.onSnapshot(doc => console.log(doc.data().meta))
(function main() {
  
})()
// (function main() {
//   let index1 = testJSON.p1arrows.indexOf(-1) //index 3, 4th arrow, works
//   // testJSON.p1arrows[index1] = 8 //works
//   let indices = (testJSON.setNumber - 1) * 3 //works
//   let p1SetDone = testJSON.p1arrows.slice(indices, indices + 3).indexOf(-1) //works
//   let p1score = testJSON.p1arrows.slice(indices, indices + 3).reduce((score, arrow) => score + arrow, 0) //works
//   console.log(testJSON)
//   //console.log(p1score)
//   //console.log(p1SetDone)
//   //console.log(indices)
// })()

