document.addEventListener('DOMContentLoaded', function() {
  var loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Validate the phone number
    var phoneInput = document.getElementById('phone');
    var phoneNumber = phoneInput.value;
    var isNumber = /^\d+$/.test(phoneNumber); // Regex to check if string contains only digits

    if (phoneNumber.length > 0 && isNumber) {
      // If the input is valid, close the overlay
      document.getElementById('loginOverlay').style.display = 'none';
    } else {
      // If the input is invalid, inform the user
      alert('Please enter a valid phone number.');
      phoneInput.focus();
    }
  });
});