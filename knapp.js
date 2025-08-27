const myButton = document.getElementById('touhou-knapp')
const output = document.getElementById('output')
const img = document.getElementById("suika")

// Load score or set to 0
let myVar = parseInt(localStorage.getItem("score")) || 0
let rotate_speed = 0   // degrees per second
let rotation = 0       // current angle in degrees
let rotations = 0
output.textContent = "Touhou clicks: " + myVar + " Varv: " + rotations

// Animation loop
let lastTime
function animate(time) {
  if (!lastTime) lastTime = time
  let delta = (time - lastTime) / 1000 // seconds since last frame
  lastTime = time

  rotation += rotate_speed * delta
  img.style.transform = `rotate(${rotation}deg)`
  if (rotation >= 360) {
    rotations++
    rotation -= 360  // keep rotation small
    console.log("One full rotation done! Total:", rotations)
  }
  output.textContent = "Touhou clicks: " + myVar + " Varv: " + rotations
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

// Button click increases score & speed
function onClickButton() {
  myVar++
  if (rotate_speed === 0) {
    rotate_speed = 10 // give it a starting push
  } else {
    rotate_speed *= 1.1 // make it 10% faster each click
  }
  localStorage.setItem("score", myVar)
}


myButton.addEventListener('click', onClickButton)
myButton.addEventListener('keydown', event => {
  if (event.key === "Enter" || event.key === " ") {
    onClickButton()
  }
})
