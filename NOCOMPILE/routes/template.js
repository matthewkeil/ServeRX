"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("../../src/routing/Route");
const Rx = require("rxjs");
let getByID = Rx.Observable.from(['booga', 'boo']);
let insertUser = {
    observable: Rx.Observable.from(['diggity', 'dangnabbit'])
};
let etc = 'use your imagination';
module.exports = Route_1.default('users')
    .get(new Rx.Observable(observer => {
    observer.next('all users');
}))
    .nest(Route_1.default(':id')
    .get('auth', getByID)
    .post(insertUser), Route_1.default(':jiggityJam')
    .get(etc)
    .delete(etc)
    .options(etc));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUE0QztBQUU1QywyQkFBMkI7QUFJM0IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUduRCxJQUFJLFVBQVUsR0FBRztJQUNoQixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Q0FDekQsQ0FBQztBQUVGLElBQUksR0FBRyxHQUFHLHNCQUFzQixDQUFDO0FBSWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQztLQUM3QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFNLFFBQVE7SUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1QixDQUFDLENBQUMsQ0FBQztLQUNGLElBQUksQ0FDSixlQUFLLENBQUMsS0FBSyxDQUFDO0tBQ1YsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7S0FDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUNsQixlQUFLLENBQUMsYUFBYSxDQUFDO0tBQ2xCLEdBQUcsQ0FBQyxHQUFHLENBQUM7S0FDUixNQUFNLENBQUMsR0FBRyxDQUFDO0tBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNkLENBQUEifQ==