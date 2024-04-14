import Board from '~/pages/Boards/_id'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'


function App() {
  return (
    <BrowserRouter>
      {/*  React Router Dom /boards/{board_id} */}
      <div>
        <Routes>
          {/* AUthentication page */}
          <Route path="/auth" element={<Auth />} />
          {/* Board Details */}
          <Route path="/boards" element={<Board />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
