'use strict';
var form = require('./form.js');
var game = require('./game.js');
var reviews = require('./reviews.js');
var gallery = require('./gallery.js');

form();
game();
reviews();
// gallery();

var photos = [];

var imageContainer = document.querySelectorAll('.photogallery-image');
for (var i = 0; i < imageContainer.length; i++) {
  photos[i] = imageContainer[i].firstChild.src;
}
gallery.getImages(photos);
