document.addEventListener('DOMContentLoaded', function() {
    const spinWheelOverlay = document.getElementById('spinWheelOverlay');
    const spinButton = document.getElementById('spinButton');
    const wheel = document.querySelector('.wheel');

    // Define the items with their odds as percentages (make sure they sum up to 100)
   const items = [
        { number: 1, label: 'EB Silver 10K', odds: 12.5, color: '#FF0000' },
        { number: 2, label: 'EB Silver 50K', odds: 12.5, color: '#FF7F00' },
        { number: 3, label: 'EB Silver 100K', odds: 12.5, color: '#FFFF00' },
        { number: 4, label: 'EB Gold 5K', odds: 12.5, color: '#008000' },
        { number: 5, label: 'EB Gold 10K', odds: 12.5, color: '#0000FF' },
        { number: 6, label: 'EB Gold 50K', odds: 12.5, color: '#4B0082' },
        { number: 7, label: 'Celo cUSD 50', odds: 12.5, color: '#EE82EE' },
        { number: 8, label: 'Celo cUSD 10', odds: 12.5, color: '#40E0D0' }
    ];

    const degreesPerSegment = 360 / items.length;

    items.forEach((item, index) => {

        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.backgroundColor = item.color;
        const rotateAngle = degreesPerSegment * index;
        segment.style.transform = `rotate(${rotateAngle}deg)`;

        // Create the span for the label
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        labelSpan.className = 'segment-label';
        segment.appendChild(labelSpan);

        wheel.appendChild(segment);
    });

    // This function calculates which segment the wheel should stop on
    function calculateSegment() {
        let rand = Math.random() * 100; // Random number between 0 and 100
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
        const segmentIndex = calculateSegment();
        const spinDegrees = 1800; // Base spin to ensure it spins multiple times
        const segmentDegrees = 360 / items.length; // Degrees per segment
        const offsetDegrees = segmentDegrees * segmentIndex; // Offset to align with the chosen segment
        const totalDegrees = spinDegrees + offsetDegrees;

        // Spin the wheel
        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = `rotate(${totalDegrees}deg)`;

        // Once the spinning stops, display the result
        wheel.addEventListener('transitionend', function() {
            wheel.style.transition = 'none';
            const normalizedDegrees = totalDegrees % 360;
            wheel.style.transform = `rotate(${normalizedDegrees}deg)`;
            alert(`Congratulations! You won: ${items[segmentIndex].label}`);
        }, { once: true });
    });

    // Close button event listener
    document.getElementById('closeSpinWheel').addEventListener('click', function() {
        removeSegmentHighlights();
        spinWheelOverlay.style.display = 'none';
    });

    // Show button event listener
    document.getElementById('showSpinWheelBtn').addEventListener('click', function() {
        spinWheelOverlay.style.display = 'flex';
    });
});