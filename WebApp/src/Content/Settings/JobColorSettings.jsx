import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
    }
});

const JobColorSettings = (props) => {
    const { classes } = props;
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const jobColorsEnabled = useSelector((state) => 
        state.settings.CommonSettings.JobColorsEnabled
    );

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

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
                                        checked={jobColorsEnabled} 
                                        name="jobColorsEnabled"
                                        onClick={() => {
                                            dispatch({
                                                type: "SET_ENABLE_JOB_COLORS",
                                                data: !jobColorsEnabled
                                            });
                                        }}
                                    />
                                }
                                label="Enable Job Colors"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item className={classes.buttonContainer} xs={12} sm={6}>
                        <Button onClick={handleClick} variant="outlined">
                            Customize Job Colors
                        </Button>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}

                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
                message="Not yet implemented!"
            />
        </Accordion>
    )
}
export default withStyles(styles, { withTheme: true })(JobColorSettings);