import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import TastoLogo from "../../assets/Tasto-logo.png";


const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
       
        <div className="footer-content-left">
            <img
  src={TastoLogo}
  alt="Tasto Logo"
  style={{ width: "80px", height: "auto", marginTop: "-40px" }}
/>



            <p>Tasto is your trusted food delivery partner, bringing your favorite meals right to your doorstep. Fast, fresh, and reliable every time.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>

        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+94-760765672 </li>
                <li>tasto@gmail.com</li>
            </ul>
            
        </div>
      </div>
      <hr />
      <p className="footer-copyright">copyright © 2025 tasto.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
