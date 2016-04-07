function getMessage(a, b) {
  if(typeof(a) == 'boolean'){
    if(a == true){
      return 'Я попал в ' + b;
    }
    else {
      return 'Я никуда не попал';
    }
  }
  else{
    if(typeof(a) == 'number'){
      return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
    }
    else{
      if(Array.isArray(a) && Array.isArray(b)){
        var length = 0;
        a.forEach(function(item, index){
          length += (item * b[index]);
        });
        return 'Я прошёл ' + length + ' метров';
      }
      else {
        if(Array.isArray(a)){
          var sum = 0;
          a.forEach(function(item, index){
            sum += item
          });
          return 'Я прошёл ' + sum +' шагов';
        }
      }
    }
  }
}

function getMessage(a, b) {
  if(typeof(a) == 'boolean'){
    return a ? 'Я попал в ' + b : 'Я никуда не попал';
    }
  }



  else{
    if(Array.isArray(a) && Array.isArray(b)){
      var length = 0;
      a.forEach(function(item, index){
        length += (item * b[index]);
      });
      return 'Я прошёл ' + length + ' метров';
    }
    else {
      if(Array.isArray(a)){
        var sum = 0;
        a.forEach(function(item, index){
          sum += item
        });
        return 'Я прошёл ' + sum +' шагов';
      }
    }

  if(type (a) == 'object'){
    var sum = 0;
    var i = 0;
    while (i < a.length) {
      sum += a[i];
      ++i;
    }
    return 'Я прошёл ' + sum +' шагов';
  }


    if(type (a) == 'object' && type (b) == 'object') {
      var length = 0;
      for (i=0; i<a.length; ++i){
        length += a[i] * b[i];
      }
        return 'Я прошёл ' + length + ' метров';
    }
