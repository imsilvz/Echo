import React, { useEffect } from 'react';

function useHover(ref) {
    const [val, setVal] = React.useState(false);

    const mouseEnter = () => setVal(true);
    const mouseLeave = () => setVal(false);

    React.useEffect(() => {
        const node = ref?.current;

        if(node) {
            node.addEventListener('mouseenter', mouseEnter);
            node.addEventListener('mouseleave', mouseLeave);

            return () => {
                node.removeEventListener('mouseenter', mouseEnter);
                node.removeEventListener('mouseleave', mouseLeave);
            }
        }
    }, [ref]);
    return val;
}

const ChatLink = (props) => {
    const { color, content, childkey } = props;
    const linkRef = React.useRef(null);
    const isHover = useHover(linkRef);

    const style = {
        cursor: isHover ? "pointer" : "auto",
        backgroundColor: isHover ? color : "transparent"
    }

    return (
        <span style={style} ref={linkRef}>
        {React.Children.map(content, (child, i) => {
            if(typeof(child) == "string") {
                return child;
            }
            return React.cloneElement(child, { 
                key: `${childkey}_${i}`,
                childkey: `${childkey}_${i}`
            });
        })}
        </span>
    );
}
export default ChatLink;