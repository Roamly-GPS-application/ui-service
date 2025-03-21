import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/HomePage.tsx'
import TestPage from './pages/TestPage.tsx'

function App() {

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  )
}

export default App
