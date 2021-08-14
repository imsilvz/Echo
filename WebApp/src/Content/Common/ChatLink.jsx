import React, { useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import ChatHighlight from './ChatHighlight';
import HexToHighlight from "../../Util/highlight";

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

const initialState = {
    mouseX: null,
    mouseY: null,
};  

const ChatLink = (props) => {
    const { uuid, color, content, shouldHighlight } = props;
    const [state, setState] = React.useState(initialState);
    const linkRef = React.useRef(null);
    const isHover = useHover(linkRef);
    
    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setState(initialState);
    };

    let bgColor = HexToHighlight(color, 0.2);
    const style = {
        cursor: isHover ? "pointer" : "auto",
        backgroundColor: isHover ? bgColor : "transparent"
    }
    
    let menuComponent = (
        <Menu
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={handleClose}>Not Yet Implemented</MenuItem>
            <MenuItem onClick={handleClose}>Not Yet Implemented</MenuItem>
            <MenuItem onClick={handleClose}>Not Yet Implemented</MenuItem>
        </Menu>
    );

    if(shouldHighlight) {
        return (
            <ChatHighlight
                color={color}
                content={content}
                style={style} 
                ref={linkRef}
                onContextMenu={handleClick}
            >
                {menuComponent}
            </ChatHighlight>
        )
    }
    return (
        <span 
            style={style} 
            ref={linkRef}
            onContextMenu={handleClick}
        >
            {React.Children.map(content, (child, i) => {
                if(typeof(child) == "string") {
                    return child;
                }
                return React.cloneElement(child, { 
                    key: `${uuid}_${i}`,
                    childkey: `${uuid}_${i}`
                });
            })}        
            {menuComponent}
        </span>
    );
}
export default React.memo(ChatLink);