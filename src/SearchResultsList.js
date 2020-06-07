import React from "react";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { List } from "react-virtualized";
import "./SearchResultsList.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    border: "1px solid white",
    backgroundColor: theme.palette.background.paper
  }
}));

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class SearchResultsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classes: useStyles
    };
  }

  rowRenderer = ({ key, index, style }) => {
    const { rows, selectedIndex } = this.props;
    const v = rows[index];

    return (
      <ListItem key={key} style={style} key={index} selected={selectedIndex == index}>
        <ListItemText>
          <span className={"searchResult"}>{`${v.book} ${v.chapter}:${v.verse}`}</span> {v.text}
        </ListItemText>
      </ListItem>
    );
  };

  render() {
    const { classes } = this.state;
    const { rows, selectedIndex } = this.props;

    return (
      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <List
            height={400}
            width={1600}
            rowHeight={45}
            rowCount={rows.length}
            scrollToIndex={selectedIndex}
            rowRenderer={this.rowRenderer}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default SearchResultsList;
