import React from "react";
import { filter, take } from "lodash";
import "./App.css";
import Mousetrap from "mousetrap";
import ReactVirtualizedList from "./ReactVirtualizedList.js";

class SearchResults extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shouldDisplay: false
    };
  }

  render() {
    const { results, keywords } = this.props;

    return (
      <div className="SearchResults">
        <ul>
          {results.map((v, i) => (
            <li key={i} versenum={v.index} title={v.text}>
              {v.book} {v.chapter}:{v.verse} {v.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      results: [],
      searchFocused: false
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.searchRef = React.createRef();
  }

  handleSearchChange(event) {
    this.setState({ searchText: event.target.value });
    this.doSearch(event.target.value);
  }

  doSearch(text) {
    const { bible } = this.props;
    const searches = [...text.matchAll(/((?:\d\s*)?\w+)\s+(\d+):(\d+(?:-\d+)?)\s*/g)];
    var verses = [];
    if (searches.length > 0) {
      verses = filter(bible, {
        book: searches[0][1],
        chapter: parseInt(searches[0][2]),
        verse: parseInt(searches[0][3])
      });
    } else if (text.length > 0) {
      verses = filter(bible, (v) => v.text.toLowerCase().includes(text.toLowerCase()));
    }
    this.setState({ results: verses });
  }

  componentDidMount() {
    Mousetrap.bind("shift shift", () => this.searchRef.current.select(), "keyup");
    Mousetrap.bind("esc", () => this.searchRef.current.blur(), "keyup");
  }

  componentWillUnmount() {
    Mousetrap.unbind("shift shift");
    Mousetrap.unbind("esc");
  }

  render() {
    const { searchText, results } = this.state;
    const searchId = "searchId";
    const rowRenderer = (v) => `${v.book} ${v.chapter}:${v.verse} ${v.text}`;

    return (
      <div>
        <input
          id={searchId}
          className="Search"
          name="search"
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={this.handleSearchChange}
          ref={this.searchRef}
        />
        {searchId === document.activeElement.id && results.length > 0 ? (
          <ReactVirtualizedList rows={results} rowRenderer={rowRenderer} />
        ) : null}
      </div>
    );
  }
}

export default Search;
