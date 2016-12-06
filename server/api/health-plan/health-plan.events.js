/**
 * HealthPlan model events
 */

'use strict';

import {EventEmitter} from 'events';
var HealthPlan = require('./health-plan.model');
var HealthPlanEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HealthPlanEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  HealthPlan.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    HealthPlanEvents.emit(event + ':' + doc._id, doc);
    HealthPlanEvents.emit(event, doc);
  }
}

export default HealthPlanEvents;
