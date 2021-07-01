import React from 'react';
import { connect, useSelector } from 'react-redux';

@connect()
class DataBroker extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            intervalId: null
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let interval = setInterval(async () => {
            let chatMsg = await chrome.webview.hostObjects.dataBroker.QueryChat();
            let playerMsg = await chrome.webview.hostObjects.dataBroker.QueryPlayer();

            // parse chat update
            let update = false;
            let chat = JSON.parse(chatMsg);
            let player = JSON.parse(playerMsg);

            // chat messages!
            let newMessages = [];
            if(chat.length) {
                update = true;
                for(let i=0; i<chat.length; i++) {
                    let message = chat[i];
                    console.log(message);
                    newMessages.push(
                        message
                    );
                }
                dispatch({
                    type: "UPDATE_CHAT",
                    chat: newMessages
                });
            }
            dispatch({
                type: "UPDATE_PLAYER",
                data: player
            });
        }, 100);
        this.setState({
            intervalId: interval
        });
    }

    componentWillUnmount() {
        let { intervalId } = this.state;
        if(intervalId) {
            clearInterval(intervalId);
        }
    }

    render() {
        return null;
    }
}
export default DataBroker;