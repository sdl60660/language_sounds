
// Initialize global variables
let languageData = null;
let segmentData = null;

// Determine if the user is browsing on mobile and adjust worldMapWidth if they are
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    phoneBrowsing = true;
}


var promises = [
	d3.json('static/data/langauges_with_phonemes.json'),
    d3.json('static/data/segment_data.json')
];

Promise.all(promises).then(function(allData) {
	languageData = allData[0];
	segmentData = allData[1];

	beeswarm = new BeeSwarm('#language-chart');

});


