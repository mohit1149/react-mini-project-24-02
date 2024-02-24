import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Trending from '../Trending'
import Originals from '../Originals'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(product => ({
        poster: product.poster_path,
        title: product.title,
        id: product.id,
        backDropPath: product.backdrop_path,
        overview: product.overview,
      }))
      const randomNumber = Math.floor(Math.random() * updatedData.length)
      const randomMovie = updatedData[randomNumber]
      this.setState({
        moviesList: randomMovie,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderPrimeDealsListView = () => {
    const {moviesList} = this.state
    const {title, backDropPath, overview} = moviesList

    return (
      <div className="main-bg-container">
        <div
          className="home-container"
          style={{backgroundImage: `url(${backDropPath})`}}
        >
          <Header />

          <div className="home-content">
            <h1 className="home-heading">{title}</h1>
            <h1 className="home-description">{overview}</h1>

            <button type="button" className="shop-now-button">
              Play
            </button>
          </div>
        </div>
        <div className="slider-container">
          <h1 className="home-heading-trending">Trending Now</h1>
          <Trending />
          <h1 className="home-heading-trending">Originals</h1>
          <Originals />
        </div>
        <Footer />
        <p className="contact-paragraph">Contact us</p>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <div className="failure-bg-container">
      <Header />
      <div className="failure-view-container">
        <img
          src="https://res.cloudinary.com/du7dx5z0y/image/upload/v1708241158/alert-triangle_1_n3nn7r.png"
          alt="failure view"
          className="register-prime-img"
        />
        <p className="failure-paragraph">
          Something went wrong. Please try again
        </p>
        <button type="button" onClick={this.getPrimeDeals}>
          Try Again
        </button>
      </div>
      <div className="slider-container">
        <h1 className="home-heading-trending">Trending Now</h1>
        <Trending />
        <h1 className="home-heading-trending">Originals</h1>
        <Originals />
      </div>
      <Footer />
      <p className="contact-paragraph">Contact us</p>
    </div>
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Home
