import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from './pages/Boards/Boards'

/**
 * Clean Code solution in determining which routes need to be logged in to access
 * use <Outlet /> to render child routes
 * https://reactrouter.com/en/main/components/outlet
 * https://www.robinwieruch.de/react-router-private-routes/
 */
// avoid user to access board page when they are not logged in
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

// avoid user to access login/register page when they are already logged in
const UnauthorizedRoute = ({ user }) => {
  if (user) {
    return <Navigate to='/' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path='/' element={
        // use replace={true} to replace the current entry '/' in the history stack
        // <Navigate to='/boards/660abc0ca0f6a402d723bfdc' replace={true} />
        <Navigate to='/boards' replace={true} />
      } />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />

        {/* Board List */}
        <Route path='/boards' element={<Boards />} />

        {/* User settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      <Route element={<UnauthorizedRoute user={currentUser} />}>
        {/* Authentication */}
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<AccountVerification />} />
      </Route>

      {/* 404 not found page */}
      {/* More 404 templates: https://tsparticles.github.io/404-templates/ */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
