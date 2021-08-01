import React from 'react';
import { withStyles } from '@material-ui/styles';

import Divider from '@material-ui/core/Divider';
import SettingsCard from '../SettingsCard';
import MessageTypeSettings from './MessageTypeSettings';
import JobColorSettings from './JobColorSettings';

const styles = theme => ({
    CardHeaderText: {
        fontSize: "1.5rem",
        textShadow: "1px 1px 4px black",
    },
    CardHeaderContainer: {
        paddingTop: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
    },
    SettingsCard: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
});

const CommonSettings = (props) => {
    const { classes } = props;
    return (
        <SettingsCard name="Common Settings">
            <MessageTypeSettings/>
            <Divider/>
            <JobColorSettings/>
            <Divider/>
        </SettingsCard>
    );
}
export default withStyles(styles, { withTheme: true })(CommonSettings);