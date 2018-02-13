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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxXQUFXLEdBQUc7SUFDbkIsTUFBTSxFQUFFO1FBQ1AsS0FBSztRQUNMLE1BQU07UUFDTixNQUFNO0tBQ0w7SUFDRixjQUFjLEVBQUU7UUFDZixZQUFZO1FBQ1osU0FBUztRQUNULE1BQU07UUFDTixZQUFZO1FBQ1osZUFBZTtRQUNmLFFBQVE7UUFDUixpQkFBaUI7UUFDakIsa0JBQWtCO1FBQ2xCLGNBQWM7UUFDZCxLQUFLO1FBQ0wsVUFBVTtRQUNWLFdBQVc7UUFDWCxnQkFBZ0I7UUFDaEIsT0FBTztLQUNOO0lBQ0YsZ0JBQWdCLEVBQUU7UUFDakIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsaUJBQWlCO1FBQ2pCLGdDQUFnQztRQUNoQywrQkFBK0I7UUFDL0IsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixRQUFRO1FBQ1IsU0FBUztRQUNULE1BQU07UUFDTixLQUFLO1FBQ0wsUUFBUTtRQUNSLE1BQU07UUFDTixZQUFZO1FBQ1osUUFBUTtRQUNSLFNBQVM7UUFDVCxJQUFJO1FBQ0osU0FBUztRQUNULG1CQUFtQjtRQUNuQixTQUFTO1FBQ1QsS0FBSztLQUNKO0lBQ0Ysa0JBQWtCLEVBQUU7UUFDbkIsbUNBQW1DO1FBQ25DLHFCQUFxQjtRQUNyQixZQUFZO0tBQ1o7Q0FDRCxDQUFBIn0=