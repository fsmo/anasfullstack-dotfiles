function factorialize(num) {

  var factorial = 1;

  if (num > 1) {

    factorial = num * factorialize(num - 1);
    return factorial;
  } else {
    return factorial;
  }
}

factorialize(5);
