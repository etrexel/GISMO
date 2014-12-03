var Faction = function (nameIn) {
	var name = nameIn;
	var url = "";
	var lastResult;
};

Faction.prototype.setURl = function(urlIn) {
	this.url = urlIn;
};

Faction.prototype.getMove = function(onSuccess) {
	this.lastResult = null;
	$.ajax({
		url: this.url,
		async: false,
		type: "POST",
		data: "type=move",
		timeout: 1000,
		success: function(data) {
			this.lastResult = data;
			onSuccess();
		},
		error: function() {
			this.lastResult = "timeout";
		}
	});
};

Faction.prototype.getStart = function(onSuccess) {
	$.ajax({
		url: this.url,
		async: false,
		type: "POST",
		data: "type=start",
		success: onSuccess
	});
};