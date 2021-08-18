import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";
import { GetMessageType } from "../../Util/messages";

const Chatlog = (props) => {
    const chatLog = useSelector((state) => state.chatlog);
    const settings = useSelector((state) => state.settings.ChatlogSettings);
    
    let filtered = [];
    for(let i=0; i<chatLog.length; i++) {
        let msg = chatLog[i];
        let code = msg.MessageType;

        let messageType = GetMessageType(code);
        if(!messageType) { console.log(msg); continue; }
        if(messageType.IsBattle && !settings.ShowBattle) { continue; }
        if(messageType.IsSystem && !settings.ShowSystem) { continue; }

        filtered.push(msg);
    }

    return (
        <MessageLog
            Messages={filtered}
            EmptyMessage="No Messages"
            Settings={settings}
        />
    )
}
export default Chatlog;