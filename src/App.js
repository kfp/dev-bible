import React from "react";
import { reject, find, uniq, indexOf, max } from "lodash";
import "./App.css";
import Search from "./Search.js";
import Shortcuts from "./Shortcuts.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Mousetrap from "mousetrap";
const bcv_parser = require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;
const bcv = new bcv_parser();

var index = 0;
const books = require("./books.json");
const bible = require("./t_kjv.json").resultset.row.map((v) => {
  return {
    index: index++,
    bookNum: v.field[1],
    book: books[v.field[1] - 1][1],
    bookAbbrev: books[v.field[1] - 1][0],
    chapter: v.field[2],
    verse: v.field[3],
    text: v.field[4],
    tokenized: tokenize(v.field[4])
  };
});

function randomVerseNum() {
  const verse = bible[Math.floor(Math.random() * bible.length)];

  return `${verse.bookAbbrev}.${verse.chapter}.${verse.verse}`;
}

function tokenize(text) {
  return text;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function verseRef(ref) {
  const parts = ref.split(".");
  var res = find(bible, { bookAbbrev: parts[0], chapter: parseInt(parts[1]), verse: parseInt(parts[2]) });
  return res;
}

function groupRef(ref) {
  var verses = [];
  ref.split("-").forEach((r) => verses.push(verseRef(r)));
  if (verses.length > 1) {
    return bible.slice(verses[0].index, verses[1].index + 1);
  }
  return verses;
}

class Verse extends React.PureComponent {
  render() {
    const { verse } = this.props;
    return (
      <span>
        <sup className="Verse">{verse.verse}</sup>
        {verse.text}&nbsp;
      </span>
    );
  }
}

class VerseGroup extends React.PureComponent {
  render() {
    const { verseRef } = this.props;
    const verses = groupRef(verseRef);

    return (
      <div>
        {verses.map((verse, i) => (
          <Verse verse={verse} key={i} />
        ))}
      </div>
    );
  }
}

class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verseRefs: [randomVerseNum()],
      versesBefore: 1,
      versesAfter: 1,
      tabIndex: 0,
      showShortcuts: false
    };
    this.addVerse = this.addVerse.bind(this);
  }

  addVerse(verseRef) {
    const newRefs = uniq([...this.state.verseRefs, verseRef]);
    this.setState({ verseRefs: newRefs, tabIndex: indexOf(newRefs, verseRef) });
  }

  componentDidMount() {
    Mousetrap.bind(
      "ctrl+right",
      () => {
        this.setState({ tabIndex: (this.state.tabIndex + 1) % this.state.verseRefs.length });
      },
      "keydown"
    );
    Mousetrap.bind(
      "ctrl+left",
      () => {
        this.setState({ tabIndex: mod(this.state.tabIndex - 1, this.state.verseRefs.length) });
      },
      "keydown"
    );
    Mousetrap.bindGlobal(
      "ctrl+shift+c",
      () => {
        this.setState({
          verseRefs: reject(this.state.verseRefs, (value, key) => key === this.state.tabIndex),
          tabIndex: max([this.state.tabIndex - 1, 0])
        });
        return false;
      },
      "keypress"
    );
    Mousetrap.bind(
      "f1",
      () => {
        this.setState({ showShortcuts: !this.state.showShortcuts});
      },
      "keydown"
    );
  }

  componentWillUnmount() {
    Mousetrap.unbind("ctrl+right");
    Mousetrap.unbind("ctrl+left");
    Mousetrap.unbind("ctrl+shift+c");
  }

  render() {
    const { verseRefs, tabIndex, showShortcuts } = this.state;

    return (
      <div className="App">
        {showShortcuts ? <Shortcuts /> : null}
        <Search bible={bible} addVerse={this.addVerse} />
        <span className="ShortcutLink" onClick={()=>this.setState({ showShortcuts: !this.state.showShortcuts})} title="Toggle Shortcuts">?</span>
        <Tabs className={"Tabs"} selectedIndex={tabIndex} onSelect={(tabIndex) => this.setState({ tabIndex })}>
          <TabList>
            {verseRefs.map((verseRef, i) => {
              return <Tab key={i}>{bcv.parse(verseRef).osis().replace(".", " ").replace(".", ":")}</Tab>;
            })}
          </TabList>
          {verseRefs.map((verseRef, i) => (
            <TabPanel key={i}>
              <VerseGroup verseRef={verseRef} key={i} />
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default function App() {
  return <Page />;
}
