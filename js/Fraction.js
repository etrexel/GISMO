var Fraction = function () {
	var url = "";
};

Fraction.prototype.setURl = function(urlIn) {
	this.url = urlIn;
};

Fraction.prototype.getMove = function() {
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

Fraction.prototype.getStart = function() {
	$.ajax({
		url: this.url,
		type: "POST",
		data: "type=start",
		success: function(data){
			console.log(data) 
		}
	});
};