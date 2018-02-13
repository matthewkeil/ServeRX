"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("rxjs/operator/merge");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const FromEventObservable_1 = require("rxjs/observable/FromEventObservable");
const RouteR_1 = require("../routes/RouteR");
class Socket extends BehaviorSubject_1.BehaviorSubject {
    constructor(protocol, config, req, socket, head) {
        super(head);
        this.protocol = protocol;
        this.config = config;
        this.req = req;
        this.socket = socket;
        this.head = head;
        this.router = new RouteR_1.RouteR(this.config);
        this.subscriptions.push(this._buildSocketSubscription(), this.req.subscribe(request => this.router.handle(this.req, this.res.runNext(request))), this.res.subscribe(status => {
            this._updateStatus(status);
        }));
        this.req.parseMessage(_req);
    }
    _buildSocketSubscription() {
        let drain$, end$, timeout$;
        if (!this.protocol.startsWith('http')) {
            drain$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'drain', () => { });
            end$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'end', () => { });
            timeout$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'timeout', () => { });
        }
        ;
        let data$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'data', 
        // data should be parsed to see if its another request or being pushed to the pool
        (chunk) => { this._handleData$(chunk); });
        let error$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'error', (err) => { this.error(err); });
        let close$ = FromEventObservable_1.FromEventObservable.call(this.socket, 'close', (had_error) => { this.complete(); });
        return merge_1.merge.call(data$, close$, drain$, end$, error$, timeout$).subscribe();
    }
    _updateStatus(status) {
    }
    _handleData$(chunk) {
    }
    imcoming(data) {
    }
    next(data) {
    }
    error(err) {
    }
    complete() {
        for (let sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }
}
exports.Socket = Socket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsK0NBQTRDO0FBRzVDLDBEQUF1RDtBQUV2RCw2RUFBMEU7QUFPMUUsNkNBQTBDO0FBc0MxQyxZQUFvQixTQUFRLGlDQUF5QjtJQUlwRCxZQUNRLFFBQWdCLEVBQ2YsTUFBb0IsRUFDcEIsR0FBeUIsRUFDekIsTUFBa0IsRUFDbEIsSUFBZ0I7UUFFeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBTkwsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNmLFdBQU0sR0FBTixNQUFNLENBQWM7UUFDcEIsUUFBRyxHQUFILEdBQUcsQ0FBc0I7UUFDekIsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUNsQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBR3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUN0QixJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQ2pCLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDM0IsSUFBSSxDQUFDLEdBQUcsRUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUMxQixFQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMxQixDQUFDLENBQUMsQ0FDRixDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVNLHdCQUF3QjtRQUMvQixJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sR0FBRyx5Q0FBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQ3JELFFBQU8sQ0FBQyxDQUNQLENBQUM7WUFDSCxJQUFJLEdBQUcseUNBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUNqRCxRQUFPLENBQUMsQ0FDUCxDQUFDO1lBQ0gsUUFBUSxHQUFHLHlDQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFDekQsUUFBTyxDQUFDLENBQ1AsQ0FBQztRQUNILENBQUM7UUFBQSxDQUFDO1FBQ0gsSUFBSSxLQUFLLEdBQUcseUNBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTTtRQUNyRCxrRkFBa0Y7UUFDcEYsQ0FBQyxLQUFzQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQ3ZELENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBRyx5Q0FBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQ3pELENBQUMsR0FBVSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQ2xDLENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBRyx5Q0FBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQ3pELENBQUMsU0FBbUIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQzNDLENBQUM7UUFDSCxNQUFNLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdFLENBQUM7SUFFTSxhQUFhLENBQUMsTUFBc0I7SUFFM0MsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFpQjtJQUVyQyxDQUFDO0lBRUssUUFBUSxDQUFDLElBQWM7SUFFN0IsQ0FBQztJQUVLLElBQUksQ0FBQyxJQUFjO0lBRXpCLENBQUM7SUFFSyxLQUFLLENBQUMsR0FBVTtJQUV0QixDQUFDO0lBRUssUUFBUTtRQUNkLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0QsQ0FBQztDQUVGO0FBL0VELHdCQStFQyJ9