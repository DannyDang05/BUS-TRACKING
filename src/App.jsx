import { useState } from 'react'
import Admin from './Admin/Admin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Admin/>
    </>
  )
}

export default App
