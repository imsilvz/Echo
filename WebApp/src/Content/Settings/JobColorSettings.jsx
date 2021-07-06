import React from 'react';
import { withStyles } from '@material-ui/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
    }
});

const JobColorSettings = (props) => {
    const { classes } = props;
    const test = false;
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Job Color Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={test} 
                                        name="jobColors"
                                    />
                                }
                                label="Enable Job Colors"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item className={classes.buttonContainer} xs={12} sm={6}>
                        <Button variant="outlined">
                            Customize Job Colors
                        </Button>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}
export default withStyles(styles, { withTheme: true })(JobColorSettings);