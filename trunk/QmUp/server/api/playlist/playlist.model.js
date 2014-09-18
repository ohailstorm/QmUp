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
   owner: {
   	id: {type: Schema.Types.ObjectId, ref: 'User'},
   	name: {type:String, ref: 'User' }
   },
   name: String,
   songs: [SongSchema]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);

