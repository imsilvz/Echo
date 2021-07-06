import React from 'react';
import { withStyles } from '@material-ui/styles';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

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
    }
});

const CommonSettings = (props) => {
    const { classes } = props;
    return (
        <Card className={classes.SettingsCard}>
            <Box className={classes.CardHeaderContainer}>
                <Typography
                    className={classes.CardHeaderText}
                    component="h2"
                    variant="h4"
                >
                    Common Settings
                </Typography>
            </Box>
            <JobColorSettings/>
            <Divider/>
            <JobColorSettings/>
            <Divider/>
            <JobColorSettings/>
        </Card>
    )
}
export default withStyles(styles, { withTheme: true })(CommonSettings);