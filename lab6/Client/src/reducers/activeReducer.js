const initialState = {
    active: 0
};

function activeReducer(state = initialState, action) {
    console.log(action.payload);
    switch (action.type) {
        case 'SET_ACTIVE':
            return {
                active: action.payload.active
            };
        default:
            return state;
    }
}

export default activeReducer;