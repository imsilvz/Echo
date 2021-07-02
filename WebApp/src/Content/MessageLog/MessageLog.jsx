import React from "react";
import { connect } from "react-redux";
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
        position: "absolute",
        left: theme.spacing(1),
        right: theme.spacing(1),
        bottom: theme.spacing(0.5),

        maxHeight: "100%",
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
        top: -theme.spacing(0.5),
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

class MessageLog extends React.Component
{
    constructor(props) {
        super(props);
        this.messageEndRef = React.createRef();
        this.messageEndRef2 = React.createRef();
        this.messagePanelRef = React.createRef();
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.state = {
            smartScrollTop: true,
            smartScrollBot: true,
        }

        // observers to report on intersections
        const observerSettings = {
            root: null,
            rootMargin: "0px",
            threshold:1
        }

        // two observers, as the callback only reports changed state
        const topObserver = new IntersectionObserver((entries) => {
            const [ entry ] = entries;
            this.setState({
                smartScrollTop: entry.isIntersecting
            });
        }, observerSettings);
        const botObserver = new IntersectionObserver((entries) => {
            const [ entry ] = entries;
            this.setState({
                smartScrollBot: entry.isIntersecting
            });
        }, observerSettings);
        this.TopScrollObserver = topObserver;
        this.BottomScrollObserver = botObserver;
    }

    componentDidMount() {
        this.scrollToBottom("auto");
        if(this.messageEndRef.current) {
            this.BottomScrollObserver.observe(
                this.messageEndRef.current
            )
        }
        if(this.messageEndRef2.current) {
            this.TopScrollObserver.observe(
                this.messageEndRef2.current
            );
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { smartScrollTop, smartScrollBot } = this.state;

        // only scroll if new messages
        let prevLen = prevProps.Messages.length;
        let currLen = this.props.Messages.length;
        if(prevLen != currLen) {
            // autoscroll only if we are at bottom
            if(smartScrollBot)
            {
                if(prevProps.Messages.length == 0) {     
                    this.scrollToBottom("auto");
                } else {
                    this.scrollToBottom();
                }
            }
        }
    }

    componentWillUnmount() {
        if(this.messageEndRef.current) {
            this.BottomScrollObserver.unobserve(
                this.messageEndRef.current
            );
        }
        if(this.messageEndRef2.current) {
            this.TopScrollObserver.unobserve(
                this.messageEndRef2.current
            );
        }
    }

    scrollToBottom(behavior = "smooth") {
        if(this.messageEndRef.current) {
            this.messageEndRef.current.scrollIntoView({
                behavior: behavior
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { Messages, EmptyMessage } = this.props;
        const { smartScrollTop, smartScrollBot } = this.state;

        // dynamically position top depending on panel size
        let panel = this.messagePanelRef.current;
        let panelHeight = 0;
        if(panel) {
            panelHeight = panel.offsetHeight;
        }
        return (
            <div 
                className={classes.messagePanel} 
                ref={this.messagePanelRef}
            >
                { Messages.length > 0 ? (
                    <React.Fragment>
                        <div className={classes.messageContainer}>
                            {Messages.map((item, idx) => {
                                return (
                                    <ChatMessage key={idx} message={item}/>
                                );
                            })}
                            <div className={classes.messageEnd} ref={this.messageEndRef}/>
                            <div className={classes.messageEnd} style={{top: -panelHeight}} ref={this.messageEndRef2}/>
                        </div>
                        {!!!(smartScrollTop || smartScrollBot) && (
                            <div className={classes.scrollCatchup}>
                                <Button 
                                    className={classes.scrollButton}
                                    endIcon={<ArrowDownwardIcon/>} 
                                    size="small" 
                                    variant="contained"
                                    onClick={() => {
                                        console.log("Hello World!");
                                        this.scrollToBottom();
                                    }}
                                >
                                    Jump to Present
                                </Button>
                            </div>
                        )}
                    </React.Fragment>
                ) : (
                    <div className={classes.messageCentered}>
                        <p>{EmptyMessage}</p>
                    </div>
                )}
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(MessageLog);