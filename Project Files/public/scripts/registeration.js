 const username = document.getElementByClassName('username');
 const password = document.getElementByClassName('password');
 const submit = document.getElementByClassName('submit');

 submit.addEventListener('click', function(e) {
     console.log("hel" + username.value);
 })
 username.addEventListener('keydown', function(e) {
     console.log(username.value);
 });