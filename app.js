
// ? Mole
let moleElement = document.createElement("span")
moleElement.id = "mole"
let moleImage = document.createElement("img")
moleImage.src = "./images/mole.png"
moleElement.appendChild(moleImage)

// ? Other primary elements
let holes = document.querySelectorAll("li.hole")
let gamePanel = document.querySelector("div.game-panel")
let gameTimer = document.querySelector(".gameTimer")
let playBtn = document.querySelector(".play-button")

// ? Mole object
let mole  = {

    index: undefined,
    htmlElement: moleElement,

    setNextRandom() {
        let nextIndex = Math.floor(Math.random() * holes.length)
        let nextDelay = Math.floor(Math.random() * 4) + 1

        return {nextIndex,nextDelay}
    },

    addAtIndex(index) {
        holes[index].appendChild(this.htmlElement)
    },
    
    removeFromHtml() {
        this.htmlElement.remove()
    }
}


let running = false
const alottedTime = 20;

let remainingTimerID;
let moleTimeoutID;
let moleAnimationTimeoutID;
let remainingTime = alottedTime
let countDown = 3
let countDownTimerID;


let setPanelStyles = (active) => {
    if (active) {
        gamePanel.style.opacity = 1;
        playBtn.style.display = "none"
    } else {
        gamePanel.style.opacity = .2
        playBtn.style.display = "inline-block"
    }
}

function startGame() {
    running = true
    remainingTime = alottedTime
    let setTimer = (time) => gameTimer.textContent = `Time Remaining: ${time}`
    setTimer(remainingTime)
    
    remainingTimerID = setInterval(
        () => {
            remainingTime -= 1
            setTimer(remainingTime)
        },
        1000
    )
    let nextRandom = mole.setNextRandom()
    gameLoop(nextRandom.nextIndex,nextRandom.nextDelay)
}

let endGame = (win) => {
    running = false
    clearInterval(remainingTimerID)
    let message = win ?  "You Win!" : "You Lose"
    gameTimer.textContent = message
}

function gameLoop(nextIndex,nextDelay){
    if (running){
        moleTimeoutID = setTimeout(
            () => {
                mole.addAtIndex(nextIndex)
                
                moleAnimationTimeoutID = setTimeout(
                    () => {
                        mole.removeFromHtml()
                    let nextRandom = mole.setNextRandom()
                    gameLoop(nextRandom.nextIndex,nextRandom.nextDelay)    
                    },
                    1000
                )
            },
            nextDelay * 1000
        )

        if (remainingTime <= 0) {
            endGame(false)
            return
        }
    }
}

setPanelStyles(false)

playBtn.addEventListener("click",() => {
    setPanelStyles(true);
    
    let setCountDown = (time) => gameTimer.textContent = `Starting in ${time}`
    setCountDown(countDown)
    
    countDownTimerID = setInterval(
        () => {
            countDown -= 1
            if (!countDown <= 0) {
                setCountDown(countDown)
            } else {
                gameTimer.textContent = "GO!"
            }
    }, 1000)

    setTimeout(() => {
        clearInterval(countDownTimerID)
        startGame()
    },4000)
})

gamePanel.addEventListener("click", (event) => {
    let clickedHole = event.target.closest("li.hole")
    let found = clickedHole.querySelector("#mole")
    if (found) {
        endGame(true)
    }
})