const isDevelopment = true //Consider adding this to a global variaables file
const serverAddress = isDevelopment ? 'http://localhost' : "http://eb-minipay-demo.shoelacewireless.com"
const serverPort = "8080"
const cookieName = "EcoBytesCookie"

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
    const emailInput = document.getElementById('email');
    const loginConfirmationForm = document.getElementById('loginConfirmationForm');
    const codeInput = document.getElementById('code');
    var email = ""
   
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        email = emailInput.value;

        var isValidEmail = /\S+@\S+\.\S+/.test(email);

        //TODO: Add UI for invalid email not found in backend
        if (isValidEmail) {
            login(email);
            loginOverlay.style.display = 'none';
            loginConfirmationOverlay.style.display = 'flex'
        } else {
            alert('Please enter a valid email address.');
            emailInput.focus();
            UpdateUI();

            setLoginStatus(false)
        }
    });

    loginConfirmationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        var code = codeInput.value;

        var isValidCode = /^\d{6}$/.test(code);

        if (isValidCode) {
           try {
                await loginConfirmation(email, code);
                UpdateUI();
                updateUserWalletValues();
                loginConfirmationOverlay.style.display = 'none';
            } catch (error) {
                alert('Error during confirmation: ' + error.message);
                codeInput.focus();
                setLoginStatus(false);
            }
        } else {
            alert('Please enter a valid 6-digit code.');
            codeInput.focus();
            setLoginStatus(false)
        }
    });

    const logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', function() {
        logout();
    });
});

async function login(email) {
  try {
    const response = await fetch(`${serverAddress}:${serverPort}/login`, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const json = await response.json();

  } catch (error) {
    console.error('Fetch error:', error);
    setLoginStatus(false);
  }
}

async function loginConfirmation(email, confirmationCode) {
  try {
    const response = await fetch(`${serverAddress}:${serverPort}/loginConfirmation`, {
      method: "POST",
      body: JSON.stringify({ email: email, confirmationCode: confirmationCode}),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const json = await response.json();
    setCookie(cookieName, json.response.token, 1);
    setLoginStatus(json.success);
  } catch (error) {
    console.error('Fetch error:', error);
    setLoginStatus(false);
  }
}

function logout() {
  deleteCookie(cookieName);
  setLoginStatus(false);
  UpdateUI();
}

function isUserLoggedIn() {

  setLoginStatus(doesCookieExist(cookieName));
  UpdateUI();
  if(getLoginStatus()) {
    updateUserWalletValues();
  }
  return getLoginStatus();
}

//MARK: Util functions
function UpdateUI() {
  const showOverlayBtn = document.getElementById('showOverlay');
  const logoutButton = document.querySelector('.logout-button');
  
  if(getLoginStatus()) {
    showOverlayBtn.textContent = "Convert EcoBytes in MiniPay";
    logoutButton.style.display = 'block';
  } else {
    showOverlayBtn.textContent = "LOGIN";
    logoutButton.style.display = 'none';
  }

  applyBlurEffect();
}

function applyBlurEffect() {
    var classNames = ['.chart-image', '.currency-number', '.efficiency-dots'];

    classNames.forEach(className => { 
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

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    const cookieValue = encodeURIComponent(value || "");
    document.cookie = name + "=" + cookieValue + expires + "; path=/; SameSite=Strict"; //TODO: Add secure flag when ready for production
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function doesCookieExist(cookieName) {
    const allCookies = document.cookie;
    const cookieArray = allCookies.split('; ');
    
    for (let cookie of cookieArray) {
        const [name, ] = cookie.split('=');
        if (name === cookieName) {
            return true;
        }
    }
    return false;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

window.onload = isUserLoggedIn;