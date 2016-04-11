'use strict';
(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
  // FFFFFвводим переменные
  // все элементы с именем review-mar
  var reviewMarks = document.querySelectorAll('input[name=review-mark]');
  // с айди review-name
  var reviewName = document.querySelector('#review-name');
  // с айди review-text
  var reviewText = document.querySelector('#review-text');
  // элмент баттон с классом review-submit
  var reviewButton = document.querySelector('button.review-submit');
  // переременные для скрытия текста, что нужно заполнить
  var reviewNameLabel = document.querySelector('label.review-fields-name');
  var reviewTextLabel = document.querySelector('label.review-fields-text');
  // закрываем и сам текст что надо что-то скрыть
  var reviewFields = document.querySelector('div.review-fields');

  // нужны комментраии? по умолчанию нет, но если будет тру - то да
  var commentIsNeeded = false;
  // нужно ли скрывать кнопку? фалз - не надо, тру - да ноадо сркыть
  var isDisabledStatus = true;
  // цикл в котором мы перебираем массив reviewMarks
  for (var i = 0; i < reviewMarks.length; i++) {
    // и на каждое изменине какждого индекса запускаем функцию checkButtonState
    reviewMarks[i].onchange = checkButtonState;
  }
  // отслеживаем изменение полей, если измениня есть запускаем функцию checkButtonState
  reviewName.oninput = checkButtonState;
  reviewText.oninput = checkButtonState;

  // вводим функцию checkButtonState
  function checkButtonState() {
    // в ее теле пишем: переменная commentIsNeeded ровна, если  значение атрибута value у чекнутого инпута с именем review-mark меньше трех, то истина, иначе ложь
    commentIsNeeded = document.querySelector('input[name="review-mark"]:checked').value < 3 ? true : false;
    // если reviewName.value не равен "пусто"
    if (reviewName.value !== '') {
      // если. тут прямо смотрим знaчнение, кототоре приходит из 43 сточки (Оно может быть или тру или фалсе) Тру - меньше 3, нужен комментарий. Фалс - 3 или больше, комменатрий не нужен.
      if (commentIsNeeded) {
          // если reviewText не равен "пусто"
        if (reviewText.value !== '') {
          // то надо вадает значение - Нет! это  не надо скрывать!
          // подробнее - если имя заполнено (reviewName.value !== '') и мы видим, что коментировать НУЖНО (оценка меньше трех) и тект заполнен - то НЕ надо скрыть кнопку отправить
          isDisabledStatus = false;
          // Поскольку текстовое поле поле заполнено, его заполнять не надо и мы скрывает упоминанине
          reviewTextLabel.classList.add('invisible');
        } else {
          // подробнее - если имя заполнено (reviewName.value !== '') и мы видим, что коментировать НУЖНО (оценка меньше трех), НО тект  НЕ заполнен - то Надо скрыть кнопку отправить
          // иначае - да! это нужно скрыть!
          isDisabledStatus = true;
          // Поскольку текстовое поле НЕ заполнено, то снова напоминаем его заполнить
          reviewTextLabel.classList.remove('invisible');
        }
      } else {
        // иначе! срабатывает только когда commentIsNeeded вернет фалс и вадает значение - Нет! это  не надо скрывать!
        // подробнее - если имя заполнено (reviewName !== '') и мы видим, что коментировать НЕ нужно (оценка три или выше) - то этого достаточно, что бы НЕ надо скрыть кнопку отправить
        isDisabledStatus = false;
        // Фалс - 3 или больше, комменатрий не нужен. Мы убераем напоминание.
        reviewTextLabel.classList.add('invisible');
      }
      // раз имя заполенено, то мы скрываем указать дописать имя
      reviewNameLabel.classList.add('invisible');
    }else {
      // иначе! срабатывает только когда reviewName равен "пусто" и вадает значение - да! это нужно скрыть!
      // подробнее Имя не указано - нужно скрыть при любом случаи)))
      isDisabledStatus = true;
      // посколько имено не заполнено, то мы вновь показаваем что имя нужно написать
      reviewNameLabel.classList.remove('invisible');
    }
    // если элемент reviewNameLabel имеет класс 'invisible' и элемент reviewTextLabel имеет класс 'invisible'
    if(reviewNameLabel.classList.contains('invisible') && reviewTextLabel.classList.contains('invisible')) {
      // то мы элементу reviewFields добавляем класс invisible
      reviewFields.classList.add('invisible');
    } else {
      // если нет, то мы удаляем класс invisible
      reviewFields.classList.remove('invisible');
    }
    // атрибут кнопки disabled (который открывает за скрытие) получает значение (становиться зависим) от переменной isDisabledStatus (которая или тру или фолз), которая у нас по умолчанию фолз это написано в html и закреплено в строчке
    reviewButton.disabled = isDisabledStatus;
  }
})();
