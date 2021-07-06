import React from "react";
import { useSelector } from "react-redux";
import { withStyles } from '@material-ui/styles';

import ChatContent from './ChatContent';
import ChatLink from './ChatLink';
import ChatQuote from './ChatQuote';
import store from "../../store";

const styles = theme => ({
    chatMessage: {
        margin:0,
        fontSize:"18px",
        fontWeight:"400",
        textShadow: `
        -1px -1px 0 black,  
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black`,
        '& span': {
            display: "inline",
        }
    },
});

function LinkHighlight(MessageContent, color="#000000", linkHighlight=false, key) {
    let message = MessageContent.Message;
    let links = MessageContent.Links;
    
    // no links in the message!
    if(!links.length) {
        return [MessageContent.Message];
    }

    let state = store.getState();
    let actorDict = state.actors;

    // push initial substring
    let collection = [];
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
        let linkKey = key ? 
            `${key}_Link_${i}` : 
            `${link.UUID}_${i}`;
        collection.push(
            <ChatLink
                key={linkKey}
                uuid={linkKey}
                color={color}
                content={content}
                shouldHighlight={linkHighlight}
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

function QuoteHighlight(message, collection, color, rpChat) {
    let emoteColor = MessageTypeDict["001C"].Color;
    let newCollection = [];
            
    // find if there are any quotes
    // do this for rpchat functionality!
    let hasQuote = false;
    if(rpChat) {
        for(let item of collection) {
            if(typeof(item) == "string") {
                if(item.includes("\"")) {
                    hasQuote = true;
                    break;
                }
            }
        }
    }

    // no highlighting to be done
    if(!hasQuote) { return collection; }
    let baseKey = `${message.UUID}_Quote`
    let quoteCounter = 0;

    let inQuote = false;
    let quoteData = [];
    for(let item of collection) {
        if(typeof(item) == "string") {
            let segments = item.split(/(\")/);
            for(let idx=0; idx<segments.length; idx++) {
                // check if segment is a delim
                if(segments[idx] == "\"") {
                    if(inQuote) {
                        // end quote
                        inQuote = false;
                        quoteData.push(segments[idx]);
                        
                        // add to collection
                        newCollection.push((
                            <ChatQuote 
                                color={color} 
                                content={quoteData}
                                uuid={`${baseKey}_${quoteCounter++}`}
                            />
                        ));
                        quoteData = [];
                        continue;
                    }
                    // start quote
                    inQuote = true;
                    quoteData.push(segments[idx]);
                    continue;
                }
        
                // 
                if(inQuote) {
                    // add additional quote data
                    quoteData.push(segments[idx]);
                }
                else
                {
                    // add to new collection
                    if(rpChat) {
                        newCollection.push((
                            <ChatQuote
                                color={emoteColor}
                                content={segments[idx]}
                                uuid={`${baseKey}_${quoteCounter++}`}
                            />
                        ));
                    } else {
                        newCollection.push(segments[idx]);
                    }
                }
            }   
        } else {
            // 
            if(inQuote) {
                // add additional quote data
                quoteData.push(item);
            }
            else
            {
                // add to new collection
                if(rpChat) {
                    newCollection.push((
                        <ChatQuote
                            color={emoteColor}
                            content={item}
                            uuid={`${baseKey}_${quoteCounter++}`}
                        />
                    ));
                } else {
                    newCollection.push(item);
                }
            }
        }
    }

    // handle leftover
    if(inQuote) {
        newCollection.push((
            <ChatQuote
                color={color}
                content={quoteData}
            />
        ));
    }

    return newCollection;
}

const MessageTypeDict = {
    "DEFAULT": {
        Name: "Default",
        Color: "#F7F7F7",
        IsSystem: false,
        IsBattle: false,
        RpChat: false,
        NameHighlight: false,
        Parse: function(message) {
            let channel = this.Name.toUpperCase();
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let linkedMsg = LinkHighlight(
                message.MessageContent, 
                this.Color
            );
    
            let collection = QuoteHighlight(
                message,
                linkedMsg,
                MessageTypeDict["DEFAULT"].Color,
                this.RpChat
            );

            let content = (
                <ChatContent
                    key={`${message.UUID}_Content`}
                    uuid={`${message.UUID}_Content`}
                    content={collection}
                />
            );

            if(name) {
                name = LinkHighlight({ 
                    Links: [{ StartIndex: 0, Length: name?.length }],
                    Message: name,
                }, this.Color, this.NameHighlight, `${message.UUID}_Source`);
            }

            if(this.IsSystem) {
                return (
                    <span style={{color:this.Color}}>
                        {content}
                    </span>
                );
            } else {
                if(server) {
                    return (
                        <span style={{color:this.Color}}>
                            {/*`[${channel}] `*/}
                            {name}
                            {` (${server}): `}
                            {content}
                        </span>
                    )
                }
                return (
                    <span style={{color:this.Color}}>
                        {/*`[${channel}] `*/}
                        {name}
                        {": "}
                        {content}   
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
    IsSystem: true,
});
AddMessageType("2040", {
    Name: "Announcement",
    Color: "#ffde73",
    IsSystem: true,
})
AddMessageType("000A", { 
    Name: "Say",
    RpChat: true,
    NameHighlight: true,
});
AddMessageType("000B", { 
    Name: "Shout",
    Color: "#ffa666"
});
AddMessageType("000C", {
    Name: "Tell (Outgoing)",
    Color: "#ffb8de",
    NameHighlight: true,
    Parse: function(message) {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color
        );

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            this.RpChat
        );

        let content = (
            <ChatContent
                key={`${message.UUID}_Content`}
                uuid={`${message.UUID}_Content`}
                content={msg}
            />
        );
        
        if(name) {
            name = LinkHighlight({ 
                Links: [{ StartIndex: 0, Length: name?.length }],
                Message: name
            }, this.Color, this.NameHighlight, `${message.UUID}_Source`);
        }

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {">> "}
                    {name}
                    {` (${server}): `}
                    {msg}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {">> "}
                {name}
                {": "}
                {msg}
            </span>
        );
    }
});
AddMessageType("000D", {
    Name: "Tell (Incoming)",
    Color: "#ffb8de",
    NameHighlight: true,
    Parse: function(message) {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color
        );

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            this.RpChat
        );

        let content = (
            <ChatContent
                key={`${message.UUID}_Content`}
                uuid={`${message.UUID}_Content`}
                content={msg}
            />
        );
        
        if(name) {
            name = LinkHighlight({ 
                Links: [{ StartIndex: 0, Length: name?.length }],
                Message: name
            }, this.Color, this.NameHighlight, `${message.UUID}_Source`);
        }

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {name}
                    {` (${server}) >> `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {name}
                {" >> "}
                {content}
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
    Color: "#bafff0",
    RpChat: true,
    NameHighlight: true,
    Parse: function(message) {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color
        );

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            this.RpChat
        );

        let content = (
            <ChatContent
                key={`${message.UUID}_Content`}
                uuid={`${message.UUID}_Content`}
                content={msg}
            />
        );
        
        if(name) {
            name = LinkHighlight({ 
                Links: [{ StartIndex: 0, Length: name?.length }],
                Message: name
            }, this.Color, this.NameHighlight, `${message.UUID}_Source`);
        }

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {/*"[EMOTE] "*/}
                    {name}
                    {` (${server}) `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {/*"[EMOTE] "*/}
                {name}
                {" "}
                {content}
            </span>
        );
    }
});
AddMessageType("001D", {
    Name: "Animated Emote",
    Color: "#bafff0",
    RpChat: true,
    NameHighlight: true,
    Parse: function(message) {
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color, true
        );

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            this.RpChat
        );

        let content = (
            <ChatContent
                key={`${message.UUID}_Content`}
                uuid={`${message.UUID}_Content`}
                content={msg}
            />
        );

        return (
            <span style={{color:this.Color}}>
                {/*`[EMOTE] `*/}
                {content}
            </span>
        );
    }
});
AddMessageType("001E", {
    Name: "Yell",
    Color: "#ffff00"
});

function FormatChatMessage(message, settings) {
    if(MessageTypeDict.hasOwnProperty(message.MessageType)) {
        // if we have a parse method
        let messageType = MessageTypeDict[message.MessageType];
        return messageType.Parse(message);
    }
    // default handling
    return message.Combined;
}

const ChatMessage = (props) => {
    const { classes, message, settings } = props;
    const commonSettings = useSelector((state) => 
        state.settings.CommonSettings
    );

    let formatted = FormatChatMessage(message, settings);
    return (
        <p className={classes.chatMessage}>
            {React.Children.map(formatted, (child, i) => {
                if(typeof(child) == "string") {
                    return (
                        <React.Fragment key={`${message.UUID}_${i}`}>
                            {child}
                        </React.Fragment>
                    );
                }
                let el = React.cloneElement(child, { 
                    key: `${message.UUID}_${i}`,
                });
                return el;
            })}
        </p>
    );
}
export default React.memo(
    withStyles(styles, { withTheme: true })(ChatMessage)
);