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

const ChatCodeDict = {
    "0003": {
        Name: "Welcome Message",
        IsSystem: true,
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.Message}
                </span>
            );
        }
    },
    "0039": {
        Name: "Status Message",
        IsSystem: true,
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.Message}
                </span>
            );
        }
    },
    "0048": {
        Name: "System Message",
        IsSystem: true,
        Parse: (message) => {
            return (
                <span style={{
                    color:"#cccccc"
                }}>
                    {message.Message}
                </span>
            );
        }
    },
    "000A": {
        Name: "Say",
        IsSystem: false,
        Parse: (message) => {
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
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
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
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
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
            if(server) {
                return (
                    <span style={{color:"#ffb8de"}}>
                        {`>> ${name} (${server}): ${msg}`}
                    </span>
                );
            }
            return (
                <span style={{color:"#ffb8de"}}>
                    {`>>${name}: ${msg}`}
                </span>
            );
        }
    },
    "000D": {
        Name: "Tell (Incoming)",
        IsSystem: false,
        Parse: (message) => {
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
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
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
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
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
            let msgText = msg.substring(msg.indexOf(":") + 1);
            
            // temporary fix for my emotes!
            if(name == "") {
                name = msg.substring(0, msg.indexOf(":"));
            }

            return (
                <span style={{color:"#bafff0"}}>
                    {`[EMOTE] ${name} ${msgText}`}
                </span>
            );
        }
    },
    "001D": {
        Name: "Animated Emote",
        IsSystem: false,
        Parse: (message) => {
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
            let msgText = msg.substring(msg.indexOf(":") + 1);

            for(let i=0; i<message.Tokens.length; i++)
            {
                let token = message.Tokens[i];
                // 010101 is the message sender, but that does not matter in these emotes
                if(token.LinkType && token.LinkType != "01010101")
                {
                    // try to correct emote names
                    if(i+1 < message.Tokens.length)
                    {
                        let serverToken = message.Tokens[i+1];
                        if(serverToken.ServerName)
                        {
                            // filter combined out
                            let combined = token.LinkValue + serverToken.ServerName;
                            msgText = msgText.replace(
                                combined, 
                                `${token.LinkValue} (${serverToken.ServerName})`
                            );
                        }
                    }
                }
            }

            return (
                <span style={{color:"#bafff0"}}>
                    {`[EMOTE] ${msgText}`}
                </span>
            );
        }
    },
    "001E": {
        Name: "Yell",
        IsSystem: false,
        Parse: (message) => {
            let name = message.PlayerName;
            let server = message.PlayerServer;
            let msg = message.Message;
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
    if(ChatCodeDict.hasOwnProperty(message.Code)) {
        // if we have a parse method
        let messageType = ChatCodeDict[message.Code];
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