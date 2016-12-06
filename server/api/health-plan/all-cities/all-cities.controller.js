'use strict';

import _ from 'lodash';
import HealthPlan from '../health-plan.model';

import geographicRestrictionsService from '../../common/geographic-restrictions.service';

export function index(req, res) {
    HealthPlan.find().exec()
    .then(function (healthPlans) {
        var statesAndCitiesCovered = geographicRestrictionsService.find(healthPlans);
        return res.status(200).json(statesAndCitiesCovered);
    })
}
