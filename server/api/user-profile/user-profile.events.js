/**
 * UserProfile model events
 */

'use strict';

import {EventEmitter} from 'events';
import UserProfile from './user-profile.model';
var UserProfileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserProfileEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UserProfile.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UserProfileEvents.emit(event + ':' + doc._id, doc);
    UserProfileEvents.emit(event, doc);
  }
}

export default UserProfileEvents;
