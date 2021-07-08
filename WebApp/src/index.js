import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { 
    createMuiTheme,
    makeStyles,
    ThemeProvider,
    withStyles
} from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './store';
import DataBroker from './State/DataBroker';
import ContentContainer from './Content/ContentContainer';

const theme = createMuiTheme({
    mixins: {
        denseToolbar: {
            minHeight: 32
        }
    },
    palette: {
        type: 'dark',
        primary: {
            main: purple[200]
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    //filter: "blur(8px)",
                    backgroundColor: "transparent",
                }
            },
        },
        MuiToolbar: {
            dense: {
                minHeight: 32,
            }
        },
        MuiAccordion: {
            root: {
                '&$expanded': {
                    margin: 0,
                }
            }
        }
    }
});

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        overflow: "hidden",
        backgroundColor:"rgba(0,0,0,0.5)"
    },
    grip: {
        display: "block",
        position: "absolute",
        bottom: "0",
        right: "0",
        color: "#FFF",
        width: "16px",
        height: "16px"
    }
}

class App extends React.Component {
    componentDidMount() {
        chrome.webview.hostObjects.eventForwarder.AppReady();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Provider store={store}>
                    <DataBroker/>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <HashRouter>
                            <ContentContainer/>
                        </HashRouter>
                    </ThemeProvider>
                </Provider>
                <div className={classes.grip} data-grippable/>
            </div>
        );
    }
}
const StyledApp = withStyles(styles)(App);
ReactDOM.render(<StyledApp />, document.getElementById("root"));