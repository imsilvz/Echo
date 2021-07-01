import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from '@material-ui/styles';

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({

});

class CloseButton extends React.Component {
    constructor(props) {
        super(props);
        this.OnClose = this.OnClose.bind(this);
    }

    OnClose(e) {
        e.preventDefault();

        // signal to shutdown host
        chrome.webview.hostObjects.sync.eventForwarder.Close();
    }

    render() {
        const { classes } = this.props;
        return (
            <IconButton 
                aria-label="close" 
                color="inherit"
                onClick={(e) => this.OnClose(e)}
            >
                <CloseIcon/>
            </IconButton>
        )
    }
}
export default withStyles(styles, { withTheme: true })(CloseButton);