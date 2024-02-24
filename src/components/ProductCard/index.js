import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import './index.css'

const MoviesSlider = props => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }
  const {productData} = props

  return (
    <>
      <Slider {...settings}>
        {productData.map(eachLogo => {
          const {id, poster, title} = eachLogo
          return (
            <Link to={`/movies/${id}`} className="slick-item">
              <img className="logo-image" src={poster} alt={title} />
            </Link>
          )
        })}
      </Slider>
    </>
  )
}

export default MoviesSlider
