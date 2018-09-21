function print(message) {
  const elem = getOutputElement();
  elem.innerHTML += '<div class="print">' + message + '</div>';
}

function clear() {
  const elem = getOutputElement();
  elem.innerHTML = '';
}

function getOutputElement() {
  return document.getElementById('output');
}

function getInput() {
  const input = document.createElement('input');
  const elem = getOutputElement();
  elem.appendChild(input);

  const button = document.createElement('button');
  button.innerText = 'Submit';
  elem.appendChild(button);

  let submitted = false;

  button.addEventListener('click', function() {
      submitted = true;
  });

  let num = 1;

  while(!submitted) {
    sleep(1000);

    num += 1;

    if(num == 5) {
      submitted = true;
    }
  }
}


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}