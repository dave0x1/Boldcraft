import { useState } from 'react'
import './navbar.css'

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);


    return(
        <div className="nav-bar">
            <div className="icon-div">
                {/* <img src="../svg/a.svg" alt="" /> */}
            </div>
            {/* Hamburger Trigger Button */}
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Sliding Nav Links Menu */}
        <ul className={`links ${isOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="#gallery" onClick={() => setIsOpen(false)}>Gallery</a></li>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
        </ul>
        </div>
    )
}