const initialState = {
    active: 0
};

function activeReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_ACTIVE':
            return {
                activeTeam: action.payload.active
            };
        default:
            return state;
    }
}

export default activeReducer;