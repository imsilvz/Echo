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
        let interval = setInterval(async () => {
            this.updateActorData();
            this.updateChatData();
            this.updatePlayerData();
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

    async updateActorData() {
        const { dispatch } = this.props;
        let broker = chrome.webview.hostObjects.dataBroker;
        let actorData = await broker.QueryActors();
        let actors = JSON.parse(actorData);

        if(actors.length) {
            let actorUpdate = {};
            for(let i=0; i<actors.length; i++) {
                actorUpdate[actors[i].Name] = actors[i];
            }
            console.log(actorUpdate);
            dispatch({
                type: "UPDATE_ACTORS",
                actors: actorUpdate
            });
        }
    }

    async updateChatData() {
        const { dispatch } = this.props;
        let broker = chrome.webview.hostObjects.dataBroker;
        let chatData = await broker.QueryChat();
        let messages = JSON.parse(chatData);

        let newMessages = [];
        if(messages.length) {
            for(let i=0; i<messages.length; i++) {
                let message = messages[i];
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
    }

    async updatePlayerData() {
        const { dispatch } = this.props;
        let broker = chrome.webview.hostObjects.dataBroker;
        let playerData = await broker.QueryPlayer();

        // parse chat update
        let player = JSON.parse(playerData);

        dispatch({
            type: "UPDATE_PLAYER",
            data: player
        });
    }

    render() {
        return null;
    }
}
export default DataBroker;