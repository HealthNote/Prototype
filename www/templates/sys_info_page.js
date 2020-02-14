function userMessage(text){
  pageContent.innerHTML = '';
  let userMessageDiv = document.createElement('div');
  userMessageDiv.classList.add('user_message');
  pageContent.append(userMessageDiv);
  userMessageDiv.innerHTML = text;
}

function pushAlert(text){
  let myAlert = document.createElement('div');
  myAlert.classList.add('my_alert');
  myAlert.innerHTML = text;
  document.body.append(myAlert);
  setTimeout(() => {
    myAlert.style.opacity = 0;
    setTimeout(() => {
      myAlert.remove();
    }, 3000);
  }, 1000);
}
