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

function QuoteHighlight(message, collection, color, emoteColor) {
    let newCollection = [];
            
    // find if there are any quotes
    // do this for rpchat functionality!
    let hasQuote = false;
    if(emoteColor) {
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
                    if(emoteColor) {
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
                if(emoteColor) {
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
        IsRpChat: false,
        NameHighlight: false,
        Parse: function(message) {
            let channel = this.Name.toUpperCase();
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let linkedMsg = LinkHighlight(
                message.MessageContent, 
                this.Color
            );
    
            let emoteColor = null;
            if(this.IsRpChat) {
                let state = store.getState();
                let commonSettings = state.settings.CommonSettings;
                emoteColor = commonSettings.ChatTypes["001C"].Color;
            }

            let collection = QuoteHighlight(
                message,
                linkedMsg,
                MessageTypeDict["DEFAULT"].Color,
                emoteColor
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

            if(this.IsSystem || this.IsBattle) {
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

function OverrideMessageType(code, opts) {
    MessageTypeDict[code] = Object.assign(
        {}, MessageTypeDict["DEFAULT"], opts
    );
}
OverrideMessageType("000C", {
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
            this.IsRpChat ? this.Color : null
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
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {">> "}
                {name}
                {": "}
                {content}
            </span>
        );
    }
});
OverrideMessageType("000D", {
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
            this.IsRpChat ? this.Color : null
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
OverrideMessageType("000E", {
    Parse: function(message) {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color
        );

        let emoteColor = null;
        if(this.IsRpChat) {
            let state = store.getState();
            let commonSettings = state.settings.CommonSettings;
            emoteColor = commonSettings.ChatTypes["001C"].Color;
        }

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            emoteColor
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
                    {"("}
                    {name}
                    {` (${server})) `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {"("}
                {name}
                {") "}
                {content}
            </span>
        );
    }
})
OverrideMessageType("001C", {
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
            this.IsRpChat ? this.Color : null
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
OverrideMessageType("001D", {
    Parse: function(message) {
        let linkedMsg = LinkHighlight(
            message.MessageContent, 
            this.Color, true
        );

        let msg = QuoteHighlight(
            message,
            linkedMsg,
            MessageTypeDict["DEFAULT"].Color,
            this.IsRpChat ? this.Color : null
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

function BuildMessageType(type, typeSettings) {
    let messageType = {}

    // assign all default methods
    messageType = Object.assign(
        messageType, 
        MessageTypeDict["DEFAULT"]
    );

    if(MessageTypeDict.hasOwnProperty(type)) {
        // override parse method if applicable
        messageType = Object.assign(
            messageType, 
            MessageTypeDict[type]
        );
    }

    // apply settings to type
    messageType = Object.assign(
        messageType, 
        typeSettings
    );

    // bind this keyword
    for(let name in messageType) {
        let prop = messageType[name];
        if(typeof(prop) == "function") {
            let bound = messageType[name].bind(messageType);
            messageType[name] = bound;
        }
    }
    return messageType;
}

function FormatChatMessage(message, settings) {
    let messageTypes = settings.ChatTypes;

    if(messageTypes.hasOwnProperty(message.MessageType)) {
        let typeSettings = messageTypes[message.MessageType];
        let messageType = BuildMessageType(
            message.MessageType,
            typeSettings
        );

        // if we have a parse method
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

    let formatted = FormatChatMessage(message, commonSettings);
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