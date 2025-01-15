import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Welcome to your{" "}
        <a
          href="https://www.linkedin.com"
          target="_blank"
          className="text-blue-600 underline hover:text-blue-800">
          LinkedIn
        </a>{" "}
        Extension!
      </h2>
      <input
        onChange={(e) => setData(e.target.value)}
        value={data}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <a
        href="https://docs.plasmo.com"
        target="_blank"
        className="text-blue-600 underline hover:text-blue-800">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
