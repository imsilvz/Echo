import store from '../store';

const GetMessageTimestamp = (message) => {
    return "";
}

const GetMessageType = (code) => {
    // grab settings object from our Redux store
    const state = store.getState();
    const settings = state.settings.CommonSettings;

    let messageType = settings.ChatTypes[code];
    if(!messageType) {
        // if it's a bad messagetype, return undefined
        return undefined;
    }

    let retType = {};
    if(messageType.Base) {
        let baseType = GetMessageType(messageType.Base);
        // assign base type
        retType = Object.assign(
            retType,
            baseType
        );
    }

    // assign code type
    retType = Object.assign(
        retType,
        messageType
    );
    return retType;
}

export {
    GetMessageType,
}