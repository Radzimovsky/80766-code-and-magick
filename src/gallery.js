'use strict';

var photogalleryContainer = document.querySelector('.overlay-gallery');
var clickImage = document.querySelectorAll('.photogallery-image');
var imagesURLs = [];
var galleryClose = document.querySelector('.overlay-gallery-close');
var controlLeft = document.querySelector('.overlay-gallery-control-left');
var controlRight = document.querySelector('.overlay-gallery-control-right');
var previousImage = 0;
var nextImage = 0;

for (var i = 0; i < clickImage.length; i++) {
  clickImage[i].addEventListener('click', function(evt) {
    showGallery(imagesURLs.indexOf(evt.target.src));
  });
}

controlRight.addEventListener('click', function() {
  showGallery(nextImage);
});
controlLeft.addEventListener('click', function() {
  showGallery(previousImage);
});

var _onCloseClick = function() {
  photogalleryContainer.classList.add('invisible');
};
galleryClose.addEventListener('click', _onCloseClick);

var _onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27 && !photogalleryContainer.classList.contains('invisible') ) {
    _onCloseClick();
  }
};

document.addEventListener('keydown', _onDocumentKeyDown);

var getImages = function(photos) {
  imagesURLs = photos;
  document.querySelector('.preview-number-total').textContent = imagesURLs.length;
};

var showGallery = function(idx) {
  var bigImage = new Image();
  var galleryPreview = document.querySelector('.overlay-gallery-preview');
  nextImage = idx + 1;
  document.querySelector('.preview-number-current').textContent = nextImage;
  if (nextImage >= imagesURLs.length) {
    controlRight.style.visibility = 'hidden';
  } else {
    controlRight.style.visibility = 'visible';
  }
  previousImage = idx - 1;
  if (previousImage < 0) {
    controlLeft.style.visibility = 'hidden';
  } else {
    controlLeft.style.visibility = 'visible';
  }

  photogalleryContainer.classList.remove('invisible');
  bigImage.src = imagesURLs[idx];
  bigImage.onload = function() {
    galleryPreview.style.backgroundImage = 'url(' + imagesURLs[idx] + ')';
    galleryPreview.style.width = bigImage.width + 'px';
    galleryPreview.style.height = bigImage.height + 'px';
  };
};

module.exports.getImages = getImages;
module.exports.showGallery = showGallery;
