document.addEventListener("DOMContentLoaded", function() {

    var cellData = 1.4;
    var wifiData = 7.5; 

    // Update the HTML with the wifiData value
    document.getElementById('cellValue').textContent = cellData;
    document.getElementById('wifiValue').textContent = wifiData;
    
    var ctx = document.getElementById('dataUsageChart').getContext('2d');
    
    var data = {
        datasets: [{
            data: [cellData, wifiData],
            backgroundColor: ['#DF6033', '#64B630'],
            borderWidth: 0
        }]
    };

     var options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        cutoutPercentage: 80, // Adjust to change the width of the segments.
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
});