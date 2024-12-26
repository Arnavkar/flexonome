//Credit to cwilso.github.io/metronome

var timerID=null;
var schedulerInterval=25.0;

self.onmessage=function(e){
	if (e.data=="start") {
		console.log("Starting Worker");
		timerID=setInterval(
			() => postMessage("tick"),
			schedulerInterval
		);
	}
	else if (e.data.interval) {
		schedulerInterval=e.data.interval;
		console.log("New Scheduler Interval="+schedulerInterval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(
				() => postMessage("tick"),
				schedulerInterval
			);
		}
	}
	else if (e.data=="stop") {
		console.log("Stopping Worker");
		clearInterval(timerID);
		timerID=null;
	}
};

postMessage('hi there');