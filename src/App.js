import React from 'react'
import * as BooksAPI from './BooksAPI'
import Books from './Books'
import './App.css'

class BooksApp extends React.Component {

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
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
    query: "Android",
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
        this.state.books.filter(libraryBook => libraryBook.id === foundBook.id).length
        ? foundBook.shelf = this.state.books.filter(libraryBook => libraryBook.id === foundBook.id)[0].shelf
        : foundBook
      )
      this.setState({ searchResults })
    })
  }

  componentDidMount() {
    this.getBooks()
    this.searchBooks(this.state.query)
  }

  moveBook = (event, book) => {
    BooksAPI.update(book, event.target.value).then(() => {
      this.getBooks()
    })
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>
              </div>
            </div>
            <div className="search-books-results">
              {this.state.query.length ? (
                <div className="bookshelf" key="none">
                  <h2 className="bookshelf-title">Search Results</h2>
                  <div className="bookshelf-books">
                    {this.state.searchResults.length ? (
                      <Books books={this.state.searchResults} onMoveBook={this.moveBook} />
                    ) : (
                      <div>No matching books found.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {this.state.shelves.map(shelf => (
                  <div className="bookshelf" key={shelf.id}>
                    <h2 className="bookshelf-title">{shelf.title}</h2>
                    <div className="bookshelf-books">
                      <Books books={this.state.books.filter(book => book.shelf === shelf.id)} onMoveBook={this.moveBook} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
