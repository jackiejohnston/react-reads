import React from 'react'
import PropTypes from 'prop-types'

function Books (props) {
  return (
    <ol className="books-grid">
      {props.books.map(book => (
        <li key={book.id}>
          <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
              <div className="book-shelf-changer">
                <select defaultValue={book.shelf} onChange={(event) => props.onMoveBook(event, book)}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="book-title">{book.title}</div>
              {book.authors !== undefined && (
                book.authors.map((author,index) =>
                  <div key={index} className="book-authors">{author}</div>
                )
              )}
          </div>
        </li>
      ))}
    </ol>
  )
}

Books.propTypes = {
  books: PropTypes.array.isRequired,
  onMoveBook: PropTypes.func.isRequired
}

export default Books