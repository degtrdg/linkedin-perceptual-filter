import { nanoid } from "nanoid/non-secure"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"
import { createRoot } from "react-dom/client"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/feed*"],
  all_frames: false
}

// Cache for API responses and processed posts
const apiCache = new Map<string, boolean>()
const processedPosts = new Set<string>()
const storage = new Storage()

interface PostData {
  actorName?: string
  text?: string
  reactions?: string
  comments?: string
  reposts?: string
}

// Create a hash from post data to use as identifier
const createPostHash = (data: PostData): string => {
  return `${data.actorName}-${data.text?.slice(0, 100)}` // Using first 100 chars of text should be enough
}

// Mock API call with caching
const shouldBlockPost = async (postData: PostData): Promise<boolean> => {
  console.log("Checking if post should be blocked:", postData)

  // Create a hash of the post data to use as cache key
  const postHash = JSON.stringify(postData)

  // Check cache first
  if (apiCache.has(postHash)) {
    console.log("Found cached result for post")
    return apiCache.get(postHash)
  }

  console.log("No cache found, making API call")
  // Mock API call with random response
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  const shouldBlock = true //Math.random() > 0.5

  console.log("API response received, should block:", shouldBlock)
  // Cache the result
  apiCache.set(postHash, shouldBlock)

  return shouldBlock
}

const CoverElement: React.FC<{
  postId: string
  reason: string
  onUnmute: () => void
}> = ({ postId, reason, onUnmute }) => {
  console.log("Rendering cover element for post:", postId)
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10
      }}>
      <p style={{ marginBottom: "15px", textAlign: "center" }}>
        This post was hidden because: {reason}
      </p>
      <button
        onClick={onUnmute}
        style={{
          padding: "8px 16px",
          backgroundColor: "#0a66c2",
          color: "white",
          border: "none",
          borderRadius: "16px",
          cursor: "pointer"
        }}>
        Show Post
      </button>
    </div>
  )
}

function processPost(container: Element) {
  // Extract post data first
  const data: PostData = {}

  const actorNameElement = container.querySelector<HTMLElement>(
    ".update-components-actor__title"
  )
  data.actorName = actorNameElement?.innerText?.trim() || ""

  const textContent = container.querySelector<HTMLElement>(
    ".feed-shared-update-v2__description"
  )
  data.text = textContent?.innerText?.trim() || ""

  // Create unique identifier from post content
  const postHash = createPostHash(data)

  // Skip if we've already processed this post
  if (processedPosts.has(postHash)) {
    console.log("Post already processed, skipping:", postHash)
    return
  }

  console.log("Processing new post:", postHash)
  processedPosts.add(postHash)

  // Check if post should be blocked
  shouldBlockPost(data).then(async (shouldBlock) => {
    if (shouldBlock) {
      // Check if post is already unmuted
      const unmutedPosts = (await storage.get<string[]>("unmutedPosts")) || []

      if (!unmutedPosts.includes(postHash)) {
        console.log("Adding cover to post:", postHash)
        container.setAttribute("style", "position: relative;")

        const coverDiv = document.createElement("div")
        container.appendChild(coverDiv)

        const rootDiv = document.createElement("div")
        coverDiv.appendChild(rootDiv)

        const unmute = async () => {
          console.log("Unmuting post:", postHash)
          const unmutedPosts =
            (await storage.get<string[]>("unmutedPosts")) || []
          await storage.set("unmutedPosts", [...unmutedPosts, postHash])
          coverDiv.remove()
        }

        const reason = "Post contains potentially unwanted content"

        const root = createRoot(coverDiv)
        root.render(
          <CoverElement postId={postHash} reason={reason} onUnmute={unmute} />
        )
      }
    }
  })
}

// Set up observer
const observer = new MutationObserver((mutations) => {
  console.log("Mutation observed in feed")
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.matches("div.feed-shared-update-v2")) {
          processPost(node)
        }
        // Also check children
        node.querySelectorAll("div.feed-shared-update-v2").forEach(processPost)
      }
    })
  })
})

// Start observing
const startObserving = () => {
  console.log("Starting feed observation")
  const feed = document.querySelector('main[aria-label="Main Feed"]')
  if (feed) {
    console.log("Feed found, processing existing posts")
    // Process existing posts
    feed.querySelectorAll("div.feed-shared-update-v2").forEach(processPost)

    // Observe for new posts
    observer.observe(feed, {
      childList: true,
      subtree: true
    })
    console.log("Observer attached to feed")
  } else {
    console.log("Feed not found, retrying in 1s")
    setTimeout(startObserving, 1000)
  }
}

startObserving()
