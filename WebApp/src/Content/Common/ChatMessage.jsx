import React from "react";
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    chatMessage: {
        margin:0,
        fontSize:"1rem",
        textShadow: "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black",
        '& span': {
            display: "block",
        }
    }
});

const MessageTypeDict = {
    "0003": {
        Name: "Welcome Message",
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.MessageContent.Message}
                </span>
            );
        }
    },
    "0039": {
        Name: "System Message",
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.MessageContent.Message}
                </span>
            );
        }
    },
    "0044": {
        Name: "System Error",
        Parse: (message) => {
            return (
                <span style={{

                }}>
                    {message.MessageContent.Message}
                </span>
            );
        }
    },
    "0048": {
        Name: "Party Finder Message",
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.MessageContent.Message}
                </span>
            );
        }
    },
    "000A": {
        Name: "Say",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return `[SAY] ${name} (${server}): ${msg}`
            }
            return `[SAY] ${name}: ${msg}`;
        }
    },
    "000B": {
        Name: "Shout",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return (
                    <span style={{color:"#ffa666"}}>
                        {`[SHOUT] ${name} (${server}): ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#ffa666"}}>
                    {`[SHOUT] ${name}: ${msg}`}
                </span>
            );
        }
    },
    "000C": {
        Name: "Whisper (Outgoing)",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return (
                    <span style={{color:"#ffb8de"}}>
                        {`>> ${name} (${server}): ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#ffb8de"}}>
                    {`>> ${name}: ${msg}`}
                </span>
            );
        }
    },
    "000D": {
        Name: "Tell (Incoming)",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return (
                    <span style={{color:"#ffb8de"}}>
                        {`${name} (${server}) >> ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#ffb8de"}}>
                    {`${name} >> ${msg}`}
                </span>
            );
        }
    },
    "001B": {
        Name: "Novice Network",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return (
                    <span style={{color:"#d4ff7d"}}>
                        {`[NOVICE] ${name} (${server}): ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#d4ff7d"}}>
                    {`[NOVICE] ${name}: ${msg}`}
                </span>
            );
        }
    },
    "001C": {
        Name: "Emote",
        IsSystem: false,
        Parse: (message) => {
            let msg = message.MessageContent.Message;
            return (
                <span style={{color:"#bafff0"}}>
                    {`[EMOTE] ${msg}`}
                </span>
            );
        }
    },
    "001D": {
        Name: "Animated Emote",
        IsSystem: false,
        Parse: (message) => {
            let msg = message.MessageContent.Message;
            return (
                <span style={{color:"#bafff0"}}>
                    {`[EMOTE] ${msg}`}
                </span>
            );
        }
    },
    "001E": {
        Name: "Yell",
        IsSystem: false,
        Parse: (message) => {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msg = message.MessageContent.Message;
            if(server) {
                return (
                    <span style={{color:"#ffff00"}}>
                        {`[YELL] ${name} (${server}): ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#ffff00"}}>
                    {`[YELL] ${name}: ${msg}`}
                </span>
            );
        }
    }
}

function FormatChatMessage(message) {
    if(MessageTypeDict.hasOwnProperty(message.MessageType)) {
        // if we have a parse method
        let messageType = MessageTypeDict[message.MessageType];
        return messageType.Parse(message);
    }
    // default handling
    return message.Combined;
}

const ChatMessage = (props) => {
    const { classes, message } = props;
    let formatted = FormatChatMessage(message);
    return (
        <p className={classes.chatMessage}>{formatted}</p>
    );
}
export default withStyles(styles, { withTheme: true })(ChatMessage);