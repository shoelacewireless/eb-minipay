document.addEventListener('DOMContentLoaded', function() {
    // Get references to the necessary elements
    const overlay = document.querySelector('.conversion-overlay');
    const conversionBox = document.querySelector('.conversion-container');
    const showOverlayBtn = document.getElementById('showOverlay');
    const dismissOverlayBtn = document.getElementById('dismissOverlay');
    const convertBtn = document.getElementById('convert-btn');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const buttonText = document.getElementById('button-text');
    const loadingSpinner = document.getElementById('loadingSpinner');

    //SuccessOverlay
    const successOverlay = document.getElementById('successOverlay');
    const dismissSuccessOverlay = document.getElementById('closeSuccessOverlay');


    // Event listener for showing the overlay
    showOverlayBtn.addEventListener('click', function() {
        overlay.style.display = 'flex'; // Show the overlay
    });

    // Event listener for dismissing the overlay with the "X" button
    dismissOverlayBtn.addEventListener('click', function() {
        overlay.style.display = 'none'; // Hide the overlay
    });

    // Event listener for dismissing the overlay when clicking outside the box
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) { // Check if the click was directly on the overlay
            overlay.style.display = 'none'; // Hide the overlay
        }
    });

    // Prevent clicks on the conversion box from propagating to the overlay
    // (this ensures that the overlay doesn't close when the box is clicked)
    conversionBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    //Conversion overlay button listeners
    convertBtn.addEventListener('click', function() {

        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        sendcUSD().then(function(response) {

            buttonText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
            convertBtn.disabled = false;
            
            if (response.success) {
                overlay.style.display = 'none'; 
                successOverlay.style.display = 'flex';
            } else {
                console.error(response.error);
                alert(response.error)
            }
        });
    });

    incrementBtn.addEventListener('click', () => {
        updateConversionValues(1000);
    });

    decrementBtn.addEventListener('click', () => {
        updateConversionValues(-1000);
    });

    //Success Overlay functions
    dismissSuccessOverlay.addEventListener('click', function() {
        successOverlay.style.display = 'none';
    });

});