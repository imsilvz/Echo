import React from 'react';
import { withStyles } from '@material-ui/styles';

import Divider from '@material-ui/core/Divider';
import SettingsCard from '../SettingsCard.jsx';

const styles = theme => ({
    
});

const ChatlogSettings = (props) => {
    const { classes } = props;
    return (
        <SettingsCard name="Chatlog Settings">

        </SettingsCard>
    );
}
export default withStyles(styles, { withTheme: true })(ChatlogSettings);