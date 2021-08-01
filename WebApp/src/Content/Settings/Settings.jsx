import React from "react";
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';

import CommonSettings from './CommonSettings/CommonSettings';
import ChatlogSettings from "./ChatlogSettings/ChatlogSettings";

const style = theme => ({
    settingsContainer: {
        height: "100%",
        overflowY: "auto",
    }
});

const Settings = (props) => {
    const { classes } = props;
    return (
        <Container className={classes.settingsContainer}>
            <CommonSettings/>
            <ChatlogSettings/>
        </Container>
    )
}
export default withStyles(style, { withTheme: true })(Settings);