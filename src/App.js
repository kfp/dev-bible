import React from 'react';
import {sample} from 'lodash';
import './App.css'

var books = require('./books.json');
var bible = require('./t_kjv.json').resultset.row.map((v) => {
  return {bookNum: v.field[1], book: books[v.field[1]-1], chapter: v.field[2], verse:v.field[3], text:v.field[4]};
  }
);

class Verse extends React.PureComponent{
  render(){
    const {verse, isContext} = this.props;
    return (
      <span className={isContext?'Context': null}><sup>{verse.verse}</sup>{verse.text}</span>
    )
  }
}

export default function App() {
  const rnd = Math.floor(Math.random() * bible.length);
  const beforeVerse = bible[rnd-1];
  const verse = bible[rnd]
  const afterVerse = bible[rnd+1]

  return (
    <div className="App">
      <input className="Search" name="search" type="text" value="Search..."/>
      <h1>{verse.book} {verse.chapter}:{verse.verse}</h1>
      <Verse verse={beforeVerse} isContext={true}/>
      <Verse verse={verse}/>
      <Verse verse={afterVerse} isContext={true}/>
    </div>
  );
}

