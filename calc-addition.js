

var Iterator = 0, completedBlocks=0, nAllBlocks = 12,
	addition = [], leftCorrect = true, blockAccuracy = 0, 
	ncorrect = 0.00001, nincorrect = 0.00001, isAccurate = null,
	lastResponse="", nPerBlock = 40, slowTyping = false, typeLimit = 2000;

// p = pslides.currentSlide.querySelector("p"); p.innerHTML = createMask(n=8)
function createMask(n=5, join="") {
	const set = ["&#xAEBC;","&#xCA8E;","&#xC565;","ʎ","㕝","을","㢁"];
	// ,"Ӿ","#","&Delta;","&notin;","ʪ"
	if (n >= set.length) {
		new Error("Argument \"n\" is larger than the symbol set array.");
	}
	let res = pslides.shuffle(set).slice(0, n);
	return res.join(join);
}

function determineCorrectness() {
	if (addition===undefined) return;
	if (addition[Iterator].result==lastResponse) {
		isAccurate = true;
		ncorrect++;
	} else if (lastResponse.length<2) {
		isAccurate = null;
		nincorrect++;
	} else {
		isAccurate = false;
		nincorrect++;
	}
}

// What should be written during practice if a response is correct?
function writeFeedback() {
	
	if (pslides.language.lang=="de") {
	
		if (isAccurate === null) { // no response
			return "<span style='color:#D19800;font-size:200%'>&#9201; Zu schnell &#9201;</span>";
		} else if (isAccurate) { // correct response
			return "<span style='color:green;font-size:200%'>&#10004; Richtig &#10004;</span>";
		} else if (isAccurate===false) { // incorrect response
			return "<span style='color:red;font-size:200%'>&#x2717; Falsch &#x2717;</span>";
		} else {
			return "<span style='color:red;font-size:200%'>! Error !</span>";
		}
	
	} else if (pslides.language.lang=="fr") {
	
		if (isAccurate === null) { // no response
			return "<span style='color:#D19800;font-size:200%'>&#9201; Trop rapide &#9201;</span>";
		} else if (isAccurate) { // correct response
			return "<span style='color:green;font-size:200%'>&#10004; Correct &#10004;</span>";
		} else if (isAccurate===false) { // incorrect response
			return "<span style='color:red;font-size:200%'>&#x2717; Incorrect &#x2717;</span>";
		} else {
			return "<span style='color:red;font-size:200%'>! Error !</span>";
		}
	
	} else {
		
		if (isAccurate === null) { // no response
			return "<span style='color:#D19800;font-size:200%'>&#9201; Too fast &#9201;</span>";
		} else if (isAccurate) { // correct response
			return "<span style='color:green;font-size:200%'>&#10004; Correct &#10004;</span>";
		} else if (isAccurate===false) { // incorrect response
			return "<span style='color:red;font-size:200%'>&#x2717; Incorrect &#x2717;</span>";
		} else {
			return "<span style='color:red;font-size:200%'>! Error !</span>";
		}

	}
}

// 
pslides.eventListeners.onkeyup = function(event) {
	if (event.code == "Space" && 
	    pslides.currentSlide.getAttribute("name")==="trial_response") {
		changeSlide(1);
	}
}

pslides.eventListeners.onkeydown = function(event) {
	console.log("code: ", event.code);
	console.log("key: ",  event.key);
	if (event.code == "Space" && 
	    pslides.currentSlide.getAttribute("name")==="trial_space") {
		changeSlide(1);
		return;
	}
	
	if (pslides.currentSlide.getAttribute("name")!=="trial_typedigits") return;
	
	const responsedisplay = pslides.currentSlide.querySelector(".responsedisplay");
	let inner = responsedisplay.innerHTML;
	if (!isNaN(Number(event.key)) && inner.length < 3) {
		responsedisplay.innerHTML = inner+event.key;
		if (pslides.key.down.t.length==1 && pslides.key.down.t[0] > typeLimit) slowTyping = true;
		return;
	}
	if (["Delete","Backspace"].includes(event.code)) {
		responsedisplay.innerHTML = inner.slice(0,inner.length-1)
	}
}

function clearResponseBoxes() {
	let nodes = document.querySelectorAll(".responsedisplay");
	lastResponse = "";
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].innerHTML!=="") lastResponse = nodes[i].innerHTML.trim();
		nodes[i].innerHTML = "";
	}
}
