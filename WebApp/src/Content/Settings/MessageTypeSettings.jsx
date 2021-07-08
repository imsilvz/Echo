import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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

const MessageTypeRow = (props) => {
    const { code, data } = props;
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {data.Name}
            </TableCell>
            <TableCell padding="checkbox">
                <Checkbox checked={data.IsBattle}/>
            </TableCell>
            <TableCell padding="checkbox">
                <Checkbox checked={data.IsSystem}/>
            </TableCell>
            <TableCell padding="checkbox">
                {(data.IsBattle || data.IsSystem) ? (
                    <Checkbox checked={false} disabled/>
                ) : (
                    <Checkbox checked={data.IsRpChat}/>
                )}
            </TableCell>
            <TableCell padding="checkbox">
                {(data.IsBattle || data.IsSystem) ? (
                    <Checkbox checked={false} disabled/>
                ) : (
                    <Checkbox checked={data.NameHighlight}/>
                )}
            </TableCell>
            <TableCell>
                {data.Color}
            </TableCell>
        </TableRow>
    )
}

const MessageTypeSettings = (props) => {
    const { classes } = props;
    const dispatch = useDispatch();
    const messageTypes = useSelector((state) => 
        state.settings.CommonSettings.ChatTypes
    );

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Message Type Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer 
                    component={Paper} 
                    elevation={0}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Message Type</TableCell>
                                <TableCell>Battle</TableCell>
                                <TableCell>System</TableCell>
                                <TableCell padding="normal">RP Chat</TableCell>
                                <TableCell padding="normal">Name Highlight</TableCell>
                                <TableCell>Color</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(messageTypes).map((code, i) => {
                                let row = messageTypes[code];
                                return (
                                    <MessageTypeRow
                                        key={`settings_msgtype_${code}`}
                                        code={code}
                                        data={row}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    )
}
export default withStyles(styles, { withTheme: true })(MessageTypeSettings);