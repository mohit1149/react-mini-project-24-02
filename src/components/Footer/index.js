import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <ul className="bg-main-container">
    <li>
      <FaGoogle size="20" className="footer-icon" />
    </li>
    <li>
      <FaTwitter size="20" className="footer-icon" />
    </li>
    <li>
      <FaInstagram size="20" className="footer-icon" />
    </li>
    <li>
      <FaYoutube size="20" className="footer-icon" />
    </li>
  </ul>
)

export default Footer
