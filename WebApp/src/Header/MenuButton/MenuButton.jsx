import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({

});

class MenuButton extends React.Component {
    constructor(props) {
        super(props);
        this.OnClicked = this.OnClicked.bind(this);
    }

    OnClicked(e) {
        const { openMenu, closeMenu } = this.props;
        e.preventDefault();

        // e
        openMenu();
    }

    render() {
        const { classes } = this.props;
        return (
            <IconButton 
                color="inherit"
                aria-label="menu"
                onClick={(e) => this.OnClicked(e)}
            >
                <MenuIcon/>
            </IconButton>
        )
    }
}
export default withStyles(styles, { withTheme: true })(MenuButton);