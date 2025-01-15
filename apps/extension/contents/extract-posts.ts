import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/feed*"],
  all_frames: false
}

// interface PostData {
//   userAndContext?: string
//   actorName?: string
//   actorDescription?: string
//   text?: string
//   reactions?: string
//   comments?: string
//   reposts?: string
// }

// function extractPosts() {
//   const postContainers = document.querySelectorAll("div.feed-shared-update-v2")

//   const result: PostData[] = []

//   postContainers.forEach((container) => {
//     const data: PostData = {}

//     // user + context info
//     const header = container.querySelector<HTMLElement>(
//       ".feed-shared-actor__title"
//     )
//     data.userAndContext = header?.innerText?.trim() || ""

//     // actor info
//     const actorNameAnchor = container.querySelector<HTMLElement>(
//       ".feed-shared-actor__name"
//     )
//     data.actorName = actorNameAnchor?.innerText?.trim() || ""

//     const actorDesc = container.querySelector<HTMLElement>(
//       ".feed-shared-actor__description"
//     )
//     data.actorDescription = actorDesc?.innerText?.trim() || ""

//     // post text
//     const textContent = container.querySelector<HTMLElement>(
//       ".feed-shared-update-v2__description"
//     )
//     data.text = textContent?.innerText?.trim() || ""

//     // social metrics
//     const socialCounts = container.querySelector<HTMLElement>(
//       ".social-details-social-counts"
//     )
//     if (socialCounts) {
//       const spans = socialCounts.querySelectorAll("li")
//       data.reactions = spans[0]?.innerText || ""
//       data.comments = spans[1]?.innerText || ""
//       data.reposts = spans[2]?.innerText || ""
//     }

//     result.push(data)
//   })

//   console.log("Extracted LinkedIn posts:", JSON.stringify(result, null, 2))
// }

// const observer = new MutationObserver(() => {
//   extractPosts()
// })

// // Start observing once the feed is loaded
// const startObserving = () => {
//   const feed = document.querySelector(".core-rail")
//   if (feed) {
//     extractPosts()
//     observer.observe(feed, {
//       childList: true,
//       subtree: true
//     })
//   } else {
//     setTimeout(startObserving, 1000) // retry after 1 second
//   }
// }

// // Initialize
// startObserving()

console.log("extract-posts.ts")
