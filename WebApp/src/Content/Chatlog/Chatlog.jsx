import React from "react";
import { useSelector } from "react-redux";
import MessageLog from "../MessageLog/MessageLog";

const Chatlog = (props) => {
    const chatLog = useSelector((state) => state.chatlog);
    return (
        <MessageLog
            Messages={chatLog}
            EmptyMessage="No Messages"
        />
    )
}
export default Chatlog;