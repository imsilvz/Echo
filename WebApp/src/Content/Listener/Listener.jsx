import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";

const Listener = (props) => {
    const chatLog = useSelector((state) => state.chatlog);
    const playerInfo = useSelector((state) => state.playerinfo);

    let targetName = playerInfo ? playerInfo.TargetName : "";
    return (
        <MessageLog
            Messages={chatLog}
            ShouldDisplay={(message) => {
                let source = message.MessageSource;
                return source.SourcePlayer == targetName;
            }}
        />
    )
}
export default Listener;