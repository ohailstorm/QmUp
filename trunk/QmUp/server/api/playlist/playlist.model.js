'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 var User = mongoose.model("User");
  console.log(User.schema.paths.facebook);
  

 var VoteSchema = new Schema({ ip: 'String' });

  var SongSchema = new mongoose.Schema({ 
  			id: String,
  			title: String,
         	votes: [VoteSchema]
        });

var PlaylistSchema = new Schema({
   owner: {type: Schema.Types.ObjectId, ref: 'User'
 },
   name: String,
   songs: [SongSchema],
   collaborators: [{type: Schema.Types.ObjectId,
    ref: 'User'}]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);

