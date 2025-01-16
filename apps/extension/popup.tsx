import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  const [result, setResult] = useState("")

  return (
    <div style={{ height: "200px", width: "200px" }}>
      <button
        onClick={async () => {
          console.log("Sending message")
          const response = await sendToBackground({
            name: "categorize-post",
            body: {
              text: "Hello, world!"
            }
          })
          console.log(response)
          setResult(response.category)
        }}>
        Categorize Post
      </button>

      <div id="result">{result}</div>
    </div>
  )
}

export default IndexPopup
