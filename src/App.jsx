import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'


function App() {
  return (
    <Routes>
      <Route path='/' element={
        // use replace={true} to replace the current entry '/' in the history stack
        <Navigate to='/boards/660abc0ca0f6a402d723bfdc' replace={true} />
      } />

      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* 404 not found page */}
      {/* More 404 templates: https://tsparticles.github.io/404-templates/ */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
