'use strict';

import _ from 'lodash';

var allStatesAndCities = require('brazilian-cities').statesAndCities;

var statesAndCitiesCovered;

var service = {};

/**
 * Find all distinct states and cities related to the entity given as parameter.
 * The service assumes that the entity has geographic restrictions,
 * an object that has a property 'restrictions.geographic', which is
 * an array that contains objects describing the state and its cities.
 * If a state has an empty cities array, it means that it should return all the
 * state's cities. So the service retrieves all cities from the lib 'brazilian-cities'.
 *
 * @param entities All entities retrieved from database that have geographic restrictions.
 * @return Object with state as a key, and as value an array containing the state's cities.
 */
service.find = function(entities) {
    // the service appears to be stateful.
    // needs to reset every call then
    statesAndCitiesCovered = {};
    generateMapWithStatesAndCitiesCovered(entities);
    return statesAndCitiesCovered;
}

function generateMapWithStatesAndCitiesCovered(entities) {
    entities.forEach(function (entity) {
        if (healthPlanHasGeographicRestrictions(entity))
            addStatesWithCitiesToMap(entity.restrictions.geographic);
        else
            statesAndCitiesCovered = generateAllStatesWithOnlyCitiesCod();
    })
}

function healthPlanHasGeographicRestrictions(entity) {
    var restrictions = entity.restrictions;
    return restrictions && (restrictions.geographic &&
         restrictions.geographic.length > 0);
}

function addStatesWithCitiesToMap(states) {
    states.forEach(function (state) {
        addStateWithCitiesToMap(state);
    });
}

function addStateWithCitiesToMap(state) {
    var stateCod = state.state;
    if (!statesAndCitiesCovered[stateCod]) {
        addNewStateToMap(state);
    } else {
        addNewCitiesToStateAlreadyMapped(state);
    }
}

function addNewStateToMap(state) {
    var stateCod = state.state;
    var cities = retrieveCitiesToBeAddedToState(state);
    statesAndCitiesCovered[stateCod] = new Set(cities);
}

function retrieveCitiesToBeAddedToState(state) {
    var stateCod = state.state;
    if (entityCoversAllState(state))
        return retrieveAllCitiesByCod(stateCod);
    else
        return state.cities;
}

function entityCoversAllState(state) {
    if (!state.cities)
        return true;
    else
        return state.cities.length == 0;
}

function retrieveAllCitiesByCod(stateCod) {
    var state = allStatesAndCities.find(function (st) {
        return st.cod === stateCod;
    });
    return state.cities.map(function (city) { return city.cod });
}

function addNewCitiesToStateAlreadyMapped(state) {
    var stateCod = state.state;
    var citiesMerged = mergeCitiesToBeAddedWithExistentCities(state);
    statesAndCitiesCovered[stateCod] = citiesMerged;
}

function mergeCitiesToBeAddedWithExistentCities(state) {
    var stateCod = state.state;
    var stateCitiesSet = statesAndCitiesCovered[stateCod];
    var citiesToBeAddedSet = new Set(state.cities);
    return new Set(stateCitiesSet, citiesToBeAddedSet);
}

function generateAllStatesWithOnlyCitiesCod() {
    var statesWithOnlyCitiesCod = {};
    allStatesAndCities.forEach(function (state) {
        var stateCitiesCod = state.cities.map(function (city) { return city.cod });
        // não confundir com os dados que vem do modelo de Seller,
        // onde o código é 'state'
        // dados da lib, código do estado é 'cod'
        var stateCod = state.cod;
        statesWithOnlyCitiesCod[stateCod] = stateCitiesCod;
    });
    return statesWithOnlyCitiesCod;
}

export default service;
