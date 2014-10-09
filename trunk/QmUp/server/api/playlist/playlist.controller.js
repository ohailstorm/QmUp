'use strict';

var _ = require('lodash');
var Playlist = require('./playlist.model');
var User = require('../user/user.model');

// Get list of playlists
exports.index = function(req, res) {
  Playlist.find(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.json(200, playlists);
  });
};

// Get a single playlist
exports.show = function(req, res) {
  Playlist.findById(req.params.id).populate('collaborators', 'name').exec( function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    return res.json(playlist);
  });
};

// Get a list of playlists beloning to one user
exports.showForUser = function(req, res) {
  console.log("User is:");
  console.log(req.user);
  Playlist.find().where({ 'owner': req.params.id }).populate('owner', 'name').exec(function (err, playlists) {
    console.log(playlists);
    if(err) { return handleError(res, err); }

    return res.json(200, playlists);
  });
};

// Creates a new playlist in the DB.
exports.create = function(req, res) {

  Playlist.create(req.body, function(err, playlist) {
   
    console.log(playlist.owner);
    if(err) { return handleError(res, err); }
   
    return res.json(201, playlist);
  });
};

exports.addSong = function(req, res) {

    Playlist.findById(req.params.id, function (err, playlist) {
      
 
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


exports.addCollaborator = function(req, res) {
     


    Playlist.findById(req.params.id, function (err, playlist) {
      
 
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.send(404); }
    console.log(req.body.user);
    
   // playlist.collaborators.push("sadqsdsad");
         User.findOne({
        'facebook.id': req.body.user
      },
      function(err, user) {
       
      
        if (!user) {
         return res.send(404);
        } else {
         var exists =  _.find(playlist.collaborators, user._id);
         console.log(exists);
         if(!exists){
                 playlist.collaborators.push(user._id);
         console.log(playlist);
    playlist.save(function(err, song) {
     
    if(err) { return handleError(res, err); }
    return res.json(201, song.songs[song.songs.length]);
  });
         }
  
        }
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
   // console.log("pl", playlist.songs);
    //console.log(req.params.songId);
    /*_.remove(playlist.songs, {_id: req.params.songId});*/
    playlist.songs.id(req.params.songId).remove();
    //console.log("del", playlist.songs);
    playlist.save(function(err, song) {
     
    if(err) { return handleError(res, err); }
    return res.json(204, song.songs[0]);
  });

    


  });
};

function handleError(res, err) {
  return res.send(500, err);
}