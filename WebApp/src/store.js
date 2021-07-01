import { createStore } from 'redux';

let initialState = {
    chatlog: [],
    playerinfo: {
        ID: null,
        Name: "",
        TargetID: null,
        TargetName: ""
    }
}

function storeReducer(state=initialState, action) {
    switch(action.type) {
        case 'UPDATE_CHAT':
            return {
                ...state,
                chatlog: [
                    ...state.chatlog,
                    ...action.chat
                ]
            };
        case 'UPDATE_PLAYER':
            let oldInfo = state.playerinfo;
            let info = action.data;
            if(!oldInfo.ID || (oldInfo.TargetID != info.TargetID)) {
                return {
                    ...state,
                    playerinfo: {
                        ...action.data
                    }
                }
            }
            return state;
        default:
            return state;
    }
}
export default createStore(storeReducer);