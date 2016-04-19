'use strict';

(function() {
  var reviewContainer = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var templateElement = document.querySelector('#review-template');
  var elementToClone;
  var IMAGE_LOAD_TIMEOUT = 10000;

  filters.classList.add('invisible');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }

  function createReviewElement(data, container) {
    var element = elementToClone.cloneNode(true);
    var imageAvatarLoadTimeout;
    element.querySelector('.review-rating').textContent = data.rating;
    element.querySelector('.review-text').textContent = data.description;
    container.appendChild(element);
    var avatarImage = new Image();
    avatarImage.onload = function(evt) {
      clearTimeout(imageAvatarLoadTimeout);
      element.querySelector('.review-author').src = evt.target.src;
      avatarImage.width = '124px';
      avatarImage.height = '124px';
    };
    avatarImage.onerror = function() {
      element.classList.add('review-load-failure');
    };
    avatarImage.src = data.author.picture;
    imageAvatarLoadTimeout = setTimeout(function() {
      element.querySelector('.review-author').src = '';
      element.querySelector('.review-author').classList.add('review-load-failure');
    }, IMAGE_LOAD_TIMEOUT);
    return element;
  }
  window.reviews.forEach(function(review) {
    createReviewElement(review, reviewContainer);
  });

  filters.classList.remove('invisible');
})();
