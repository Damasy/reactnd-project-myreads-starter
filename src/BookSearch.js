import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Book from './Book';
import PropTypes from "prop-types";

export default class BookSearch extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    searchBookUpdate: PropTypes.func.isRequired,
    addBook: PropTypes.func.isRequired,
  };
  
  state = {
    query: ''
  }

  handleChange = (e) => {
    const query = e.target.value;
    if (query) {
      this.setState(
        {
          query: e.target.value,
        },
        () => {
          const { query } = this.state;
          return setTimeout(() => {
            this.props.searchBookUpdate(query);
          }, 250);
        }
      );
    } else {
      this.setState(
        {
          query: "",
        },
        () => {
          const { query } = this.state;
          return setTimeout(() => {
            this.props.searchBookUpdate(query);
          }, 250);
        }
      );
    }
  };

  addNewBook = (idx, shelf) => {
    const newBook = this.props.books.find((b) => b.id === idx);
    this.props.addBook(newBook, shelf);
  };

  handleClick = () => {
    this.props.clearSearch();
  };

  render() {
    const { books } = this.props;
    const { query } = this.state;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/">
            <button className="close-search" onClick={this.handleClick}>Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            <input type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={this.handleChange}/>

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          {
            books.map((book) => (
              <li key={book.id}>
                <Book
                  {...book}
                  addNewBook={this.addNewBook}
                  query={query}
                />
              </li>
            ))
          }
          </ol>
        </div>
      </div>
    )
  }
}
