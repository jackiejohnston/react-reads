import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Books from './Books'
import './App.css'

class BooksApp extends React.Component {

  state = {
    books: [],
    shelves: [
      {
        title: "Currently Reading",
        id: "currentlyReading"
      },
      {
        title: "Want to Read",
        id: "wantToRead"
      },
      {
        title: "Read",
        id: "read"
      }
    ],
    query: "",
    searchResults: []
  }

  getBooks() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  searchBooks(query) {
    BooksAPI.search(query, 20).then((searchResults) => {
      searchResults.map(foundBook =>
        this.state.books.filter(libraryBook => libraryBook.id === foundBook.id).length && (
          foundBook.shelf = this.state.books.filter(libraryBook => libraryBook.id === foundBook.id)[0].shelf
        )
      )
      this.setState({ searchResults })
    })
  }

  componentDidMount() {
    this.getBooks()
  }

  moveBook = (event, book) => {
    BooksAPI.update(book, event.target.value).then(() => {
      this.getBooks()
    })
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
    this.searchBooks(this.state.query)
  }

  render() {
    const { searchResults, books, shelves, query } = this.state
    return (
      <div className="app">

        <Route path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search" onClick={(event) => this.updateQuery("")}>Close</Link>
              <div className="search-books-input-wrapper">
                <form>
                  <input type="text" placeholder="Search by title or author" value={query} onChange={(event) => this.updateQuery(event.target.value)} />
                </form>
              </div>
            </div>
            <div className="search-books-results">
              {query !== "" && (
                <div className="bookshelf" key="none">
                  <h2 className="bookshelf-title">Search Results</h2>
                  <div className="bookshelf-books">
                    {searchResults.length ? (
                      <Books books={searchResults} onMoveBook={this.moveBook} />
                    ) : (
                      <div>No matching books found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}/>

        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {shelves.map(shelf => (
                  <div className="bookshelf" key={shelf.id}>
                    <h2 className="bookshelf-title">{shelf.title}</h2>
                    <div className="bookshelf-books">
                      <Books books={books.filter(book => book.shelf === shelf.id)} onMoveBook={this.moveBook} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>

      </div>
    )
  }
}

export default BooksApp
