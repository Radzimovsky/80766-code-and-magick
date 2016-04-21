'use strict';

(function() {

  document.querySelector('.reviews').classList.add('reviews-list-loading');

  var IMAGE_LOAD_TIMEOUT = 10000;
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';
  // миллесекунд в двух неделях
  var RECENT_REVIEWS_TIME = 1000 * 3600 * 24;

  var reviewContainer = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var templateElement = document.querySelector('#review-template');
  var filtersContainer = document.querySelector('.reviews-filter');
  var elementToClone;
  var errorOrTimeout = function() {
    document.querySelector('.reviews').classList.add('reviews-load-failure');
  };

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

  var getReviews = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', REVIEWS_LOAD_URL);
    xhr.send();
    // при ошибке добавил элменту .reviews класс reviews-load-failure
    xhr.onerror = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      errorOrTimeout();
    };
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      errorOrTimeout();
    };
  };

  var renderReviews = function(reviews) {
    reviewContainer.innerHTML = '';

    reviews.forEach(function(review) {
      createReviewElement(review, reviewContainer);
    });
  };

  var setFiltrationEnabled = function() {
    var filterNodes = filtersContainer.querySelectorAll('input[name=reviews]');
    for (var i = 0; i < filters.length; i++) {
      filterNodes[i].onchange = function() {
        setFilterEnabled(this.id);
      };
    }
  };

  var setFilterEnabled = function(filter) {
    var filteredReviews = getFilteredReviews(window.reviews, filter);

    renderReviews(filteredReviews);
  };

  var getFilteredReviews = function(reviews, filter) {
    var reviewsToFilter = reviews.slice(0);

    // оператором множественного выбора switch
    switch (filter) {
      // кейс и его имя
      case 'reviews-recent':
        // завели переменную, чтобы использовать новую дату ЭТО текущие время!!!
        var currentDate = new Date();
        // нужная нам массив, будет пропущен через фильтрацию
        reviewsToFilter = reviewsToFilter.filter( function(review) {
          // возращаем только те отзывы, у которых разница между текущей датой и датой отзыва, если она меньше 2 недель (константа выше) (Date.parse - это перевод даты в кол-во милисекунд)
          return (currentDate - Date.parse(review.date)) < RECENT_REVIEWS_TIME;
        });
        // сортируем с помощью sort
        reviewsToFilter.sort( function(a, b) {
          // из большего к меньшему, в нашем случае по дате, т.е. по убыванию от свежих.
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;
      case 'reviews-good':
      // тоже используем фильтр
        reviewsToFilter = reviewsToFilter.filter(function(a) {
          // три или выше
          return a.rating >= 3;
        });
        // и снова сортируем
        reviewsToFilter.sort( function(a, b) {
          // по рейтингу от большего к меньшему
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        // используем фильтр
        reviewsToFilter = reviewsToFilter.filter(function(a) {
          // меньше трех
          return a.rating < 3;
        });
        // и снова сортируем
        reviewsToFilter.sort( function(a, b) {
          // а теперь в порядке возрстания
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        // сортировка по популярности
        reviewsToFilter = reviewsToFilter.sort( function(a, b) {
          // сортируем по убыванию
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }

    return reviewsToFilter;
  };

  getReviews(function(loadedReviews) {
    window.reviews = loadedReviews;
    setFiltrationEnabled();
    renderReviews(window.reviews);
  });

  filters.classList.remove('invisible');
})();
