document.addEventListener('DOMContentLoaded', function() {
    // Get references to the necessary elements
    const overlay = document.querySelector('.overlay');
    const conversionBox = document.querySelector('.conversion-box');
    const showOverlayBtn = document.getElementById('showOverlay');
    const dismissOverlayBtn = document.getElementById('dismissOverlay');

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
});