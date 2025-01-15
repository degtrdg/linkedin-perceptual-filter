import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/feed*"],
  all_frames: false
}

interface PostData {
  userAndContext?: string
  actorName?: string
  actorDescription?: string
  text?: string
  reactions?: string
  comments?: string
  reposts?: string
}

function extractPosts() {
  console.log("Starting post extraction...")
  const postContainers = document.querySelectorAll("div.feed-shared-update-v2")
  console.log(`Found ${postContainers.length} post containers`)

  const result: PostData[] = []

  postContainers.forEach((container, index) => {
    console.log(`Processing post ${index + 1}...`)
    const data: PostData = {}

    // user + context info
    const header = container.querySelector<HTMLElement>(
      ".feed-shared-actor__title"
    )
    data.userAndContext = header?.innerText?.trim() || ""
    console.log(`User and context: ${data.userAndContext}`)

    // actor info
    const actorNameElement = container.querySelector<HTMLElement>(
      ".update-components-actor__title"
    )
    data.actorName = actorNameElement?.innerText?.trim() || ""
    console.log(`Actor name: ${data.actorName}`)

    const actorDesc = container.querySelector<HTMLElement>(
      ".feed-shared-actor__description"
    )
    data.actorDescription = actorDesc?.innerText?.trim() || ""
    console.log(`Actor description: ${data.actorDescription}`)

    // post text
    const textContent = container.querySelector<HTMLElement>(
      ".feed-shared-update-v2__description"
    )
    data.text = textContent?.innerText?.trim() || ""
    console.log(
      `Post text: ${data.text.substring(0, 50)}${data.text.length > 50 ? "..." : ""}`
    )

    // social metrics
    const socialCounts = container.querySelector<HTMLElement>(
      ".social-details-social-counts"
    )
    if (socialCounts) {
      console.log("Found social counts section")
      const spans = socialCounts.querySelectorAll("li")
      data.reactions = spans[0]?.innerText || ""
      data.comments = spans[1]?.innerText || ""
      data.reposts = spans[2]?.innerText || ""
      console.log(
        `Social metrics - Reactions: ${data.reactions}, Comments: ${data.comments}, Reposts: ${data.reposts}`
      )
    } else {
      console.log("No social counts section found")
    }

    result.push(data)
    console.log(`Finished processing post ${index + 1}`)
  })

  console.log("Post extraction complete")
  console.log("Extracted LinkedIn posts:", JSON.stringify(result, null, 2))
}

const observer = new MutationObserver(() => {
  console.log("DOM mutation detected, re-running extraction")
  extractPosts()
})

// Start observing once the feed is loaded
const startObserving = () => {
  console.log("Attempting to find feed...")
  const feed = document.querySelector('main[aria-label="Main Feed"]')
  if (feed) {
    console.log(
      "Feed found, starting initial extraction and setting up observer"
    )
    extractPosts()
    observer.observe(feed, {
      childList: true,
      subtree: true
    })
  } else {
    console.log("Feed not found, retrying in 1 second")
    setTimeout(startObserving, 1000) // retry after 1 second
  }
}

// Initialize
console.log("Initializing LinkedIn post extractor")
startObserving()

console.log("extract-posts.ts loaded")
