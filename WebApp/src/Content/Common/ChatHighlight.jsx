import React from 'react';

const ChatHighlight = (props, ref) => {
    const { uuid, color, content, style } = props;

    let highlightProps = {
        ...props,
        style: {
            ...props.style,
            color: color,
        }
    }

    return (
        <span {...highlightProps} ref={ref}>
            {content}
            {props.children}
        </span>
    )
}
export default React.memo(React.forwardRef(ChatHighlight));