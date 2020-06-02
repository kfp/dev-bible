import React from 'react';
import {range, rangeRight, findIndex} from 'lodash';
import './App.css'
import Mousetrap from 'mousetrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
 

var index=0;
const books = require('./books.json');
const bible = require('./t_kjv.json').resultset.row.map((v) => {
  return {index: index++, bookNum: v.field[1], book: books[v.field[1]-1], chapter: v.field[2], verse:v.field[3], text:v.field[4], tokenized:tokenize(v.field[4])};
  }
);

function randomVerseNum(){
  return Math.floor(Math.random() * bible.length)
}

function tokenize(text){
  return text;
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
        {range(Math.max(0, verseNum - versesBefore), verseNum).map((n, i) =>
          <Verse verse={bible[n]} isContext={true} key={i}/>
        )}
        <Verse verse={verse}/>
        {rangeRight(Math.min(bible.length, verseNum+versesAfter), verseNum).map((n, i) =>
          <Verse verse={bible[n]} isContext={true} key={i}/>
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
      verseNums: [randomVerseNum()],
      versesBefore: 1,
      versesAfter: 1,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleContextChange = this.handleContextChange.bind(this);
    this.searchRef = React.createRef();
  }


  handleSearchChange(event){
    this.setState({searchText: event.target.value})
    this.doSearch(event.target.value)
  }

  handleContextChange(event){
    const newVal = parseInt(event.target.value);
    this.setState({versesBefore: newVal})
    this.setState({versesAfter: newVal})
  }

  doSearch(text){
    const searches = [...text.matchAll(/((?:\d\s*)?\w+)\s+(\d+):(\d+(?:-\d+)?)\s*/g)];
    var verse;
    if(searches.length > 0){
      verse = findIndex(bible, {'book':searches[0][1], 'chapter':parseInt(searches[0][2]), 'verse':parseInt(searches[0][3])});
    } else {
      verse = findIndex(bible, v=>v.text.toLowerCase().includes(text.toLowerCase()));
    }
    if(verse>=0 && !this.state.verseNums.includes(verse)){
      this.setState({verseNums: [...this.state.verseNums, verse]});
    }
  }

  componentDidMount() {
    Mousetrap.bind("shift shift", () => this.searchRef.current.select(), 'keyup');
  }

  componentWillUnmount() {
    Mousetrap.unbind("shift shift");
  }

  render(){
    const {searchText, verseNums, versesBefore, versesAfter} = this.state;
    return (
      <div className="App">
        <div className="Settings">
        <input className="Search" name="search" type="text" placeholder='Search...' value={searchText} 
          onChange={this.handleSearchChange} ref={this.searchRef}/>
        <span className="ContextSetting">
          Context:
          <select value={this.state.versesBefore} onChange={this.handleContextChange}>
            {range(1, 10).map((n) =>
              <option value={n} key={n}>{n}</option>
            )}
          </select>
        </span>
        </div>
          <Tabs>
            <TabList>
              {verseNums.map((verseNum, i)=>
                <Tab key={i}>{`${bible[verseNum].book} ${bible[verseNum].chapter}:${bible[verseNum].verse}`}</Tab>
              )}
            </TabList>
            {verseNums.map((verseNum, i)=>
              <TabPanel key={i}><VerseGroup versesBefore={versesBefore} versesAfter={versesAfter} verseNum={verseNum} key={i}/></TabPanel>
            )}
          </Tabs>
      </div>
    )
  }
}

export default function App() {
  return (
    <Page/>
  );
}

