import React from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';

import ChatMessage from "../Common/ChatMessage";

const styles = theme => ({
    messagePanel: {
        position: "relative",
        display: "flex",
        flexDirection: "column",

        height: "100%",
        overflowX: "hidden",
        overflowY: "scroll",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),

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
});

@connect(state => ({ chatLog: state.chatlog }))
class Chatlog extends React.Component
{
    constructor(props) {
        super(props);
        this.messageEndRef = React.createRef();
    }

    componentDidMount() {
        this.scrollToBottom("auto");
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.chatLog.length == 0) {     
            this.scrollToBottom("auto");
        } else {
            this.scrollToBottom();
        }
    }

    scrollToBottom(behavior = "smooth") {
        this.messageEndRef.current.scrollIntoView({
            behavior: behavior
        });
    }

    render() {
        const { classes, chatLog } = this.props;
        return (
            <div className={classes.messagePanel}>
                {chatLog.map((element, index) => {
                    return (
                        <ChatMessage key={index} message={element}/>
                    );
                })}
                <div ref={this.messageEndRef}/>
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(Chatlog);