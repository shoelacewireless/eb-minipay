var sharedState = {
    isLoggedIn: false
};

function setLoginStatus(isLoggedIn) {
    sharedState.isLoggedIn = isLoggedIn;
}

function getLoginStatus() {
    return sharedState.isLoggedIn;
}

function updateLoginStatus(isLoggedIn) {
    // Dispatch a custom event with the login status
    var event = new CustomEvent('loginStatusChanged', { detail: { loggedIn: isLoggedIn } });
    document.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
   
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var phoneNumber = phoneInput.value;
        var isNumber = /^\d+$/.test(phoneNumber); // Regex to check if string contains only digits

        if (phoneNumber.length > 0 && isNumber) {
            setLoginStatus(true)
            UpdateUI();  
            loginOverlay.style.display = 'none';
        } else {
            alert('Please enter a valid phone number.');
            phoneInput.focus();
            UpdateUI();
            setLoginStatus(false)
        }
    });
});

function isUserLoggedIn() {
  UpdateUI(); 
  return getLoginStatus()
}

function UpdateUI() {
  const showOverlayBtn = document.getElementById('showOverlay');
  if(getLoginStatus()) {
    showOverlayBtn.textContent = "Convert EcoBytes in MiniPay";
  } else {
    showOverlayBtn.textContent = "LOGIN"
  }

  applyBlurEffect()
}

function applyBlurEffect() {
    // Define an array with your different class names
    var classNames = ['.chart-image', '.currency-number', '.efficiency-dots'];

    // Iterate over each class
    classNames.forEach(className => {
        // Select all elements with the current class
        var elements = document.querySelectorAll(className);
        elements.forEach(element => {
            if (!getLoginStatus()) {
                element.classList.add('blur-effect');
            } else {
                element.classList.remove('blur-effect');
            }
        });
    });
}

window.onload = isUserLoggedIn;