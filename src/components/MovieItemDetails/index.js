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

class MovieItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    genres: [],
    spokenLanguage: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    backgroundImage: data.backdrop_path,
    budget: data.budget,
    overview: data.overview,
    id: data.id,
    releaseDate: data.release_date,
    average: data.vote_average,
    count: data.vote_count,
    titleHeading: data.title,
    runtime: data.runtime,
    adultness: data.adult,
  })

  getFormattedDataSimilar = data => ({
    poster: data.poster_path,
    id: data.id,
    title: data.title,
  })

  getFormattedDataGenres = data => ({
    id: data.id,
    name: data.name,
  })

  getFormattedDataLanguage = data => ({
    id: data.id,
    englishName: data.english_name,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.movie_details)
      const updatedSimilarProductsData = fetchedData.movie_details.similar_movies.map(
        eachSimilarProduct => this.getFormattedDataSimilar(eachSimilarProduct),
      )
      const updatedGenres = fetchedData.movie_details.genres.map(
        eachSimilarProduct => this.getFormattedDataGenres(eachSimilarProduct),
      )
      const updatedLanguage = fetchedData.movie_details.spoken_languages.map(
        eachSimilarProduct => this.getFormattedDataLanguage(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
        genres: updatedGenres,
        spokenLanguage: updatedLanguage,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/du7dx5z0y/image/upload/v1708241158/alert-triangle_1_n3nn7r.png"
        alt="failure view"
        className="register-prime-img"
      />
      <p className="failure-paragraph">
        Something went wrong. Please try again
      </p>
      <button type="button" onClick={this.getProductData}>
        Try Again
      </button>
    </div>
  )

  renderProductDetailsView = () => {
    const {
      productData,
      genres,
      spokenLanguage,
      similarProductsData,
    } = this.state
    const {
      overview,
      budget,
      backgroundImage,
      releaseDate,
      average,
      count,
      titleHeading,
      runtime,
      adultness,
    } = productData
    const hours = (runtime / 60).toFixed() - 1
    const minutes = runtime % 60

    return (
      <div className="main-bg-container">
        <div
          className="home-container"
          style={{backgroundImage: `url(${backgroundImage})`}}
        >
          <Header />
          <div className="home-content">
            <h1 className="home-heading">{titleHeading}</h1>
            <div className="run-time-container">
              <p className="rating-value">
                {hours}h {minutes}m
              </p>
              {adultness ? (
                <p className="rating-value">A</p>
              ) : (
                <p className="rating-value adult">U/A</p>
              )}
            </div>
            <p className="home-description">{overview}</p>
            <button type="button" className="shop-now-button">
              Play
            </button>
          </div>
        </div>
        <div className="details-information-container">
          <div className="spoken-language-container">
            <h1 className="rating">genres</h1>
            <ul className="unOrder-list-genres">
              {genres.map(eachGenres => (
                <li key={eachGenres.id}>
                  <p className="rating-value">{eachGenres.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="spoken-language-container">
            <h1 className="rating">Audio Available</h1>
            <ul className="unOrder-list-genres">
              {spokenLanguage.map(eachSpokenLanguage => (
                <li key={eachSpokenLanguage.id}>
                  <p className="rating-value">
                    {eachSpokenLanguage.englishName}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="count-average-container">
            <h1 className="rating">Rating Count</h1>
            <p className="rating-value">{count}</p>
            <h1 className="rating">Rating Average</h1>
            <p className="rating-value">{average}</p>
          </div>
          <div className="budget-release-date">
            <h1 className="rating">Budget</h1>
            <p className="rating-value">{budget}</p>
            <h1 className="rating">Release Date</h1>
            <p className="rating-value">{releaseDate}</p>
          </div>
        </div>
        <h1 className="more-like-heading">More like this</h1>

        <ul className="popular-slider-container">
          {similarProductsData.map(moviesListItem => (
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

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-container">
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default MovieItemDetails
