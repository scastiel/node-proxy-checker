# proxy-checker

*proxy-checker* is a Node.js module you can use to check if proxies from
a big list are working.

For example, let's say you want to connect to the website *example.com*, but it
blocks requests from your IP. So you search on the Internet a few proxy servers
to use to connect to this website. The problem is that a lot of proxies you can
find are not working, or maybe they are already blocked by *example.com*.

With *proxy-checker*, you can test big lists of proxy servers to see if they
work to send requests to a website.

## Example

To install the module: `npm install proxy-checker`

```javascript
var proxyChecker = require('proxy-checker');

proxyChecker.checkProxiesFromFile(
	// The path to the file containing proxies
	'/path/to/proxys.txt',
	{
		// the complete URL to check the proxy
		url: 'http://www.example.com',
		// an optional regex to check for the presence of some text on the page
		regex: /Example Domain/
	},
	// Callback function to be called after the check
	function(host, port, ok, statusCode, err) {
		console.log(host + ':' + port + ' => '
			+ ok + ' (status: ' + statusCode + ', err: ' + err + ')');
	}
);
```

The file you pass as first parameter contains the proxy servers to test. Here is
an example:

```
123.234.321.32:80
12.234.21.243:8080
132.34.212.4:3128
#127.32.76.123:80 <= This line will be ignored
```

Note that thanks to the [Readline](http://nodejs.org/api/readline.html) API,
the file is read line by line, so if your file contains thousands of lines it
shouldn't be an issue.
