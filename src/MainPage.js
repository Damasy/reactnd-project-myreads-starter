import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import BookSearch from './BookSearch'
import BookShelf from './BookShelf'

export default class MainPage extends Component {
  render() {
    return (
      <div className="app">
        <Route path="/search" render={
          () => (<BookSearch/>)
        } />
        <Route exact path="/" render={
          () => (<BookShelf/>)
        } />
      </div>
    )
  }
}
