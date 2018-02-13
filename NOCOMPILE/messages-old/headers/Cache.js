"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    static setNo(req) {
        if (req.httpVersion === '1.1') {
            req.headers.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        else if (req.httpVersion === '1.0') {
            req.headers.setHeader('Pragma', 'no-cache');
        }
        else {
            req.headers.setHeader('Expires', '0');
        }
        return req;
    }
    ;
    static set(req) {
        let type = req.config.cache.type + ', max-age=' + req.config.cache.maxAge;
        req.headers.setHeader('Cache-Control', type);
        return req;
    }
    ;
}
exports.Cache = Cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BO0lBRUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFjO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUscUNBQXFDLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0QyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBRVosQ0FBQztJQUFBLENBQUM7SUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQWM7UUFFeEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFlBQVksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFMUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDWixDQUFDO0lBQUEsQ0FBQztDQUNGO0FBeEJELHNCQXdCQyJ9