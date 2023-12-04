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


//Blur for not logged users
function isUserLoggedIn() {
    // This function currently always returns false
    // Replace with actual login check logic later
    return false;
}

function applyBlurEffect() {
    // Define an array with your different class names
    var classNames = ['.chart-image', '.currency-number', '.efficiency-dots'];

    // Iterate over each class
    classNames.forEach(className => {
        // Select all elements with the current class
        var elements = document.querySelectorAll(className);
        elements.forEach(element => {
            if (!isUserLoggedIn()) {
                element.classList.add('blur-effect');
            } else {
                element.classList.remove('blur-effect');
            }
        });
    });
}

window.onload = applyBlurEffect;