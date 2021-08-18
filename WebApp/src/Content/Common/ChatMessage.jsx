import React from "react";
import { useSelector } from "react-redux";
import { withStyles } from '@material-ui/styles';

import ChatContent from './ChatContent';
import ChatLink from './ChatLink';
import ChatQuote from './ChatQuote';
import store from "../../store";
import { GetMessageType } from "../../Util/messages";

const styles = theme => ({
    chatMessage: {
        margin:0,
        fontSize:"18px",
        fontWeight:"400",
        textShadow: `
        -1px -1px 0 rgba(0, 0, 0, 0.7),  
        1px -1px 0 rgba(0, 0, 0, 0.7),
        -1px 1px 0 rgba(0, 0, 0, 0.7),
        1px 1px 0 rgba(0, 0, 0, 0.7)`,
        '& span': {
            display: "inline",
        }
    },
});

function LinkHighlight(MessageContent, highlight=false, color="#000000", key) {
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
                shouldHighlight={highlight}
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
                if(item.includes("\"") || item.includes("\“") || item.includes("\”")) {
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
            let segments = item.split(/(\"|\“|\”)/);
            for(let idx=0; idx<segments.length; idx++) {
                // check if segment is a delim
                let val = segments[idx];
                if(val == "\"" || val == "\“" || val == "\”") {
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
        UseEmoteColor: false,
        ShowChannelName: false,
        Format: function(message, name, server, content) {
            let channel = this.Name.toUpperCase();

            if(this.IsSystem || this.IsBattle) {
                return (
                    <span style={{color:this.Color}}>
                        {this.ShowChannelName && `[${channel}] `}
                        {content}
                    </span>
                );
            }
            
            let dateTime = new Date(message.Timestamp);
            let hours = dateTime.getHours().toString().padStart(2, "0");
            let minutes = dateTime.getMinutes().toString().padStart(2, "0");
            let seconds = dateTime.getSeconds().toString().padStart(2, "0")
            let timeStamp = `[${hours}:${minutes}:${seconds}] `;

            if(server) {
                return (
                    <span style={{color:this.Color}}>
                        {timeStamp}
                        {this.ShowChannelName && `[${channel}] `}
                        {name}
                        {` (${server}): `}
                        {content}
                    </span>
                )
            }
            return (
                <span style={{color:this.Color}}>
                    {timeStamp}
                    {this.ShowChannelName && `[${channel}] `}
                    {name}
                    {": "}
                    {content}   
                </span>
            )
        },
        Parse: function(message) {
            let name = message.MessageSource.SourcePlayer;
            let server = message.MessageSource.SourceServer;
            let collection = LinkHighlight(
                message.MessageContent, 
                false,
                this.Color
            );
    
            if(this.IsRpChat) {
                let emoteColor = null;
                if(this.UseEmoteColor) {
                    emoteColor = GetMessageType("001C").Color;
                }

                collection = QuoteHighlight(
                    message,
                    collection,
                    GetMessageType("000A").Color,
                    emoteColor ? emoteColor : this.Color
                );
            }

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
                }, this.NameHighlight, this.Color, `${message.UUID}_Source`);
            }

            return this.Format(
                message,
                name,
                server,
                content
            )
        }
    }
}

function OverrideMessageType(code, opts) {
    MessageTypeDict[code] = Object.assign(
        {}, MessageTypeDict["DEFAULT"], opts
    );
}
OverrideMessageType("000A", {
    UseEmoteColor: true,
})
OverrideMessageType("000C", {
    Format: function(message, name, server, content) {
        let channel = this.Name.toUpperCase();

        let dateTime = new Date(message.Timestamp);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let seconds = dateTime.getSeconds().toString().padStart(2, "0")
        let timeStamp = `[${hours}:${minutes}:${seconds}] `;

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {timeStamp}
                    {this.ShowChannelName && `[${channel}] `}
                    {">> "}
                    {name}
                    {` (${server}): `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {timeStamp}
                {this.ShowChannelName && `[${channel}] `}
                {">> "}
                {name}
                {": "}
                {content}
            </span>
        );
    }
});
OverrideMessageType("000D", {
    Format: function(message, name, server, content) {
        let channel = this.Name.toUpperCase();

        let dateTime = new Date(message.Timestamp);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let seconds = dateTime.getSeconds().toString().padStart(2, "0");
        let timeStamp = `[${hours}:${minutes}:${seconds}] `;

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {timeStamp}
                    {this.ShowChannelName && `[${channel}] `}
                    {name}
                    {` (${server}) >> `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {timeStamp}
                {this.ShowChannelName && `[${channel}] `}
                {name}
                {" >> "}
                {content}
            </span>
        );
    }
});
OverrideMessageType("000E", {
    Format: function(message, name, server, content) {
        let channel = this.Name.toUpperCase();

        let dateTime = new Date(message.Timestamp);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let seconds = dateTime.getSeconds().toString().padStart(2, "0");
        let timeStamp = `[${hours}:${minutes}:${seconds}] `;

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {timeStamp}
                    {this.ShowChannelName && `[${channel}] `}
                    {"("}
                    {name}
                    {` (${server})) `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {timeStamp}
                {this.ShowChannelName && `[${channel}] `}
                {"("}
                {name}
                {") "}
                {content}
            </span>
        );
    }
})
OverrideMessageType("001C", {
    Format: function(message, name, server, content) {
        let channel = this.Name.toUpperCase();

        let dateTime = new Date(message.Timestamp);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let seconds = dateTime.getSeconds().toString().padStart(2, "0");
        let timeStamp = `[${hours}:${minutes}:${seconds}] `;

        if(server) {
            return (
                <span style={{color:this.Color}}>
                    {timeStamp}
                    {this.ShowChannelName && `[${channel}] `}
                    {name}
                    {` (${server}) `}
                    {content}
                </span>
            );
        }
        return (
            <span style={{color:this.Color}}>
                {timeStamp}
                {this.ShowChannelName && `[${channel}] `}
                {name}
                {" "}
                {content}
            </span>
        );
    }
});
OverrideMessageType("001D", {
    Parse: function(message) {
        let name = message.MessageSource.SourcePlayer;
        let server = message.MessageSource.SourceServer;
        let collection = LinkHighlight(
            message.MessageContent, 
            true,
            this.Color
        );

        let content = (
            <ChatContent
                key={`${message.UUID}_Content`}
                uuid={`${message.UUID}_Content`}
                content={collection}
            />
        );

        return this.Format(
            message,
            name,
            server,
            content
        )
    },
    Format: function(message, name, server, content) {
        let dateTime = new Date(message.Timestamp);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let seconds = dateTime.getSeconds().toString().padStart(2, "0");
        let timeStamp = `[${hours}:${minutes}:${seconds}] `;

        return (
            <span style={{color:this.Color}}>
                {timeStamp}
                {this.ShowChannelName && `[EMOTE] `}
                {content}
            </span>
        );
    }
});

function BuildMessageDict(type, typeSettings) {
    let messageDict = {}

    // assign all default methods
    messageDict = Object.assign(
        messageDict, 
        MessageTypeDict["DEFAULT"]
    );

    if(MessageTypeDict.hasOwnProperty(type)) {
        // override parse method if applicable
        messageDict = Object.assign(
            messageDict, 
            MessageTypeDict[type]
        );
    }

    // apply settings to type
    messageDict = Object.assign(
        messageDict, 
        typeSettings
    );

    // bind this keyword
    for(let name in messageDict) {
        let prop = messageDict[name];
        if(typeof(prop) == "function") {
            let bound = messageDict[name].bind(messageDict);
            messageDict[name] = bound;
        }
    }
    return messageDict;
}

function FormatChatMessage(message) {
    let messageType = GetMessageType(message.MessageType);
    if(messageType) {
        let messageDict = BuildMessageDict(
            message.MessageType,
            messageType
        );

        // if we have a parse method
        return messageDict.Parse(message);
    }
    // default handling
    return message.Combined;
}

const ChatMessage = (props, ref) => {
    const { classes, message, settings } = props;

    let formatted = FormatChatMessage(message);
    return (
        <p ref={ref} className={classes.chatMessage}>
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
    withStyles(styles, { withTheme: true })(React.forwardRef(ChatMessage))
);