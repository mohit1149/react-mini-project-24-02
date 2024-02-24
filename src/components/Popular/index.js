import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import PopularMovie from '../PopularMovie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
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

    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
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
      }))
      this.setState({
        moviesList: updatedData,
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
    return (
      <div className="main-bg-container" testid="popular">
        <Header />
        <ul className="popular-slider-container">
          {moviesList.map(moviesListItem => (
            <PopularMovie
              productData={moviesListItem}
              key={moviesListItem.id}
            />
          ))}
        </ul>
        <Footer />
        <p className="contact-paragraph">Contact us</p>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/du7dx5z0y/image/upload/v1707403274/Background-Complete_c1nowd.png"
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
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#D81F21" height="50" width="50" />
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

export default Popular
