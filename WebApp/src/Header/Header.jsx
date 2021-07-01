import React from "react";
import clsx from "clsx";
import ReactDOM from "react-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import CloseButton from './CloseButton/CloseButton';
import MenuButton from './MenuButton/MenuButton';
import Typography  from '@material-ui/core/Typography';

//import '@fontsource/roboto';
const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'padding', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${theme.spacing(7)}px)`,
        marginLeft: theme.spacing(7),
        paddingLeft: theme.spacing(2),
        transition: theme.transitions.create(['margin', 'padding', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    draggable: {
        appDraggable: "true"
    },
    menuTitle: {
        flexGrow: 1,
        userSelect: "none",
    }
});

class Header extends React.Component {
    render() {
        const { classes } = this.props;
        const { menuShift, openMenu, closeMenu } = this.props;

        return (
            <AppBar 
                className={
                    clsx(classes.appBar, {
                        [classes.appBarShift]: menuShift
                    })
                }
                color="default" 
                data-draggable 
                position="static"
            >
                <Toolbar data-draggable disableGutters variant="dense">
                    { !!!menuShift && (
                        <MenuButton
                            openMenu={openMenu}
                            closeMenu={closeMenu}
                        />
                    )}
                    <Typography 
                        component="h1"
                        variant="h6"
                        color="textSecondary"
                        className={classes.menuTitle}
                        data-draggable
                    >
                        Echo - FFXIV Chat Listener
                    </Typography>
                    <CloseButton/>
                </Toolbar>
            </AppBar>
        )
    }
}
export default withStyles(styles, { withTheme: true })(Header);