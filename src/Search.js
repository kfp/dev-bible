import React from "react";
import { filter, take } from "lodash";
import "./Search.css";
import Mousetrap from "mousetrap";
import "mousetrap/plugins/global-bind/mousetrap-global-bind";
import SearchResultsList from "./SearchResultsList.js";

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      results: [],
      selectedIndex: 0,
      displaySearch: false
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchFocus = this.handleSearchFocus.bind(this);
    this.searchRef = React.createRef();
  }

  handleSearchChange(event) {
    this.setState({ searchText: event.target.value });
    this.doSearch(event.target.value);
  }

  handleSearchFocus() {
    const { searchText } = this.state;
    this.doSearch(searchText);
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
    this.setState({ results: verses, selectedIndex: 0 });
  }

  componentDidMount() {
    Mousetrap.bind(
      "shift shift",
      () => {
        this.searchRef.current.select();
        this.setState({ displaySearch: true });
      },
      "keyup"
    );
    Mousetrap.bindGlobal(
      "esc",
      () => {
        this.setState({ results: [] });
        this.searchRef.current.blur();
        this.setState({ displaySearch: false });
      },
      "keyup"
    );
    Mousetrap.bindGlobal(
      "up",
      (e) => {
        this.searchRef.current.blur();
        if (this.state.selectedIndex > 0) {
          this.setState({ selectedIndex: this.state.selectedIndex - 1 });
        }
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal(
      "down",
      (e) => {
        this.searchRef.current.blur();
        if (this.state.selectedIndex < this.state.results.length - 1) {
          this.setState({ selectedIndex: this.state.selectedIndex + 1 });
        }
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal("enter", (e) => {
      console.log("Chose: " + this.state.results[this.state.selectedIndex].text);
    });
    //TODO: page down/up nagivation
  }

  componentWillUnmount() {
    Mousetrap.unbind("shift shift");
    Mousetrap.unbind("esc");
    Mousetrap.unbind("up");
    Mousetrap.unbind("down");
    Mousetrap.unbind("enter");
  }

  render() {
    const { searchText, results, selectedIndex } = this.state;
    const searchId = "searchId";

    return (
      <div className="SearchArea">
        <input
          id={searchId}
          name="search"
          type="text"
          placeholder="Search... (Shift Shift)"
          value={searchText}
          onChange={this.handleSearchChange}
          onFocus={this.handleSearchFocus}
          ref={this.searchRef}
        />
        &nbsp;
        {results.length > 0 ? (
          <span>
            <span>{`Results: ${results.length}`}</span>
            <SearchResultsList rows={results} selectedIndex={selectedIndex} />
          </span>
        ) : null}
      </div>
    );
  }
}

export default Search;
