import React from "react";
import { Virtuoso } from 'react-virtuoso';
import { withStyles } from '@material-ui/styles';

import Button from "@material-ui/core/Button";
import ChatMessage from "../Common/ChatMessage";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const styles = theme => ({
    messagePanel: {
        position: "relative",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),

        display: "flex",
        flexDirection: "column-reverse",
        
        height: "100%",
        overflow: "hidden",
    },
    messageInnerPanel: {
        minHeight: "1px",
        maxHeight: "100%",
    },
    messageContainer: {
        //position: "absolute",
        //left: theme.spacing(1),
        //right: theme.spacing(1),
        //bottom: theme.spacing(0.5),

        //maxHeight: "100%",
        overflowY: "scroll",

        '&::-webkit-scrollbar': {
            display:"none",
        },
        '&::-webkit-scrollbar-thumb': {
            display:"none",
        }
    },
    messageCentered: {
        width: "100%",
        height: "100%",

        display: "flex",
        textAlign: "center",

        alignItems: "center",
        justifyContent: "center",
    },
    messageEnd: {
        position: "relative",
        top: -theme.spacing(1),
    },
    scrollButton: {
        width: "100%",
        height: "22px",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 1)",
        color: theme.palette.text.secondary,
        backgroundColor: "rgba(66, 66, 66, 0.95)",
        '&:hover': {
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 1)",
            color: theme.palette.text.primary,
            backgroundColor: "rgba(66, 66, 66, 0.95)"
        }
    },
    scrollCatchup: {
        position: "absolute",
        
        left: theme.spacing(1),
        right: theme.spacing(1),
        bottom: theme.spacing(0.75),

        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    }
});

const MessageRow = (props) => {
    const { Index, Message, Settings } = props;
    const rowRef = React.useRef({});

    return (
        <div id={Message.UUID} key={Message.UUID}>
            <ChatMessage
                innerRef={rowRef}
                message={Message}
                settings={Settings}
            />
        </div>
    );
}

class MessageLog extends React.Component
{
    constructor(props) {
        super(props);
        this.panelRef = React.createRef();
        this.messageListRef = React.createRef();
        this.state = {
            showScrollHelper: false,
            scrollAtBottom: true,
            scrollLock: true,
        }
    }

    scrollToBottom() {
        const { Messages } = this.props;

        let listRef = this.messageListRef.current;
        if(listRef) {
            listRef.scrollToIndex({
                index: Messages.length - 1,
                align: "end",
                behavior: "auto"
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { Settings } = this.props;
        const { Messages, EmptyMessage } = this.props;
        const { showScrollHelper, scrollAtBottom, scrollLock } = this.state;

        return (
            <div 
                id="messagelog_panel"
                className={classes.messagePanel} 
                ref={this.panelRef}
            >
                { Messages.length <= 0 ? (
                        <div className={classes.messageCentered}>
                            <p>{EmptyMessage}</p>
                        </div>
                    ) : (
                        <React.Fragment>
                            <Virtuoso
                                className={classes.messageContainer}
                                totalCount={Messages.length}
                                initialTopMostItemIndex={Messages.length - 1}
                                itemContent={(index) => (
                                    <MessageRow
                                        Index={index}
                                        Message={Messages[index]}
                                        Settings={Settings}
                                    />
                                )}
                                alignToBottom={true}
                                followOutput={(atBottom) => {
                                    if(scrollLock) { return "smooth"; }
                                    return false;
                                }}
                                atBottomStateChange={(atBottom) => {
                                    if(atBottom) {
                                        this.setState({
                                            showScrollHelper: false,
                                            scrollAtBottom: true,
                                            scrollLock: true,
                                        });
                                    } else {
                                        this.setState({
                                            scrollAtBottom: false,
                                        });
                                    }
                                }}
                                isScrolling={(scrolling) => {
                                    console.log(`Scrolling: ${scrolling} | At Bottom: ${scrollAtBottom}`);
                                    if(!scrolling) {
                                        if(!scrollAtBottom && scrollLock) {
                                            this.setState({
                                                scrollLock: false
                                            });
                                        }
                                    }
                                }}
                                rangeChanged={(range) => {
                                    if(!showScrollHelper) {
                                        if(range.endIndex <= Messages.length - 5) {
                                            this.setState({
                                                showScrollHelper: true,
                                            });
                                        }
                                    }
                                }}
                                ref={this.messageListRef}
                            />
                            {showScrollHelper && (
                                <div className={classes.scrollCatchup}>
                                    <Button 
                                        className={classes.scrollButton}
                                        endIcon={<ArrowDownwardIcon/>} 
                                        size="small" 
                                        variant="contained"
                                        onClick={() => { this.scrollToBottom(); }}
                                    >
                                        Jump to Present
                                    </Button>
                                </div>
                            )}
                        </React.Fragment>
                    )}
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(MessageLog);