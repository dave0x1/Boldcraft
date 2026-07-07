import './heroSection.css';
import Polaroid from './polaroid.tsx';

export default function HeroSection(){
    return(
        <div className="hero">
            <div className="main">
                <div className="intro">
                    <h1>Boldcraft</h1>
                    <p id="by-timmy">By Timmy</p>
                    <p id="main-p">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid natus, nisi eos quaerat facilis tenetur cumque, incidunt, corrupti porro temporibus et non officia quasi suscipit soluta aut corporis eum quas?</p>
                    <div id="main-buttons">
                        <button className='button-primary'>View my work</button>
                        <button>Get in touch</button>
                    </div>
                </div>
                <div id="cards-container">
                    {/* <div className="cards">
                        <Polaroid src='../graphic/g5.jpg' alt='image 1' angle={-18} top={'70px'} left={'0px'} featured = {false} />
                        <Polaroid src='../graphic/g2.jpg' alt='image 2' angle={0} top={'20px'} left={'190px'} featured = {false} />
                        <Polaroid src='../graphic/g4.jpg' alt='image 3' angle={18} top={'70px'} left={'360px'} featured = {false} />
                    </div> */}
                </div>
                
            </div>
        </div>
    )
}