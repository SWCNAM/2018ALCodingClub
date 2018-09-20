function print(message) {
    const elem = getOutputElement();
    elem.innerHTML += message + '<br />';
}

function clear() {
  const elem = getOutputElement();
  elem.innerHTML = '';
}

function getOutputElement() {
  return document.getElementById('output');
}