import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*", "https://www.google.com/*"]
}

window.addEventListener("load", () => {
  document.body.style.background = "pink"
})
