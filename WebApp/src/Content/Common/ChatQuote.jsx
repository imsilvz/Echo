import React, { useEffect } from 'react';

const ChatQuote = (props) => {
    const { content } = props;

    return (
        <span>
            {content}
        </span>
    );
}
export default ChatQuote;