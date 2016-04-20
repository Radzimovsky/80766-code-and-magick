'use strict';

(function() {
  var reviewContainer = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var templateElement = document.querySelector('#review-template');
  var elementToClone;
  var IMAGE_LOAD_TIMEOUT = 10000;
  var filtersContainer = document.querySelector('.reviews-filter');

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

  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  var getReviews = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', REVIEWS_LOAD_URL);
    xhr.send();
  };

  var renderReviews = function(reviews) {
    reviews.forEach(function(review) {
      createReviewElement(review, reviewContainer);
    });
  };

  var setFiltrationEnabled = function() {
    var filters = filtersContainer.querySelectorAll('input[name=reviews]');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onchange = function(evt) {
        setFilterEnabled(this.id);
      };
    }
  };

  var setFilterEnabled = function(filter) {
    var filteredReviews = getFilteredReviews(reviews, filter);
    renderReviews(filteredReviews);
  };

  var getFilteredReviews = function(reviews, filter) {
    var reviewsToFilter = reviews.slice(0);

    switch (filter) {
      case 'reviews-recent':
        reviewsToFilter.sort(function(a, b) {
          return a.price - b.price;
        });
        break;
      case 'reviews-good':
        reviewsToFilter.filter(function(a) {
          return a.rating >= 3;
        });
        break;
      case 'reviews-bad':
        reviewsToFilter = [];
        break;
      case 'reviews-popular':
        break;
      case 'default':
        reviewsToFilter = reviews;
        break;
    }

    return reviewsToFilter;
  };

  getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltrationEnabled();
    renderReviews(reviews);
  });

  filters.classList.remove('invisible');
})();
