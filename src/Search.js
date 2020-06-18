import React from "react";
import { filter } from "lodash";
import "./Search.css";
import Mousetrap from "mousetrap";
import "mousetrap/plugins/global-bind/mousetrap-global-bind";
import SearchResultsList from "./SearchResultsList.js";
const bcv_parser = require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;
const bcv = new bcv_parser();
bcv.set_options({ osis_compaction_strategy: "bvc" });

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

  doSearch(text, refSearch) {
    const { bible } = this.props;

    if (refSearch) {
      var searches = bcv.parse(text).osis();
      if (searches) {
        console.log(searches);
        searches.split(",").forEach((search) => this.props.addVerse(search));
        return;
      }
    } else if (text.length > 0) {
      var verses = [];
      verses = filter(bible, (v) => v.text.toLowerCase().includes(text.toLowerCase()));
      this.setState({ results: verses, selectedIndex: 0 });
    }
  }

  addToIndex(num) {
    return Math.max(Math.min(this.state.selectedIndex + num, this.state.results.length - 1), 0);
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
        this.setState({ selectedIndex: this.addToIndex(-1) });
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal(
      "down",
      (e) => {
        this.searchRef.current.blur();
        this.setState({ selectedIndex: this.addToIndex(1) });
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal(
      "pagedown",
      (e) => {
        this.searchRef.current.blur();
        this.setState({ selectedIndex: this.addToIndex(9) });
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal(
      "pageup",
      (e) => {
        this.searchRef.current.blur();
        this.setState({ selectedIndex: this.addToIndex(-9) });
        return false;
      },
      "keydown"
    );
    Mousetrap.bindGlobal("enter", (e) => {
      const verse = this.state.results[this.state.selectedIndex];
      if (!verse) {
        this.doSearch(this.state.searchText, true);
        this.searchRef.current.blur();
        return;
      }
      this.props.addVerse(bcv.parse(`${verse.book} ${verse.chapter}: ${verse.verse}`).osis());
      this.setState({ results: [] });
      this.searchRef.current.blur();
      this.setState({ displaySearch: false });
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind("shift shift");
    Mousetrap.unbind("esc");
    Mousetrap.unbind("up");
    Mousetrap.unbind("down");
    Mousetrap.unbind("pageUp");
    Mousetrap.unbind("pageDown");
    Mousetrap.unbind("enter");
  }

  render() {
    const { searchText, results, selectedIndex } = this.state;
    const searchId = "searchId";

    return (
      <span className="SearchArea">
        <input
          id={searchId}
          name="search"
          type="text"
          className={(bcv.parse(searchText).osis())?"RefMatch":null}
          placeholder="Search..."
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
      </span>
    );
  }
}

export default Search;
