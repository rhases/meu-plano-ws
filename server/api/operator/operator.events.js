/**
 * Operator model events
 */

'use strict';

import {EventEmitter} from 'events';
var Operator = require('./operator.model');
var OperatorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OperatorEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Operator.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OperatorEvents.emit(event + ':' + doc._id, doc);
    OperatorEvents.emit(event, doc);
  }
}

export default OperatorEvents;
