import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

const ShowServer = (props) => {
    const { name } = props;
    return (
        <Grid container>
            <Grid item xs={12} sm={6}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={true} 
                                name={`${name}showServer`}
                                onClick={() => {

                                }}
                            />
                        }
                        label="Show Server Tag"
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
}
export default ShowServer;