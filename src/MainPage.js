import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import BookSearch from './BookSearch';
import BookShelf from './BookShelfs';
import * as BookAPI from './BooksAPI';

export default class MainPage extends Component {
  state = {
    books: [],
    shelves: {},
    searchedBooks: []
  }
  componentDidMount() {
    BookAPI.getAll().then(data => {
      this.setState({books: data});
      this.generateShelves(data);
    })
  }

  generateShelves = (books) => {
    const shelves = {
      "currentlyReading": [],
      "wantToRead": [],
      "read": []
    };

    for(let i=0;i<books.length;i++) {
      const book = books[i]
      const obj = {
        title: book.title,
        authors: Array.isArray(book.authors) ? book.authors.join(', ') : book.authors,
        imageLink: book.imageLinks ? book.imageLinks.thumbnail : book.imageLink,
        id: book.id,
        shelf: book.shelf
      }
      if(shelves[book.shelf]) {
        shelves[book.shelf].push(obj);
        continue;
      }
    }

    this.setState({shelves: shelves});
  }

  updateBookShelf = (updatedBook, shelf) => {
    BookAPI.update(updatedBook, shelf).then(() => {
      const booksInShelf = [...this.state.books]
        .filter((book) => book.shelf !== "None")
        .map((book) => {
          if (book.id === updatedBook.id) {
            return { ...book, shelf };
          }
          return book;
        });

      this.setState((state, props) => {
        return {
          books: booksInShelf,
        };
      });
      this.generateShelves(this.state.books)
    });
  };

  addBook = (newBook, shelf) => {
    BookAPI.update(newBook, shelf).then(() => {
      const newBooks = [...this.state.searchedBooks].map((book) => {
        if (book.id === newBook.id) {
          return { ...book, shelf };
        }
        return book;
      });
      this.setState((state, props) => {
        return {
          searchedBooks: newBooks,
        };
      });
      this.setState((state, props) => {
        const bookSet = [
          ...new Set([...this.state.books, { ...newBook, shelf }]),
        ];
        return {
          books: bookSet,
        };
      });
      this.generateShelves(this.state.books);
    });
  };

  searchedBookUpdate = (query) => {
    if (query) {
      return BookAPI.search(query).then((books) => {
        if (books.error) {
          this.setState((state, props) => {
            return { searchedBooks: [], error: true };
          });
        } else {
          function updateSearchedBooks(shelfBooks) {
            const updatedBookSearch = [];
            for (let i = 0; i < books.length; i++) {
              for (let j = 0; j < shelfBooks.length; j++) {
                if (books[i].id === shelfBooks[j].id) {
                  updatedBookSearch.push({
                    ...books[i],
                    shelf: shelfBooks[j].shelf,
                  });
                  books.splice(i, 1);
                }
              }
            }
            return [...books, ...updatedBookSearch];
          }
          const updatedBookSearch = updateSearchedBooks(this.state.books);
          this.setState((state, props) => {
            return {
              error: false,
              searchedBooks: updatedBookSearch
                .filter((book) => book.imageLinks)
                .map((book) => ({
                  id: book.id,
                  title: book.title,
                  authors: book.authors
                    ? book.authors.join(', ')
                    : "No authors found",
                  imageLink: book.imageLinks.smallThumbnail,
                  shelf: book.shelf ? book.shelf : "none",
                })),
            };
          });
        }
      });
    } else {
      this.resetSearch();
    }
  };

  resetSearch = () => {
    this.setState((state, props) => {
      return {
        searchedBooks: [],
      };
    });
  };

  render() {
    return (
      <div className="app">
        <Route path="/search" render={
          () => this.state.error === true ? ( <div>
            <BookSearch
              books={this.state.searchedBooks}
              searchBookUpdate={this.searchedBookUpdate}
              addBook={this.addBook}
              clearSearch={this.resetSearch}
            />
            <h1 style={{ color: "#485156", padding: "20px" }}>
              <small style={{ fontSize: "1.5rem", fontWeight: "300" }}>
                No results found...
              </small>
              <i className="fas fa-frown"></i>
            </h1>
          </div>
        ) : (
          <BookSearch
            books={this.state.searchedBooks}
            searchBookUpdate={this.searchedBookUpdate}
            addBook={this.addBook}
            clearSearch={this.resetSearch}
          />
        )
        } />
        <Route exact path="/" render={
          () => (<BookShelf
            shelves={this.state.shelves}
            books={this.state.books}
            updateBookShelf={this.updateBookShelf}/>)
        } />
      </div>
    )
  }
}
