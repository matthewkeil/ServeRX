"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class ServerConfig {
    constructor(config = {}) {
        _.defaultsDeep(config, ServerConfig.defaultServerConfiguration);
    }
}
ServerConfig.check = function (obj) {
    return true;
};
ServerConfig.defaultServerConfiguration = {
    name: 'ServeRX',
    onListening: true,
    onClosing: false,
    request: {
        methodsHandled: ['get', 'put', 'post', 'patch', 'delete', 'options', 'head']
    },
    timeout: {},
    handleUpgrade: false,
    handleCheckContinue: false,
    handleClientError: false,
    headers: {
        origin: {
            allowed: {},
            blacklist: {}
        }
    },
    router: {},
    response: {}
};
exports.ServerConfig = ServerConfig;
if (require.main !== module) {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlnUlguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb25maWdSWC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDRCQUE0QjtBQTJENUI7SUFzQ0MsWUFBWSxTQUF1QyxFQUFFO1FBRXBELENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQ2hFLENBQUM7O0FBR00sa0JBQUssR0FBRyxVQUFVLEdBQVE7SUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQTtBQUdjLHVDQUEwQixHQUFrQjtJQUMxRCxJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLE9BQU8sRUFBRTtRQUNSLGNBQWMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQztLQUM1RTtJQUNELE9BQU8sRUFBRSxFQUFFO0lBQ1gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsbUJBQW1CLEVBQUUsS0FBSztJQUMxQixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLE9BQU8sRUFBRTtRQUNSLE1BQU0sRUFBRTtZQUNQLE9BQU8sRUFBRSxFQUFFO1lBQ1gsU0FBUyxFQUFFLEVBQUU7U0FDYjtLQUNEO0lBQ0QsTUFBTSxFQUFFLEVBQUU7SUFDVixRQUFRLEVBQUUsRUFBRTtDQUNaLENBQUE7QUFwRUYsb0NBcUVDO0FBR0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRTlCLENBQUMifQ==