import React from "react";
import PropTypes from "prop-types";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import Mousetrap from "mousetrap";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper
  }
}));

function renderRow(props) {
  const { index, style, data, selectedIndex, rowRenderer } = props;
  const v = data[index];

  return (
    <ListItem button style={style} key={index} selected={index == 1}>
      <ListItemText primary={`${v.book} ${v.chapter}:${v.verse} ${v.text}`} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  selectedRowIndex: PropTypes.number,
  rowRenderer: PropTypes.func
};

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class ReactVirtualizedList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  componentDidMount() {
    Mousetrap.bind("up", () => this.setState({ selectedIndex: this.state.selectedIndex - 1 }), "keypress");
    Mousetrap.bind("down", () => this.setState({ selectedIndex: this.state.selectedIndex + 1 }), "keypress");
  }

  componentWillUnmount() {
    Mousetrap.unbind("up");
    Mousetrap.unbind("down");
  }

  render() {
    const { rows, rowRenderer } = this.props;
    const { selectedIndex } = this.state;
    const classes = {
      root: {
        width: "100%",
        height: 400,
        maxWidth: 1600
      }
    };

    return (
      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <FixedSizeList
            height={400}
            width={1600}
            itemSize={45}
            itemCount={rows.length}
            itemData={rows}
            selectedIndex={selectedIndex}
            rowRenderer={rowRenderer}>
            {renderRow}
          </FixedSizeList>
        </div>
      </ThemeProvider>
    );
  }
}

export default ReactVirtualizedList;
