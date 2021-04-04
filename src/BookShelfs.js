import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Book from './Book';
import PropTypes from "prop-types";

export default class BookShelf extends Component {
  static propTypes = {
    shelf: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
  };

  state = {
    book: null,
    shelf: ''
  }

  unCamelCase = (word) => {
    return word
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./,(str) => { return str.toUpperCase(); })
  }

  updateBook = (idx, shelf) => {
    const updatedBook = this.props.books.find((b) => b.id === idx);
    this.setState(
      {
        book: updatedBook,
      },
      () => {
        const { book } = this.state;
        this.props.updateBookShelf(book, shelf);
      }
    );
  };
  
  render() {
    const{shelfs} = this.props;
    const shelfNames = Object.keys(shelfs);
    
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            {shelfNames.map(shelf => (
              <div className="bookshelf" key={shelf}>
                <h2 className="bookshelf-title">{this.unCamelCase(shelf)}</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {
                      shelfs[shelf].map(book => (
                        <li key={book.id}>
                          <Book
                          {...book} 
                          updateBook={this.updateBook}/>
                        </li>
                      ))
                    }
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">
            <button>Add a book</button>
          </Link>
        </div>
      </div>
    )
  }
}
