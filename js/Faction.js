var Faction = function (nameIn) {
	this.name = nameIn;
	this.url = "";
};

Faction.prototype.setURl = function(urlIn) {
	this.url = urlIn;
};

Faction.prototype.getMove = function() {
	//console.log("getMove");
	var move = "Empty Move";

	$.ajax({
		url: this.url,
		async: false,
		type: "POST",
		data: "type=move",
		success: function(data){ 
			//console.log(data);
			move = data;
		}
	});

	return move;
};

Faction.prototype.getStart = function() {
	var start = "No Start";

	$.ajax({
		url: this.url,
		async: false,
		type: "POST",
		data: "type=start",
		success: function(data){
			//console.log(data);
			start = data;
		}
	});

	return start;
};


Faction.prototype.sendReports = function(reports) {
	$.ajax({
		url: this.url,
		async: false,
		type: "POST",
		data: {type: "reports", data: JSON.stringify(reports)}
	});
}