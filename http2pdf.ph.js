var webserver = require('webserver');
var server = webserver.create();
var fs = require('fs');

function gup( name, url ) {
	if (!url) url = location.href
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	return results == null ? null : results[1];
}

var service = server.listen(8080, function(request, response) {
	var page = require('webpage').create();

	requrl = gup('url', request.url);

	console.log(JSON.stringify(request));

	if (!requrl || !requrl.match('https?://.*')) {
		response.close();
		return;
	}

	response.statusCode = 200;
	response.setEncoding('binary');
	response.setHeader('Content-Type', 'application/pdf');
	filename = 'out.pdf';

	page.open(requrl, function(status) {
		if (status=='success'){
			page.render(filename);
			response.write(fs.read(filename, 'b'));
			response.close();
		} else {
			console.log('Error: page.open status = '+status)
			response.write('error');
			response.close();
			return;
		}
	});
});
