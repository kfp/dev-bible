import React from "react";
import PropTypes from "prop-types";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper
  }
}));

function renderRow(props) {
  const { index, style, data, rowRenderer } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={rowRenderer(data[index])} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  rowRenderer: PropTypes.func.isRequired
};

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class ReactVirtualizedList extends React.PureComponent {
  render() {
    const { rows, rowRenderer } = this.props;
    const classes = {root: {
      width: "100%",
      height: 400,
      maxWidth: 300,
    }}

    return (
      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <FixedSizeList height={400} width={300} itemSize={rows.length} itemData={rows} rowRenderer={rowRenderer}>
            {renderRow}
          </FixedSizeList>
        </div>
      </ThemeProvider>
    );
  }
}

export default ReactVirtualizedList;
