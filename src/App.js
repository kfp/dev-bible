import React from "react";
import { range, rangeRight, uniq, indexOf, max, min } from "lodash";
import "./App.css";
import Search from "./Search.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Mousetrap from "mousetrap";

var index = 0;
const books = require("./books.json");
const bible = require("./t_kjv.json").resultset.row.map((v) => {
  return {
    index: index++,
    bookNum: v.field[1],
    book: books[v.field[1] - 1],
    chapter: v.field[2],
    verse: v.field[3],
    text: v.field[4],
    tokenized: tokenize(v.field[4])
  };
});

function randomVerseNum() {
  return Math.floor(Math.random() * bible.length);
}

function tokenize(text) {
  return text;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

class Verse extends React.PureComponent {
  render() {
    const { verse, isContext } = this.props;
    return (
      <span className={isContext ? "Context" : null}>
        <sup className="Verse">{verse.verse}</sup>
        {verse.text}&nbsp;
      </span>
    );
  }
}

class VerseGroup extends React.PureComponent {
  render() {
    const { verseNum, versesBefore, versesAfter } = this.props;
    const verse = bible[verseNum];

    return (
      <div>
        <h1>
          {verse.book} {verse.chapter}:{verse.verse}
        </h1>
        {range(Math.max(0, verseNum - versesBefore), verseNum).map((n, i) => (
          <Verse verse={bible[n]} isContext={true} key={i} />
        ))}
        <Verse verse={verse} />
        {rangeRight(Math.min(bible.length, verseNum + versesAfter), verseNum).map((n, i) => (
          <Verse verse={bible[n]} isContext={true} key={i} />
        ))}
      </div>
    );
  }
}

class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verseNums: [randomVerseNum()],
      versesBefore: 1,
      versesAfter: 1,
      tabIndex: 0
    };
    this.handleContextChange = this.handleContextChange.bind(this);
    this.addVerse = this.addVerse.bind(this);
  }

  addVerse(verseNum) {
    this.setState({ verseNums: uniq([...this.state.verseNums, verseNum]) });
    this.setState({ tabIndex: indexOf(this.state.verseNums, verseNum) });
  }

  handleContextChange(event) {
    const newVal = parseInt(event.target.value);
    this.setState({ versesBefore: newVal, versesAfter: newVal });
  }

  componentDidMount() {
    Mousetrap.bind(
      "ctrl+right",
      (e) => {
        this.setState({ tabIndex: (this.state.tabIndex + 1) % this.state.verseNums.length });
      },
      "keydown"
    );
    Mousetrap.bind(
      "ctrl+left",
      (e) => {
        this.setState({ tabIndex: mod(this.state.tabIndex - 1, this.state.verseNums.length) });
      },
      "keydown"
    );
  }

  componentWillUnmount() {
    Mousetrap.unbind("ctrl+right");
    Mousetrap.unbind("ctrl+left");
  }

  render() {
    const { verseNums, versesBefore, versesAfter, tabIndex } = this.state;

    return (
      <div className="App">
        <Search bible={bible} addVerse={this.addVerse} />
        <div className="Settings">
          <span className="ContextSetting">
            Context:
            <select value={this.state.versesBefore} onChange={this.handleContextChange}>
              {range(0, 10).map((n) => (
                <option value={n} key={n}>
                  {n}
                </option>
              ))}
            </select>
          </span>
        </div>
        <Tabs className={"Tabs"} selectedIndex={tabIndex} onSelect={(tabIndex) => this.setState({ tabIndex })}>
          <TabList>
            {verseNums.map((verseNum, i) => (
              <Tab key={i}>{`${bible[verseNum].book} ${bible[verseNum].chapter}:${bible[verseNum].verse}`}</Tab>
            ))}
          </TabList>
          {verseNums.map((verseNum, i) => (
            <TabPanel key={i}>
              <VerseGroup versesBefore={versesBefore} versesAfter={versesAfter} verseNum={verseNum} key={i} />
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
