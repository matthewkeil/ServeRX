const noPreFlight = {
	method: [
		'GET', 
		'POST', 
		'HEAD'
	 ],
	allowedHeaders: [
		'Connection',
		'Referer',
		'Host',
		'User-Agent',
		'Authorization',
		'Accept',
		'Accept-Language',
		'Content-Language',
		'Content-Type',
		'DPR',
		'Downlink',
		'Save-Data',
		'Viewport-Width',
		'Width'
	 ],
	forbiddenHeaders: [
		'Proxy-',
		'Sec-',
		`Accept-Charset`,
		`Accept-Encoding`,
		`Access-Control-Request-Headers`,
		`Access-Control-Request-Method`,
		`Connection`,
		`Content-Length`,
		`Cookie`,
		`Cookie2`,
		`Date`,
		`DNT`,
		`Expect`,
		`Host`,
		`Keep-Alive`,
		`Origin`,
		`Referer`,
		`TE`,
		`Trailer`,
		`Transfer-Encoding`,
		`Upgrade`,
		`Via`
	 ],
	allowedContentType: [
		'application/x-www-form-urlencoded',
		'multipart/form-data',
		'text/plain'
	]
}

	


