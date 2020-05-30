import React from 'react';
import {range, rangeRight} from 'lodash';
import './App.css'

var books = require('./books.json');
var bible = require('./t_kjv.json').resultset.row.map((v) => {
  return {bookNum: v.field[1], book: books[v.field[1]-1], chapter: v.field[2], verse:v.field[3], text:v.field[4]};
  }
);

function randomVerseNum(){
  return Math.floor(Math.random() * bible.length)
}

class Verse extends React.PureComponent{
  render(){
    const {verse, isContext} = this.props;
    return (
      <span className={isContext?'Context': null}><sup className="Verse">{verse.verse}</sup>{verse.text}&nbsp;</span>
    )
  }
}

class VerseGroup extends React.PureComponent{
  render(){
    const {verseNum, versesBefore, versesAfter} = this.props;
    const verse = bible[verseNum];

    return(
    <div>
      <h1>{verse.book} {verse.chapter}:{verse.verse}</h1>
      {range(verseNum - versesBefore, verseNum).map((n) =>
        <Verse verse={bible[n]} isContext={true}/>
      )}
      <Verse verse={verse}/>
      {rangeRight(verseNum+versesAfter, verseNum).map((n) =>
        <Verse verse={bible[n]} isContext={true}/>
      )}
    </div>
    )
  }
}

class Page extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      searchText: '', 
      verseNum: randomVerseNum(),
      versesBefore: 1,
      versesAfter: 1,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleContextChange = this.handleContextChange.bind(this);
  }


  handleSearchChange(event){
    this.setState({searchText: event.target.value})
    this.doSearch()
  }

  handleContextChange(event){
    const newVal = parseInt(event.target.value);
    this.setState({versesBefore: newVal})
    this.setState({versesAfter: newVal})
  }

  doSearch(){
    const text = this.props.searchText;

    this.setState({verseNum: randomVerseNum()});
  }

  render(){
    const {searchText, verseNum, versesBefore, versesAfter} = this.state;
    return (
      <div className="App">
        <div className="Settings">
        <input className="Search" name="search" type="text" placeholder='Search...' value={searchText} onChange={this.handleSearchChange}/>
        <span className="ContextSetting">
          Context:
          <select value={this.state.versesBefore} onChange={this.handleContextChange}>
            {range(1, 10).map((n) =>
              <option value={n} key={n}>{n}</option>
            )}
          </select>
        </span>
        </div>
        <VerseGroup versesBefore={versesBefore} versesAfter={versesAfter} verseNum={verseNum}/>
      </div>
    )
  }
}

export default function App() {
  return (
    <Page/>
  );
}

