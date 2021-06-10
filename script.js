window.saveDataAcrossSessions = true // Save calibrations

const MAIN_CONTAINER = document.querySelector("main")
const LOOK_DELAY = 1000 // 1 second
const LEFT_CUTOFF = window.innerWidth / 4
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4

let startTimestamp = Number.POSITIVE_INFINITY
let lookDirection = null
let imageElement = getNewImage()
let nextImageElement = getNewImage(true)

webgazer
  .setGazeListener((data, timestamp) => {
    if (data == null || lookDirection === "STOP") return

    if (
      data.x < LEFT_CUTOFF &&
      lookDirection !== "LEFT" &&
      lookDirection !== "RESET"
    ) {
      startTimestamp = timestamp
      lookDirection = "LEFT"
    }
    if (
      data.x > RIGHT_CUTOFF &&
      lookDirection !== "RIGHT" &&
      lookDirection !== "RESET"
    ) {
      startTimestamp = timestamp
      lookDirection = "RIGHT"
    }
    if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) { // No direction
      startTimestamp = Number.POSITIVE_INFINITY
      lookDirection = null
    }

    if (startTimestamp + LOOK_DELAY < timestamp) {
      imageElement.classList.add(lookDirection.toLowerCase())

      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = "STOP"
      setTimeout(() => {
        imageElement.remove()
        nextImageElement.classList.remove("next")
        imageElement = nextImageElement
        nextImageElement = getNewImage(true)
        lookDirection = "RESET" // Look back to center to swipe again
      }, 200)
    }
  })
  .begin()

webgazer
  .showVideoPreview(false) // No webcam preview
  .showPredictionPoints(false) // No look location dot

function getNewImage(next = false) {
  const img = document.createElement("img")
  img.src = `https://picsum.photos/1000?${Math.random()}` // Anti-cache for random picsum photo
  if (next) img.classList.add("next")
  MAIN_CONTAINER.append(img)
  return img
}
