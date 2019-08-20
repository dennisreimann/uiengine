import React, { useState } from 'react'

export default () => {
  const [count, setCount] = useState(0)

  return (
    <section>
      <article>
        <h1>{count}</h1>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </article>
    </section>
  )
}
