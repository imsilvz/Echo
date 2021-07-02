import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";

const Listener = (props) => {
    const chatLog = useSelector((state) => state.chatlog);
    const playerInfo = useSelector((state) => state.playerinfo);

    let filtered = [];
    let targetName = playerInfo ? 
        (playerInfo.TargetName || playerInfo.Name) 
        : "";
    for(let i=0; i<chatLog.length; i++) {
        let msg = chatLog[i];
        if(msg.MessageSource.SourcePlayer == targetName) {
            filtered.push(msg);
        }
    }

    return (
        <MessageLog
            Messages={filtered}
            EmptyMessage={targetName ? "No Messages" : "You have no target!"}
        />
    )
}
export default Listener;