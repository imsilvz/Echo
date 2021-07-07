import React from 'react';
import { useSelector } from "react-redux";
import HexToHighlight from "../../Util/highlight";

function GetJobColor(settings, job) {
    let jobInfo = settings.JobInfo[job];

    // if we find a color, return it
    if(jobInfo.Color) {
        return jobInfo.Color;
    }

    // if we have a base class...
    if(jobInfo.BaseJob) {
        return GetJobColor(settings, jobInfo.BaseJob);
    }
    return null;
}

const ChatHighlight = (props, ref) => {
    const { uuid, color, content } = props;
    const actors = useSelector((state) => state.actors);
    const settings = useSelector((state) => state.settings);
    const commonSettings = settings.CommonSettings;
    let chatColor = color;
    let style = {...props.style};

    if(typeof(content) == "string") {
        if(commonSettings.JobColorsEnabled) {
            if(actors.hasOwnProperty(content)) {
                let entry = actors[content];
                let jobColor = GetJobColor(commonSettings, entry.Job);
                if(jobColor) {
                    chatColor = jobColor;
                }
            }
        }
    }

    // set color
    style.color = chatColor;
    // adjust background color to new color
    let bgColor = style.backgroundColor;
    if(bgColor != "transparent") {
        bgColor = HexToHighlight(chatColor, 0.2);
        style.backgroundColor = bgColor;
    }
    
    const newProps = {
        ...props,
        style: style,
    };
    return (
        <span {...newProps} ref={ref}>
            {content}
            {props.children}
        </span>
    )
}
export default React.memo(React.forwardRef(ChatHighlight));