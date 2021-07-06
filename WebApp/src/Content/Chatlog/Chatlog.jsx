import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";

const Chatlog = (props) => {
    const chatLog = useSelector((state) => state.chatlog);
    const settings = useSelector(
        (state) => state.settings.ChatlogSettings
    );
    return (
        <MessageLog
            Messages={chatLog}
            EmptyMessage="No Messages"
            Settings={settings}
        />
    )
}
export default Chatlog;