const initialState = [
    {id: 0, pokemon: []}
];

let copyState = null;
let index = 0;

function teamReducer(state = initialState, action) {

    const {type, payload} = action;
    switch (type) {
        case 'ADD_POKEMON':
            // console.log(payload);
            copyState = [...state];
            index = copyState.findIndex(x => x.id == payload.teamId);
            copyState[index].pokemon = [...copyState[index].pokemon, payload.pokemon];
            return [...copyState];
        case 'REMOVE_POKEMON':
            copyState = [...state];
            index = copyState.findIndex(x => x.id == payload.teamId);
            copyState[index].pokemon = copyState[index].pokemon.filter(x => x.id != payload.pokemon.id);
            return [...copyState];
        case 'ADD_TEAM':
            return [...state, {id: payload.teamId, pokemon: []}];
        case 'REMOVE_TEAM':
            copyState = [...state];
            index = copyState.findIndex(x => x.id == payload.teamId);
            copyState.splice(index, 1);
            return [...copyState];
        default:
            return state
    }
}

export default teamReducer;