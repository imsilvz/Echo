import React from "react";
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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
        
        height: "100%",
        overflow: "hidden",
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

const MessageRow = ({data, index, style}) => {
    let item = data.Messages[index];
    const rowRef = React.useRef({});

    React.useEffect(() => {
        if(rowRef.current) {
            data.SetHeight(index, rowRef.current.clientHeight);
        }
    }, [rowRef]);

    return (
        <div id={item.UUID} key={item.UUID} style={style}>
            <ChatMessage
                innerRef={rowRef}
                message={item}
                settings={data.Settings}
            />
        </div>
    );
}

class MessageList extends React.Component
{
    constructor(props) {
        super(props);

        this.listRef = React.createRef();
        this.rowHeights = {};
        this.scrollUpdate = false;
        this.state = {
            startIndex: -1, 
            stopIndex: -1,
            scrollLock: true,
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState) {
        const { Messages, ShowScrollHelper } = this.props;
        const { scrollLock, stopIndex } = this.state;

        if(scrollLock != prevState.scrollLock) {
            ShowScrollHelper(!!!scrollLock);
        }

        if(scrollLock) {
            if(this.rowHeights[stopIndex]) {
                this.scrollToBottom();
            }
        }
    }

    onScroll(direction, requested) {
        const { Messages } = this.props;
        const { stopIndex } = this.state;

        if(requested) { return; }
        if(direction === "backward") {
            this.setState({
                scrollLock: false,
            });
        } else {
            if(stopIndex == Messages.length - 1) {
                if(Messages[stopIndex]) {
                    let uuid = Messages[stopIndex].UUID;
                    let elem = document.getElementById(uuid);
                    let panel = document.getElementById("messagelog_panel");

                    let rect = elem.getBoundingClientRect();
                    let panelRect = panel.getBoundingClientRect();
                    let panelPadding = parseInt(getComputedStyle(panel).paddingBottom);
                    if(rect.bottom <= (panelRect.bottom - panelPadding)) {
                        this.setState({
                            scrollLock: true,
                        });
                    }
                }
            }
        }
    }

    onRowsRendered(startIndex, stopIndex) {
        this.setState({
            startIndex: startIndex,
            stopIndex: stopIndex
        });
    }

    setRowHeight(index, height) {
        this.listRef.current.resetAfterIndex(0);
        this.rowHeights = {
            ...this.rowHeights,
            [index]: height,
        };
    }

    getRowHeight(index) {
        return this.rowHeights[index] || 25;
    }
    
    scrollToBottom() {
        const { Messages } = this.props;
        const { scrollLock } = this.state;

        if(this.listRef.current) {
            if(!scrollLock) {
                this.setState({
                    scrollLock: true,
                });
            }
            this.listRef.current.scrollToItem(
                Messages.length - 1,
                "end"
            );
        }
    }

    handleResize() {
        if(this.listRef.current) {
            this.listRef.current.resetAfterIndex(0);
        }
    }

    render() {
        const { classes, width, height } = this.props;
        const { Messages, Settings } = this.props;


        return (
            <List
                className={classes.messageContainer}
                width={width}
                height={height}
                itemCount={Messages.length}
                itemData={{Messages: Messages, Settings: Settings, SetHeight: (index, height) => this.setRowHeight(index, height)}}
                itemSize={(index) => this.getRowHeight(index)}
                onScroll={({ scrollDirection, scrollUpdateWasRequested }) => this.onScroll(scrollDirection, scrollUpdateWasRequested)}
                onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => this.onRowsRendered(visibleStartIndex, visibleStopIndex)}
                ref={this.listRef}
            >
                {MessageRow}
            </List>
        )
    }
}

class MessageLog extends React.Component
{
    constructor(props) {
        super(props);
        this.panelRef = React.createRef();
        this.messageListRef = React.createRef();
        this.state = {
            showScrollHelper: false,
        }
    }

    componentDidMount() {
        this.ResizeSensor = new ResizeObserver(entries => {
            if(this.messageListRef.current) {
                this.messageListRef.current.handleResize();
            }
        });

        if(this.panelRef.current) {
            this.ResizeSensor.observe(
                this.panelRef.current
            );
        }
    }

    componentWillUnmount() {
        if(this.panelRef.current) {
            this.ResizeSensor.unobserve(
                this.panelRef.current
            );
        }
    }

    render() {
        const { classes } = this.props;
        const { Settings } = this.props;
        const { Messages, EmptyMessage } = this.props;
        const { showScrollHelper } = this.state;

        return (
            <div 
                id="messagelog_panel"
                className={classes.messagePanel} 
                ref={this.panelRef}
            >
                <AutoSizer>
                    {({ height, width }) => (
                        <MessageList
                            classes={classes}
                            width={width}
                            height={height}
                            Settings={Settings}
                            Messages={Messages}
                            ShowScrollHelper={(bool) => this.setState({showScrollHelper: bool})}
                            ref={this.messageListRef}
                        />
                    )}
                </AutoSizer>
                { Messages.length <= 0 ? (
                    <div className={classes.messageCentered}>
                        <p>{EmptyMessage}</p>
                    </div>
                ) : (
                    <React.Fragment>
                    {showScrollHelper && (
                        <div className={classes.scrollCatchup}>
                            <Button 
                                className={classes.scrollButton}
                                endIcon={<ArrowDownwardIcon/>} 
                                size="small" 
                                variant="contained"
                                onClick={() => {
                                    if(this.messageListRef.current) {
                                        this.messageListRef.current.scrollToBottom();
                                    }
                                }}
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