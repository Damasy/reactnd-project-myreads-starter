import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class Book extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    imageLink: PropTypes.string.isRequired,
  };

  state = {
    shelf: ''
  }

  handleChange = (e) => {
    if(this.props.query) {
      // Search
      this.setState(
        {
          shelf: e.target.value,
        },
        () => {
          this.props.addNewBook(this.props.id, this.state.shelf);
        }
      );
    } else {
      // list
      this.setState(
        {
          shelf: e.target.value,
        },
        () => {
          this.props.updateBook(this.props.id, this.state.shelf);
        }
      );
    }
  }

  render() {
    const {title, authors, imageLink, shelf} = this.props
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${imageLink})` }}></div>
          <div className="book-shelf-changer">
            <select onChange={(e) => this.handleChange(e)} value={this.props.query ? shelf : null}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors}</div>
      </div>
    )
  }
}
