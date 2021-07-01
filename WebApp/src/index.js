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
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './store';
import DataBroker from './State/DataBroker';
import ContentContainer from './Content/ContentContainer';

const theme = createMuiTheme({
    mixins: {
        denseToolbar: {
            minHeight: 48
        }
    },
    palette: {
        type: 'dark',
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: "transparent",
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
        overflow: "hidden"
    }
}

class App extends React.Component {
    componentDidMount() {

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
            </div>
        );
    }
}
const StyledApp = withStyles(styles)(App);
ReactDOM.render(<StyledApp/>, document.getElementById("root"));