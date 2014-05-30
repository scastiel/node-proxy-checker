var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var request = require('request');

var readProxiesFromFile = function(file, callback) {
	var instream = fs.createReadStream(file);
	var outstream = new stream;
	var rl = readline.createInterface(instream, outstream);

	rl.on('line', function(line) {
		if( !/^#/.exec(line) ) {
			var elts = line.split(':');
			var host = elts[0];
			var port = elts[1];
			if( host && port )
				callback(host, port);
		}
	});
}

/**
 * Checks if a proxy is accessible.
 *
 * @param host Host of the proxy
 * @param port Port of the proxy
 * @param options   Options to check if the proxy is accessible. It's an object {
 *                      url: the complete URL to check the proxy,
 *                        regex: an optional regex to check for the presence of some text on the page
 *                      }.
 * @param callback Callback function to be called after the check. Parameters:
 *                      host: host of the proxy
 *                      port: port of the proxy,
 *                      ok: true if the proxy is accessible, false otherwise,
 *                      statusCode: HTTP code returned by the request (usually 200 if no error),
 *                      err: error if there was one.
 */
var checkProxy = function(host, port, options, callback) {
	var proxyRequest = request.defaults({
		proxy: 'http://' + host + ':' + port
	});
	proxyRequest(options.url, function(err, res) {
		var testText = 'content="Yelp"';
		if( err ) {
			callback(host, port, false, -1, err);
		} else if( res.statusCode != 200 ) {
			callback(host, port, false, res.statusCode, err);
		} else if( !res.body || (options.regex && !options.regex.exec(res.body)) ) {
			callback(host, port, false, res.statusCode, "Body doesn't match the regex " + options.regex + ".");
		} else {
			callback(host, port, true, res.statusCode);
		}
	});
}

/**
* Checks if a proxy is accessible.
*
* @param file File containing the proxy list, one per line formatted as "host:port".
* @param options   Options to check if the proxy is accessible. It's an object {
*                      url: the complete URL to check the proxy,
*                        regex: an optional regex to check for the presence of some text on the page
*                      }.
* @param callback Callback function to be called after each proxy check. Parameters:
*                      host: host of the proxy
*                      port: port of the proxy,
*                      ok: true if the proxy is accessible, false otherwise,
*                      statusCode: HTTP code returned by the request (usually 200 if no error),
*                      err: error if there was one.
*/
var checkProxiesFromFile = function(file, options, callback) {
	readProxiesFromFile(file, function(host, port) {
		checkProxy(host, port, options, callback);
	});
}

module.exports = {
	checkProxiesFromFile: checkProxiesFromFile,
	checkProxy: checkProxy
};
