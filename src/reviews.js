'use strict';

define(function() {

  return {
    document.querySelector('.reviews').classList.add('reviews-list-loading');

    var IMAGE_LOAD_TIMEOUT = 10000;
    var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';
    // миллесекунд в двух неделях
    var RECENT_REVIEWS_TIME = 1000 * 3600 * 24;
    var PAGE_SIZE = 3;

    var reviewContainer = document.querySelector('.reviews-list');
    var filters = document.querySelector('.reviews-filter');
    var templateElement = document.querySelector('#review-template');
    var filtersContainer = document.querySelector('.reviews-filter');
    var elementToClone;
    var pageNumber = 0;
    var filteredReviews = [];
    var errorOrTimeout = function() {
      document.querySelector('.reviews').classList.add('reviews-load-failure');
    };
    var nextPageButton = document.querySelector('.reviews-controls-more');

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
    // объявление основной функции
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

    // объявляем функцию
    var isNextPageAvailable = function(reviews, page, pageSize) {
      return page < Math.floor(reviews.length / pageSize);
    };

    // отрисовака отзывов
    var renderReviews = function(reviews, page) {
      // чистим контейнер с отзывами
      reviewContainer.innerHTML = '';

      // задаем переменные для страниц
      // с чего начинаем - страница умножиная на размер х*3 = 1,3,6 и т.д.
      var from = page * PAGE_SIZE;
      // окончание диапазона - фром + 3
      var to = from + PAGE_SIZE;

      // slice - метов, который говорит нам взять 0 по текущий to, далее метод forEach перебирает массив... и я не могу это объяснить???
      reviews.slice(0, to).forEach(function(review) {
        // отдельный отзыв
        createReviewElement(review, reviewContainer);
      });

      if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
        nextPageButton.classList.remove('invisible');
      } else {
        nextPageButton.classList.add('invisible');
      }
    };

    // функция вывода следующих страниц
    var renderNextPages = function() {
      reviewContainer.innerHTML = '';
      if (isNextPageAvailable(filteredReviews, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderReviews(filteredReviews, pageNumber);
      }
    };
    nextPageButton.addEventListener('click', function() {
      renderNextPages();
    });

    var setFiltrationEnabled = function() {
      // контренеру добавляем событие клик и какую-то??? функцию
      filtersContainer.addEventListener('click', function(evt) {
        // не понимаю ???
        if (evt.target.classList.contains('reviews-filter-item')) {
          setFilterEnabled(evt.target.previousSibling.id);
        }
      });
    };

    // не пониимаю, чем setFiltrationEnabled отличается от setFilterEnabled ???
    var setFilterEnabled = function(filter) {
      filteredReviews = getFilteredReviews(window.reviews, filter);
      pageNumber = 0;
      renderReviews(filteredReviews, 0);
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

    // ВОТ ЭТО ГЛАВНАЯ ФУНКЦИЯ ВЫЗОВА!!!
    getReviews(function(loadedReviews) {
      // это вызывает массив отзывов - ???
      window.reviews = loadedReviews;
      // это фильтрует список
      setFiltrationEnabled();
      // отрисовку 3ех элементов
      renderReviews(loadedReviews, 0);
    });

    filters.classList.remove('invisible');
  }
})();
