const touhou_knapp = document.getElementById('touhou-knapp')
const output = document.getElementById('output')
const leaderboard = document.getElementById('leaderboard')
const buttonWrapper = document.getElementById("buttonWrapper");
const cpsOutput = document.getElementById("cpsOutput");
const myButton = document.getElementById("submitNameBtn");

// Load score or set to 0
let myVar = parseInt(localStorage.getItem("score")) || 0
let rotate_speed = 0   // degrees per second
let rotation = 0       // current angle in degrees
let rotations = 0
let rotations_per_second
let decayRate = 0.15  // 10% per second
let clickTimes = []

const leaderboardContainer = document.getElementById("leaderboard");

async function updateLeaderboard() {
  try {
    const res = await fetch("/.netlify/functions/getLeaderboard");
    const data = await res.json();

    // Clear current leaderboard
    leaderboardContainer.innerHTML = "";

    // Display top 10
    data.forEach((entry, index) => {
      const div = document.createElement("div");
      div.textContent = `${index + 1}. ${entry.username} — ${entry.score}`;
      leaderboardContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
  }
}

// Update leaderboard on page load
updateLeaderboard();


output.textContent = "Touhou clicks: " + myVar + " Varv: " + rotations

const usernameInput = document.getElementById("usernameInput");
const submitNameBtn = document.getElementById("submitNameBtn");

submitNameBtn.addEventListener("click", () => {
  const username = usernameInput.value || "Player1"; // default if empty
  const score = myVar;

  submitScore(username, score); // your existing function
});


// Animation loop
let lastTime
let scale = 1
buttonWrapper.addEventListener('mousedown', () => scale = 0.95)
buttonWrapper.addEventListener('mouseup', () => scale = 1)
buttonWrapper.addEventListener('mouseleave', () => scale = 1)

function animate(time) {
  if (!lastTime) lastTime = time
  let delta = (time - lastTime) / 1000
  lastTime = time

  rotation += rotate_speed * delta
  rotate_speed *= Math.pow(1 - decayRate, delta)

  touhou_knapp.style.transform = `rotate(${rotation}deg)` // rotation only
  buttonWrapper.style.transform = `scale(${scale})`      // scale only

  rotations_per_second = rotate_speed/360
  if (rotation >= 360) {
    let completed = Math.floor(rotation / 360)
    rotations += completed
    rotation %= 360
  }
  output.textContent = myVar + " │ " + rotations + " │ " +  rotations_per_second.toFixed(3)

  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

// Button click increases score & speed
function onClickButton() {
  const now = Date.now() / 1000
  clickTimes.push(now)
  clickTimes = clickTimes.filter(t => now - t <= 1)
  const cps = clickTimes.length
  cpsOutput.textContent = `CPS: ${cps}`
  myVar++
  if (rotate_speed < 5) {
    rotate_speed = 10 // give it a starting push
  } else {
    rotate_speed *= 1.05 // make it 10% faster each click
  }
  localStorage.setItem("score", myVar)
}

const btn = document.querySelector('.dropdown-btn')
const content = document.querySelector('.dropdown-content')

btn.addEventListener('click', () => {
  if (content.style.display === 'block') {
    content.style.display = 'none'
    btn.textContent = 'Credits ▼'
  } else {
    content.style.display = 'block'
    btn.textContent = 'Credits ▲'
  }
})


const btnLeader = document.querySelector('.dropdown-btn-lead')
const contentLeader = document.querySelector('.dropdown-content-lead')

btnLeader.addEventListener('click', () => {
  if (contentLeader.style.display === 'block') {
    contentLeader.style.display = 'none'
    btnLeader.textContent = 'Leaderboard  ▼'
  } else {
    contentLeader.style.display = 'block'
    btnLeader.textContent = 'Leaderboard  ▲'
  }
})

function submitScore(username, score) {
  fetch("/.netlify/functions/appendScore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, score }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return res.json();
    })
    .then(data => console.log("Score submitted:", data))
    .catch(err => console.error("Error submitting score:", err));
}

touhou_knapp.addEventListener('click', onClickButton)
touhou_knapp.addEventListener('keydown', event => {
  if (event.key === "Enter" || event.key === " ") {
    onClickButton()
  }
})

