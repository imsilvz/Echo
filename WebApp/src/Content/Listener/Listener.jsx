import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";

const Listener = (props) => {
    const [ currentTarget, setCurrentTarget ] = React.useState(null);
    const chatLog = useSelector((state) => state.chatlog);
    const playerInfo = useSelector((state) => state.playerinfo);
    const commonSettings = useSelector((state) => state.settings.CommonSettings);
    const settings = useSelector((state) => state.settings.ListenerSettings);

    if(playerInfo.TargetType <= 1) {
        // targetting a player
        if(currentTarget != playerInfo.TargetName) {
            setCurrentTarget(playerInfo.TargetName);
        }
    }

    let filtered = [];
    let targetName = currentTarget || playerInfo.Name || "";
    for(let i=0; i<chatLog.length; i++) {
        let msg = chatLog[i];
        let code = msg.MessageType;
        let messageType = commonSettings.ChatTypes[code];
        
        if(!messageType) { console.log(msg); continue; }
        if(messageType.IsBattle && !settings.ShowBattle) { continue; }
        if(messageType.IsSystem && !settings.ShowSystem) { continue; }
        
        if(msg.MessageSource.SourcePlayer == targetName) {
            filtered.push(msg);
        }
    }

    return (
        <MessageLog
            Target={targetName}
            Messages={filtered}
            EmptyMessage={targetName ? "No Messages" : "You have no target!"}
            Settings={settings}
        />
    )
}
export default Listener;