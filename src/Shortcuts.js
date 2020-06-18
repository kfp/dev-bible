import React from "react";
import "./Shortcuts.css";

class Shortcuts extends React.PureComponent {

    render() {
        return(<div className="Shortcuts">
            <div><span className="Keys">F1</span> - Toggle Shortcuts</div>
            <div><span className="Keys">Shfit+Shift</span> - Search</div>
            <div><span className="Keys">Esc</span> - Dismiss search</div>
            <div><span className="Keys">Ctrl+Left</span> - Select tab to left</div>
            <div><span className="Keys">Ctrl+Right</span> - Select tab to right</div>
            <div><span className="Keys">Ctrl+Shift+C</span> - Close current tab</div>
            <div><span className="Keys">Down</span> - Select next search result</div>
            <div><span className="Keys">Up</span> - Select previous search result</div>
            <div><span className="Keys">PageDown</span> - Select next search result page</div>
            <div><span className="Keys">PageUp</span> - Select previous search result page</div>
            <div><a className="App-link" href="https://github.com/kfp/dev-bible" target="new">src</a></div>
        </div>);
    }
}

export default Shortcuts;