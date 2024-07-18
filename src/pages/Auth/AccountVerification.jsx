import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  let [searchParams] = useSearchParams()

  /**
   * take prarams (email and token) from URL
   * const email = searchParams.get('email')
   * const token = searchParams.get('token')
   */
  const { email, token } = Object.fromEntries([...searchParams])

  // create a state variable to know if the account has been verified or not. Default is false
  const [isVerified, setIsVerified] = useState(false)

  // call API to verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        // if the API call is successful, set verified to true
        setIsVerified(true)
      })
    }
  }, [email, token])

  // if there is no email or token in url, redirect to 404 page
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // if the account is not verified yet, show loading spinner
  if (!isVerified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  // Redirect to login page with verifiedEmail when the account is verified successfully
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification