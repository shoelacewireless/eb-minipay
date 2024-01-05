document.addEventListener('DOMContentLoaded', function() {
    const spinWheelOverlay = document.getElementById('spinWheelOverlay');
    const congratulationsOverlay = document.getElementById('congratulationsOverlay');
    const downloadOverlay = document.getElementById('downloadOverlay');
    const spinButton = document.getElementById('spinButton');
    const wheel = document.querySelector('.wheel');

    // Define the items with their odds as percentages (make sure they sum up to 100)
    const items = [
        { number: 1, label: 'EB Silver 10K', odds: 30, color: '#00BFFF' }, // Deep Sky Blue
        { number: 2, label: 'EB Silver 50K', odds: 20, color: '#FF7F50' }, // Coral
        { number: 3, label: 'EB Silver 100K', odds: 15, color: '#FFD700' }, // Sunset Yellow
        { number: 4, label: 'EB Silver 200K', odds: 10, color: '#32CD32' }, // Lime Green
        { number: 5, label: 'EB Gold 5K', odds: 10, color: '#FF6347' }, // Tomato Red
        { number: 6, label: 'EB Gold 10K', odds: 8, color: '#8A2BE2' }, // Violet
        { number: 7, label: 'EB Gold 50K', odds: 5, color: '#DA70D6' }, // Orchid
        { number: 8, label: 'EB Gold 100K', odds: 2, color: '#40E0D0' }  // Turquoise
    ];

    const degreesPerSegment = 360 / items.length;

    /*items.forEach((item, index) => {

        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.backgroundColor = item.color;
        const rotateAngle = degreesPerSegment * index;
        segment.style.transform = `rotate(${rotateAngle}deg)`;

        // Create the span for the labels
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        labelSpan.className = 'segment-label';
        segment.appendChild(labelSpan);

        wheel.appendChild(segment);
    });*/

    items.forEach((item, index) => {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.backgroundColor = item.color;
        const rotateAngle = degreesPerSegment * index;
        segment.style.transform = `rotate(${rotateAngle}deg)`;

        // Create the container for the label and image
        const labelContainer = document.createElement('div');
        labelContainer.className = 'segment-label';

        // Split the label to insert the image
        let labelParts = item.label.split(' ');
        labelParts.forEach((part, partIndex) => {
            if (part === 'Silver') {
                // Create an image element for silver
                const silverImage = document.createElement('img');
                silverImage.src = 'images/silver_coin.svg';
                silverImage.alt = 'Silver';
                labelContainer.appendChild(document.createTextNode(' '));
                labelContainer.appendChild(silverImage);
                labelContainer.appendChild(document.createTextNode(' '));
            } else if (part === 'Gold') {
                // Create an image element for gold
                const goldImage = document.createElement('img');
                goldImage.src = 'images/gold_coin.svg';
                goldImage.alt = 'Gold';
                labelContainer.appendChild(document.createTextNode(' '));
                labelContainer.appendChild(goldImage);
                labelContainer.appendChild(document.createTextNode(' '));
            } else {
                // For other parts of the label, add them as text
                if (partIndex > 0) {
                    labelContainer.appendChild(document.createTextNode(' ')); // Add space between words
                }
                labelContainer.appendChild(document.createTextNode(part));
            }
        });

        segment.appendChild(labelContainer);
        wheel.appendChild(segment);
    });

    // This function calculates which segment the wheel should stop on
    function calculateSegment() {
        let rand = Math.random() * 100;
        let sumOdds = 0;

        for (let i = 0; i < items.length; i++) {
            sumOdds += items[i].odds;
            if (rand <= sumOdds) {
                return i;
            }
        }
        return 0; // Default to the first item if something goes wrong
    }

    // Show the spin wheel overlay after 5 seconds if it hasn't been shown before
    if (!sessionStorage.getItem('spinWheelOverlayShown')) {
        setTimeout(function() {
            spinWheelOverlay.style.display = 'flex';
            sessionStorage.setItem('spinWheelOverlayShown', 'true');
        }, 5000);
    }

    // Spin button event listener
    spinButton.addEventListener('click', function() {

        // Disable the button at the start of the spin
        spinButton.disabled = true;

        const segmentIndex = calculateSegment(); // This is the index of the segment to win
        const spinMultiplier = 10; // Determines how many times the wheel spins before stopping
        const segmentDegrees = 360 / items.length; // Degrees per segment

        // Calculate the offset to align the winning segment with the top center.
        //TODO: find better way to align now adding 1 segment at the end so it aligns with arrow
        const finalPosition = (spinMultiplier * 360) - (segmentIndex * segmentDegrees) + segmentDegrees;

        // Reset the transition and transform to apply a new spin
        wheel.style.transition = '';
        wheel.style.transform = 'rotate(0deg)';

        // Force a reflow in between removing and adding the transition
        wheel.offsetHeight;

        // Spin the wheel to the final position
        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = `rotate(${finalPosition}deg)`;

        // Once the spinning stops, display the result
        wheel.addEventListener('transitionend', function() {
            wheel.style.transition = 'none';
            // Normalize the degrees so the wheel stops with the segment in the middle
            const normalizedDegrees = finalPosition % 360;
            wheel.style.transform = `rotate(${normalizedDegrees}deg)`;

            setTimeout(function() {
            //Wheel spin finish logic after 2 seconds
                spinWheelOverlay.style.display = 'none';
                if(getLoginStatus()) {
                    congratulationsOverlay.style.display = 'flex';
                } else {
                    downloadOverlay.style.display = 'flex';
                }
            }, 1250); // milliseconds delay
        }, { once: true });
    });

    // Close button event listener
    document.getElementById('closeSpinWheel').addEventListener('click', function() {
        spinWheelOverlay.style.display = 'none';
    });
    document.getElementById('closeDownloadOverlay').addEventListener('click', function() {
        downloadOverlay.style.display = 'none';
    });
    document.getElementById('closeCongratulationsOverlay').addEventListener('click', function() {
        congratulationsOverlay.style.display = 'none';
    });

    // Show button event listener
    document.getElementById('showSpinWheelBtn').addEventListener('click', function() {
        spinButton.disabled = false;
        spinWheelOverlay.style.display = 'flex';
    });
});