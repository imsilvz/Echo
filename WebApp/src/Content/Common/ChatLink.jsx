import React, { useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

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
    const { uuid, color, content, isPlayer } = props;
    const [state, setState] = React.useState(initialState);
    const linkRef = React.useRef(null);
    const isHover = useHover(linkRef);

    const style = {
        cursor: isHover ? "pointer" : "auto",
        backgroundColor: isHover ? color : "transparent"
    }

    const handleClick = (event) => {
        event.preventDefault();
        if(isPlayer) {
            setState({
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            });
        }
    };

    const handleClose = () => {
        setState(initialState);
    };

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
                <MenuItem onClick={handleClose}>Test1</MenuItem>
                <MenuItem onClick={handleClose}>Test2</MenuItem>
                <MenuItem onClick={handleClose}>Test3</MenuItem>
            </Menu>
        </span>
    );
}
export default ChatLink;