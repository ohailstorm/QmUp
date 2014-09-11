'use strict';

var _ = require('lodash');
var Playlist = require('./playlist.model');

// Get list of playlists
exports.index = function(req, res) {
  Playlist.find(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.json(200, playlists);
  });
};

// Get a single playlist
exports.show = function(req, res) {
  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    return res.json(playlist);
  });
};

// Creates a new playlist in the DB.
exports.create = function(req, res) {
  Playlist.create(req.body, function(err, playlist) {
    if(err) { return handleError(res, err); }
    return res.json(201, playlist);
  });
};

exports.addSong = function(req, res) {

    Playlist.findById(req.params.id, function (err, playlist) {
    console.log(playlist);
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    playlist.songs.push(req.body);
    playlist.save(function(err, song) {
      console.log("songS", song.songs[0]);
    if(err) { return handleError(res, err); }
    return res.json(201, song.songs[song.songs.length]);
  });

  });



};

// Updates an existing playlist in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Playlist.findById(req.params.id, function (err, playlist) {
    if (err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    var updated = _.merge(playlist, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, playlist);
    });
  });
};

// Deletes a playlist from the DB.
exports.destroy = function(req, res) {
//Test

Playlist.remove(function (err, product) {
  if (err) return handleError(err);
  return res.send(204);
});
/*
  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    playlist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });*/
};

exports.deleteSong = function(req, res) {
//Test
/*
Playlist.remove(function (err, product) {
  if (err) return handleError(err);
  return res.send(204);
});*/

  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }

    playlist.songs.findById(req.params.songId, function (err, song) {
     if(err) { return handleError(res, err); }
      if(!song) { return res.send(404); }

      song.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);

    });
    });

    


  });
};

function handleError(res, err) {
  return res.send(500, err);
}