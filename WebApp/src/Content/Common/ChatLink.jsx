import React, { useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import ChatHighlight from './ChatHighlight';

import HexToHighlight from "../../Util/highlight";

const PlayerJobs = {}
function AddJobInfo(dataLst) {
    for(let i=0; i<dataLst.length; i++) {
        let data = dataLst[i];
        let JobInfo = {}
        if(data.BaseJob) {
            Object.assign(
                JobInfo, 
                PlayerJobs[data.BaseJob]
            );
        }
        Object.assign(JobInfo, data);
        PlayerJobs[JobInfo.Acronym] = JobInfo;
    }
}
AddJobInfo([
    {
        Acronym: "Unknown",
        Name: "Unknown",
    },
    {
        Acronym: "GLD",
        Name: "Gladiator",
        Color: "#7FDBFF"
    },
    {
        Acronym: "PGL",
        Name: "Pugilist",
        Color: "#d5c400",
    },
    {
        Acronym: "MRD",
        Name: "Marauder",
        Color: "#FF4136",
    },
    {
        Acronym: "LNC",
        Name: "Lancer",
        Color: "#33A0FF"
    },
    {
        Acronym: "ARC",
        Name: "Archer",
        Color: "#01FF70",
    },
    {
        Acronym: "CNJ",
        Name: "Conjurer",
        Color: "#FFFFE8",
    },
    {
        Acronym: "THM",
        Name: "Thaumaturge",
        Color: "#E365F6",
    },

    // Disciples of the Hand
    {
        Acronym: "CPT",
        Name: "Carpenter",
    },
    {
        Acronym: "BSM",
        Name: "Blacksmith",
    },
    {
        Acronym: "ARM",
        Name: "Armorer",
    },
    {
        Acronym: "GSM",
        Name: "Goldsmith"
    },
    {
        Acronym: "LTW",
        Name: "Leatherworker",
    },
    {
        Acronym: "WVR",
        Name: "Weaver",
    },
    {
        Acronym: "ALC",
        Name: "Alchemist",
    },
    {
        Acronym: "CUL",
        Name: "Culinarian",
    },

    // Disciples of the Land
    {
        Acronym: "MIN",
        Name: "Miner",
    },
    {
        Acronym: "BTN",
        Name: "Botanist",
    },
    {
        Acronym: "FSH",
        Name: "Fisher",
    },

    // Disciples of War / Magic
    {
        Acronym: "PLD",
        BaseJob: "GLD",
        Name: "Paladin",
    },
    {
        Acronym: "MNK",
        BaseJob: "PGL",
        Name: "Monk",
    },
    {
        Acronym: "WAR",
        BaseJob: "MRD",
        Name: "Warrior",
    },
    {
        Acronym: "DRG",
        BaseJob: "LNC",
        Name: "Dragoon",
    },
    {
        Acronym: "BRD",
        BaseJob: "ARC",
        Name: "Bard",
    },
    {
        Acronym: "WHM",
        BaseJob: "CNJ",
        Name: "White Mage",
    },
    {
        Acronym: "BLM",
        BaseJob: "THM",
        Name: "Black Mage",
    },
    {
        Acronym: "ACN",
        Name: "Arcanist",
    },
    {
        Acronym: "SMN",
        Name: "Summoner",
        Color: "#2ECC40",
    },
    {
        Acronym: "SCH",
        Name: "Scholar",
        Color: "#bba9cd",
    },
    {
        Acronym: "ROG",
        Name: "Rogue",
        Color: "#A796AB",
    },
    {
        Acronym: "NIN",
        BaseJob: "ROG",
        Name: "Ninja",
    },
    {
        Acronym: "MCH",
        Name: "Machinist",
        Color: "#DBF7FF",
    },
    {
        Acronym: "DRK",
        Name: "Dark Knight",
        Color: "#f79414",
    },
    {
        Acronym: "AST",
        Name: "Astrologian",
        Color: "#edd25f",
    },
    {
        Acronym: "SAM",
        Name: "Samurai",
        Color: "#b8b3b1",
    },
    {
        Acronym: "RDM",
        Name: "Red Mage",
        Color: "#EB9EBA"
    },
    {
        Acronym: "BLU",
        Name: "Blue Mage",
    },
    {
        Acronym: "GNB",
        Name: "Gunbreaker",
        Color: "#f0b885",
    },
    {
        Acronym: "DNC",
        Name: "Dancer",
        Color: "#f8d3c9"
    }
]);

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

    let chatColor = null;
    if(isPlayer) {
        console.log(isPlayer);
        let struct = PlayerJobs[isPlayer.Job];
        if(struct && struct.Color) {
            chatColor = struct.Color;
            let highlight = HexToHighlight(struct.Color, 0.2);
            style.backgroundColor = isHover 
                ? highlight : "transparent"
        }
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
            <MenuItem onClick={handleClose}>Test1</MenuItem>
            <MenuItem onClick={handleClose}>Test2</MenuItem>
            <MenuItem onClick={handleClose}>Test3</MenuItem>
        </Menu>
    );

    if(isPlayer) {
        return (
            <ChatHighlight
                color={chatColor}
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