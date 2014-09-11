'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 var VoteSchema = new Schema({ ip: 'String' });

  var SongSchema = new mongoose.Schema({ 
  			id: String,
  			title: String,
         	votes: [VoteSchema]
        });

var PlaylistSchema = new Schema({
   owner:String,
   songs: [SongSchema]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);