let nextId = 1;

const addPokemonToTeam = (pokemon, teamId) => ({
    type: 'ADD_POKEMON',
    payload: {pokemon: pokemon, teamId: teamId}
});

const removePokemonFromTeam = (pokemon, teamId) => ({
    type: 'REMOVE_POKEMON',
    payload: {pokemon: pokemon, teamId: teamId}
});

const addTeam = () => ({
    type: 'ADD_TEAM',
    payload: {teamId: nextId++}
});

const removeTeam = (teamId) => ({
    type: 'REMOVE_TEAM',
    payload: {teamId: teamId}
});

const setActiveTeam = (teamId) => ({
    type: 'SET_ACTIVE',
    payload: {active: teamId}
});

module.exports = {
    addPokemonToTeam,
    removePokemonFromTeam,
    addTeam,
    removeTeam,
    setActiveTeam
};
