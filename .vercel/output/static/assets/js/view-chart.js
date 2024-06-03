document.addEventListener('DOMContentLoaded', function() {
    // Access view count data from the localized script
    var data = view_counts_data;

    d3.calendarHeatmap()
        .data(data)
        .selector('#github-calendar')
        .tooltipEnabled(true)
        .colorRange(['#ebedf0', '#7fc8f8', '#216e9c'])
        .legendEnabled(true)
        .onClick(function(data) {
            // Handle click events if needed
            console.log('Clicked on date:', data.date);
        })
        .onMouseOver(function(data) {
            // Handle mouseover events if needed
            console.log('Mouseover on date:', data.date);
        })
        .render();
});
