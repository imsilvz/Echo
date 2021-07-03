import React from "react";
import { withStyles } from '@material-ui/styles';

import ChatLink from './ChatLink';

const styles = theme => ({
    chatMessage: {
        margin:0,
        fontSize:"1rem",
        textShadow: "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black",
        '& span': {
            display: "inline",
        }
    }
});

const HexToHighlight = function(hexCode, alpha) {
    if(hexCode[0] == '#') {
        hexCode = hexCode.substr(1, hexCode.length - 1);
    }

    if(hexCode.length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = hexCode.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return `rgba(${aRgb[0]},${aRgb[1]},${aRgb[2]},${alpha})`;
}

function LinkHighlight(MessageContent, color="#000000") {
    let highlightColor = HexToHighlight(color, 0.2);
    let message = MessageContent.Message;
    let links = MessageContent.Links;
    
    let collection = [];
    
    // no links in the message!
    if(!links.length) {
        return [MessageContent.Message];
    }

    // push initial substring
    collection.push(
        message.substr(
            0, 
            links[0].StartIndex
        )
    );

    // begin loop!
    for(let i=0; i<links.length; i++) {
        let link = links[i];
        let content = message.substr(
            link.StartIndex, 
            link.Length
        );

        // add link to collection
        collection.push(
            <ChatLink
                color={highlightColor}
                content={content}
            />
        );

        if((i+1) < links.length) {
            // add text between links
            let nextLink = links[i+1];
            content = message.substr(
                link.StartIndex + link.Length,
                nextLink.StartIndex - (link.StartIndex + link.Length)
            );
        } else {
            // add text between link and end of message
            content = message.substr(
                link.StartIndex + link.Length,
                message.length - (link.StartIndex + link.Length)
            );
        }
        collection.push(content);
    }
    return collection;
}

function QuoteHighlight(collection) {

}

const MessageTypeDict = {
    "DEFAULT": {
        Name: "Default",
        Color: "#FFFFFF",
        IsSystem: false,
        IsBattle: false,
        Parse: function(message) {
            let channel = this.Name.toUpperCase();
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let msgText = message.MessageContent.Message;

            let collection = LinkHighlight(
                message.MessageContent, 
                this.Color
            );

            if(this.IsSystem) {
                return (
                    <span style={{color:this.Color}}>
                        {collection}
                    </span>
                );
            } else {
                if(server) {
                    return (
                        <span style={{color:this.Color}}>
                            {`[${channel}] ${name} (${server}): `}
                            {collection}
                        </span>
                    )
                }
                return (
                    <span style={{color:this.Color}}>
                        {`[${channel}] ${name}: `}
                        {collection}   
                    </span>
                )
            }
        }
    }
}

function AddMessageType(code, opts) {
    let messageType = Object.assign(
        {}, MessageTypeDict["DEFAULT"], opts
    );

    for(let name in messageType) {
        let prop = messageType[name];
        if(typeof(prop) == "function") {
            let bound = messageType[name].bind(messageType);
            messageType[name] = bound;
        }
    }
    MessageTypeDict[code] = messageType;
}
AddMessageType("0003", { 
    Name: "Welcome", 
    IsSystem: true 
});
AddMessageType("0039", { 
    Name: "System", 
    Color: "#cccccc",
    IsSystem: true 
});
AddMessageType("0044", { 
    Name: "Error", 
    IsSystem: true 
});
AddMessageType("0048", { 
    Name: "PartyFinder", 
    Color: "#cccccc",
    IsSystem: true 
});
AddMessageType("000A", { Name: "Say" });
AddMessageType("000B", { 
    Name: "Shout",
    Color: "#ffa666"
});
AddMessageType("000C", {
    Name: "Tell (Outgoing)",
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
});
AddMessageType("000D", {
    Name: "Tell (Incoming)",
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
});
AddMessageType("001B", {
    Name: "Novice", // Novice Network
    Color: "#d4ff7d"
});
AddMessageType("001C", {
    Name: "Emote",
    Parse: (message) => {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let msg = message.MessageContent.Message;
        if(server) {
            return (
                <span style={{color:"#bafff0"}}>
                    {`[EMOTE] ${name} (${server}) ${msg}`}
                </span>
            );
        }
        return (
            <span style={{color:"#bafff0"}}>
                {`[EMOTE] ${name} ${msg}`}
            </span>
        );
    }
});
AddMessageType("001D", {
    Name: "Animated Emote",
    Parse: (message) => {
        let msg = message.MessageContent.Message;
        return (
            <span style={{color:"#bafff0"}}>
                {`[EMOTE] ${msg}`}
            </span>
        );
    }
});
AddMessageType("001E", {
    Name: "Yell",
    Color: "#ffff00"
});

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