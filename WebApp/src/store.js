import { createStore } from 'redux';

let initialState = {
    actors: {},
    chatlog: [],
    playerinfo: {
        ID: null,
        Name: "",
        TargetID: null,
        TargetName: ""
    },
    settings: {}
}

function storeReducer(state=initialState, action) {
    let newState;
    switch(action.type) {
        case 'SET_ENABLE_JOB_COLORS':
            let enabled = action.data;
            let CommonSettings = state.settings.CommonSettings;
            let newSettings = Object.assign({}, 
                CommonSettings, {
                JobColorsEnabled: enabled
            });
            return {
                ...state,
                settings: {
                    ...state.settings,
                    CommonSettings: newSettings,
                }
            };
        case 'LOAD_SETTINGS':
            console.log(action);
            newState = {
                ...state,
                settings: {
                    ...action.data,
                }
            }
            console.log(newState);
            return newState;
        case 'UPDATE_ACTORS':
            return {
                ...state,
                actors: {
                    ...state.actors,
                    ...action.actors
                }
            }
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

const store = createStore(storeReducer);
store.dispatch({
    type: "LOAD_SETTINGS",
    data: (() => {
        let hostObjects = chrome.webview.hostObjects;
        let controller = hostObjects.sync.settingsController;
        let settingsJson = controller.GetSettingsJson();
        return JSON.parse(settingsJson);
    })()
});
export default store;