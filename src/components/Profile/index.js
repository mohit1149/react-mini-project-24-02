import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Profile = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="bg-main-profile-container">
      <Header />
      <div className="bg-profile-container">
        <h1>Account</h1>
        <hr />
        <div className="paragarph-container">
          <p>Member ship</p>
          <div className="id-container">
            <p>rahul@gmail.com</p>
            <div className="paragraph-setting">
              <p>Password</p>
              <p> : ********* </p>
            </div>
          </div>
        </div>
        <hr />
        <div className="paragraph-setting">
          <p>Plan details</p>
          <p className="span-first">Premium </p>
          <p className="span-second">Ultra HD</p>
        </div>
        <hr />
        <div className="button-container">
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
      <p className="contact-paragraph">Contact us</p>
    </div>
  )
}
export default Profile
