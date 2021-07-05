import React from 'react';
import { render } from 'react-dom';

const ChatContent = (props) => {
    const { uuid, content } = props;

    let renderContent = content;
    if(!!!Array.isArray(content)) {
        renderContent = [content];
    }

    return (
        <React.Fragment>
            {renderContent.map((item, idx) => {
                if(typeof(item) == "string") {
                    return (
                        <React.Fragment key={`${uuid}_${idx}`}>
                            {item}
                        </React.Fragment>
                    )
                }
                return React.cloneElement(
                    item, { key: `${uuid}_${idx}`}
                );
            })}
        </React.Fragment>
    );
}
export default ChatContent;