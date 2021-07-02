import React from "react";
import clsx from "clsx";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import { withStyles } from '@material-ui/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from "@material-ui/core/IconButton";

import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone';
import SettingsIcon from '@material-ui/icons/Settings';

import Header from '../Header/Header';
import Chatlog from './Chatlog/Chatlog';
import Listener from './Listener/Listener';
import Settings from './Settings/Settings';

const styles = theme => ({
    contentContainer: {
        width: '100%',
        minHeight: 0,
        flexGrow: 1,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentContainerShift: {
        width: `calc(100% - ${theme.spacing(7)}px)`,
        flexGrow: 1,
        marginLeft: theme.spacing(7),
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 0),
        ...theme.mixins.denseToolbar,
        justifyContent: 'center',
    },
    drawerOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7),
    },
});

const ContentContainer = withStyles(styles, { withTheme: true })(
    (props) => {
        const { classes } = props;
        const { menuShift } = props;
        return (
            <div 
                className={
                    clsx(classes.contentContainer, {
                        [classes.contentContainerShift]: menuShift
                    })
                }
            >
                <Switch>
                    <Route path="/settings">
                        <Settings/>
                    </Route>
                    <Route path="/chatlog">
                        <Chatlog/>
                    </Route>
                    <Route path="/">
                        <Listener/>
                    </Route>
                </Switch>
            </div>
        );
    }
);

const Menu = withStyles(styles, { withTheme: true })(
    (props) => {
        const { classes } = props;
        const { open, closeDrawer } = props;
        return (
            <Drawer
                variant="persistent"
                anchor="left"
                open={ open }
                classes={{
                    paper: classes.drawerOpen
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton size="small" onClick={closeDrawer}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <div>
                    <List>
                        <Link to="/">
                            <ListItem button>
                                <ListItemIcon>
                                    <ChatOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Listener"/>
                            </ListItem>
                        </Link>
                        <Link to="/chatlog">
                            <ListItem button>
                                <ListItemIcon>
                                    <ForumTwoToneIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Chatlog"/>
                            </ListItem>
                        </Link>
                        <Link to="/settings">
                            <ListItem button>
                                <ListItemIcon>
                                    <SettingsIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Settings"/>
                            </ListItem>
                        </Link>
                    </List>
                </div>
            </Drawer>
        )
    }
);

const MenuContainer = (props) => {
    const [ open, setOpen ] = React.useState(false);

    const openDrawer = () => {
        setOpen(true);
    }

    const closeDrawer = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <Header
                menuShift={open}
                openMenu={openDrawer}
                closeMenu={closeDrawer}
            />
            <Menu
                open={open}
                closeDrawer={closeDrawer}
            />
            <ContentContainer
                menuShift={open}
            />
        </React.Fragment>
    )
}
export default withStyles(styles, { withTheme: true })(MenuContainer);