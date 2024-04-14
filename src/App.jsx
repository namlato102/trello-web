import Board from '~/pages/Boards/_id'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
      {/*  React Router Dom /boards/{board_id} */}
      <div>
        <Routes>
          {/* Board Details */}
          <Route path="/boards" element={<Board />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
