var Faction = function () {
	var url = "";
};

Faction.prototype.setURl = function(urlIn) {
	this.url = urlIn;
};

Faction.prototype.getMove = function() {
	//console.log("getMove");
	$.ajax({
		url: this.url,
		type: "POST",
		data: "type=move",
		success: function(data){ 
			console.log(data) 
		}
	});
};

Faction.prototype.getStart = function() {
	$.ajax({
		url: this.url,
		type: "POST",
		data: "type=start",
		success: function(data){
			console.log(data) 
		}
	});
};