import './about.css'

export default function About(){
    return(
        <div className='about-section'>
            <div className="about-main">
                <div className="artist-img">
                    <img src="../me.jpg" alt="Timmy" className='img' />
                </div>
                <div className="about-artist">
                    <h3 id='about-the-artist'>About the artist</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quis dolor eius, ipsum nihil fugit esse soluta error eum, fugiat sint veritatis quo perferendis laborum, magnam sapiente natus porro vitae?
                    Architecto fugiat quae numquam, quisquam veniam molestias natus consequuntur, necessitatibus, consectetur quas iusto omnis deserunt doloribus cum est quibusdam quia. Temporibus voluptas, asperiores praesentium laudantium quos expedita rerum odio libero!</p>

                </div>
            </div>
        </div>
    )
}