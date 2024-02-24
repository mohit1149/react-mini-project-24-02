import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import PopularMovie from '../PopularMovie'
import Footer from '../Footer'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    searchValue: '',
    videoData: [],
  }

  componentDidMount() {
    this.getVideoData()
  }

  getFormattedData = data => ({
    id: data.id,
    title: data.title,
    poster: data.poster_path,
  })

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    const {searchInput} = this.state
    this.setState({searchValue: searchInput}, this.getVideoData)
  }

  onEnterClickSearch = event => {
    if (event.key === 'Enter') {
      const {searchInput} = this.state
      this.setState({searchValue: searchInput}, this.getVideoData)
    }
  }

  getVideoData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {searchValue} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (!response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachVideos =>
        this.getFormattedData(eachVideos),
      )
      this.setState({
        videoData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getFailureData = () => {
    this.setState({searchValue: ''}, this.getVideoData)
  }

  renderVideosFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/du7dx5z0y/image/upload/v1707403274/Background-Complete_c1nowd.png"
        alt="failure view"
      />
      <p className="failure-paragraph">
        Something went wrong. Please try again
      </p>
      <button type="button" onClick={this.getVideoData}>
        Try Again
      </button>
    </div>
  )

  renderVideosProgressView = () => (
    <div className="primedeals-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderVideosView = () => {
    const {videoData, searchValue} = this.state

    return (
      <>
        {videoData.length > 0 ? (
          <ul className="popular-slider-container">
            {videoData.map(eachVideoData => (
              <PopularMovie
                key={eachVideoData.id}
                productData={eachVideoData}
              />
            ))}
          </ul>
        ) : (
          <div className="not-found-container1">
            <img
              src="https://res.cloudinary.com/du7dx5z0y/image/upload/v1707403428/Group_7394_j7y8lg.png"
              alt="no movies"
            />
            <p className="not-found-paragraph">
              Your search for {searchValue} did not find any matches.
            </p>
          </div>
        )}
      </>
    )
  }

  renderVideoDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideosView()
      case apiStatusConstants.failure:
        return this.renderVideosFailureView()
      case apiStatusConstants.inProgress:
        return this.renderVideosProgressView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="search-bg-container">
        <Header />
        <div className="search-bg-container1">
          <div className="search-container">
            <input
              type="Search"
              placeholder="dsadsdsad"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onEnterClickSearch}
              className="input-search"
            />
            <button
              type="button"
              testid="searchButton"
              onClick={this.onClickSearchButton}
              className="search-button"
            >
              <HiOutlineSearch color="white" size="20" />
            </button>
          </div>
        </div>
        {this.renderVideoDetails()}
        <Footer />
        <p className="contact-paragraph">Contact us</p>
      </div>
    )
  }
}
export default Search
