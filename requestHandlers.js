var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	customFunction = require("./customFunction");

function start(response) {
	console.log("Request handler 'start' was called.");

	fs.readFile("uploadForm.html", function(err, html) {
		if (err) {
			console.log(err);
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(html);
			response.end();
		}
	});
}
function upload(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("About to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		if(error) {
			console.log(error);
		} else if (customFunction.isEmpty(files)) {			
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not found");
			response.end();
		} else {
			fs.rename(files.upload.path, "tmp/test.jpg", function(err) {
				if (err) {
					fs.unlink("tmp/test.jpg");
					fs.rename(files.upload.path, "tmp/test.jpg");
				}
			});
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("received image:<br/>");
			response.write("<img src='/show' />");
			response.end();
		}


	});
}

function show(response) {
	console.log("Request handler 'show' was called.")
	fs.readFile("tmp/test.jpg", "binary", function (error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "/n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;
