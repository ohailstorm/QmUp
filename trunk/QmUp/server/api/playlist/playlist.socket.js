/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Playlist = require('./playlist.model');
//console.log(Playlist.schema.paths.songs.schema);


exports.register = function(socket) {
  Playlist.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Playlist.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  Playlist.schema.paths.songs.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
	console.log("saving");
  console.log(cb);
  socket.emit(doc._id+':update', doc.songs[doc.songs.length-1]);
  
  socket.emit('playlist:save', doc);
}

function onRemove(socket, doc, cb) {
  console.log("removing " + doc);
//  socket.emit(doc.parent._id+':remove', doc);
  socket.emit(doc._id+':remove', doc);
  socket.emit('playlist:remove', doc);
}

