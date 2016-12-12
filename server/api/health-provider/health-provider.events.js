/**
 * Provider model events
 */

'use strict';

import {EventEmitter} from 'events';
import Provider from './health-provider.model';
var ProviderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProviderEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Provider.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProviderEvents.emit(event + ':' + doc._id, doc);
    ProviderEvents.emit(event, doc);
  }
}

export default ProviderEvents;
