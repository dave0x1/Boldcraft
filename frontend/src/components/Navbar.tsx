import './navbar.css'
export default function Navbar(){

    return(
        <div className="nav-bar">
            <div className="icon-div">
                {/* <img src="../svg/a.svg" alt="" /> */}
            </div>
            <div className="links">
                <ul id="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Gallery</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>
    )
}