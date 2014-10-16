'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var UserTemp = require('../user/user.model.js');


 var User = mongoose.model('User');
  console.log(User.schema.paths.facebook);
  

 var VoteSchema = new Schema({ ip: 'String' });

  var SongSchema = new mongoose.Schema({ 
  			id: String,
  			title: String,
        artworkUrl: String,
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
/*
PlaylistSchema
  .path('name')
  .validate(function(name) {
    //if (authTypes.indexOf(this.provider) !== -1) return true;
    console.log("name",name);
    return false;
  }, 'Email cannot be blank');
*/
  /**
 * Pre-save hook
 */
PlaylistSchema
  .pre('save', function(next) {
    
    

    if (!this.name)
      next(new Error('Name can not be empty'));
    else
      next();
  });

module.exports = mongoose.model('Playlist', PlaylistSchema);

