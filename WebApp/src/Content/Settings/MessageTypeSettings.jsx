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

import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
    }
});

const ColoredRect = (props) => {
    const { color } = props;
    return (
        <svg style={{
            display:'inline-block', 
            width:'1.1876em', 
            height:'1.1876em',
            margin: '3px 0 7px',
        }}>
            <rect 
                x="1" 
                y="1"
                width="calc(1.1876em - 2px)" 
                height="calc(1.1876em - 2px)" 
                style={{
                    fill: color,
                    stroke: "black",
                    strokeWidth: "1"
                }}
            />
        </svg>
    );
}

const MessageTypeRow = (props) => {
    const { code, data } = props;
    const dispatch = useDispatch();
    let messageType = data[code];
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <Typography style={{
                    color: messageType.Color,
                    fontWeight:"400",
                    textShadow: `
                    -1px -1px 0 rgba(0, 0, 0, 0.7),  
                    1px -1px 0 rgba(0, 0, 0, 0.7),
                    -1px 1px 0 rgba(0, 0, 0, 0.7),
                    1px 1px 0 rgba(0, 0, 0, 0.7)`,
                    whiteSpace: "nowrap"
                }}>
                    {messageType.Name}
                </Typography>
            </TableCell>
            <TableCell padding="checkbox">
                <Tooltip title="Battle Message" TransitionComponent={Zoom}>
                    <Checkbox 
                        color="primary"
                        checked={messageType.IsBattle}
                        onClick={() => {
                            dispatch({
                                type: "UPDATE_COMMON_SETTINGS",
                                data: {
                                    ChatTypes: {
                                        ...data,
                                        [code]: {
                                            ...messageType,
                                            IsBattle: !messageType.IsBattle
                                        }
                                    }
                                }
                            });
                        }}
                    />
                </Tooltip>
            </TableCell>
            <TableCell padding="checkbox">
                <Tooltip title="System Message" TransitionComponent={Zoom}>
                    <Checkbox 
                        color="primary"
                        checked={messageType.IsSystem}
                        onClick={() => {
                            dispatch({
                                type: "UPDATE_COMMON_SETTINGS",
                                data: {
                                    ChatTypes: {
                                        ...data,
                                        [code]: {
                                            ...messageType,
                                            IsSystem: !messageType.IsSystem
                                        }
                                    }
                                }
                            });
                        }}
                    />
                </Tooltip>
            </TableCell>
            <TableCell padding="checkbox">
                <Tooltip 
                    title="Enables quote highlights" 
                    TransitionComponent={Zoom}
                >
                {(messageType.IsBattle || messageType.IsSystem) ? (
                    <Checkbox checked={false} disabled/>
                ) : (
                    <Checkbox 
                        color="primary"
                        checked={messageType.IsRpChat}
                        onClick={() => {
                            dispatch({
                                type: "UPDATE_COMMON_SETTINGS",
                                data: {
                                    ChatTypes: {
                                        ...data,
                                        [code]: {
                                            ...messageType,
                                            IsRpChat: !messageType.IsRpChat
                                        }
                                    }
                                }
                            });
                        }}
                    />
                )}
                </Tooltip>
            </TableCell>
            <TableCell padding="checkbox">
                <Tooltip 
                    color="primary"
                    title="Enable colored names for this message type" 
                    TransitionComponent={Zoom}
                >
                {(messageType.IsBattle || messageType.IsSystem) ? (
                    <Checkbox checked={false} disabled/>
                ) : (
                    <Checkbox 
                        color="primary"
                        checked={messageType.NameHighlight}
                        onClick={() => {
                            dispatch({
                                type: "UPDATE_COMMON_SETTINGS",
                                data: {
                                    ChatTypes: {
                                        ...data,
                                        [code]: {
                                            ...messageType,
                                            NameHighlight: !messageType.NameHighlight
                                        }
                                    }
                                }
                            });
                        }}
                    />
                )}
                </Tooltip>
            </TableCell>
            <TableCell>
                <TextField
                    size="small"
                    margin="none"
                    value={messageType.Color}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ColoredRect color={messageType.Color}/>
                            </InputAdornment>
                        ),
                        inputProps: {
                            style: {
                                cursor: "pointer",
                            }
                        },
                        style: {
                            color: "inherit",
                            cursor: "pointer",
                        }
                    }}
                    disabled
                    onClick={(e) => {
                        console.log("Hello World")
                        e.preventDefault();
                    }}
                />
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
                                <TableCell padding="default">RP Chat</TableCell>
                                <TableCell padding="default">Colored Name</TableCell>
                                <TableCell>Color</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(messageTypes).map((code) => {
                                return (
                                    <MessageTypeRow
                                        key={`settings_msgtype_${code}`}
                                        code={code}
                                        data={messageTypes}
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