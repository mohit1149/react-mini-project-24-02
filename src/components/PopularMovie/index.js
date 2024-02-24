import {Link} from 'react-router-dom'
import './index.css'

const PopularMovie = props => {
  const {productData} = props
  const {poster, title, id} = productData
  return (
    <li>
      <Link to={`/movies/${id}`} className="movie-item">
        <img src={poster} alt={title} className="popular-poster" />
      </Link>
    </li>
  )
}

export default PopularMovie
