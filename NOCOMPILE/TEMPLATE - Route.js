"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otherRoute_1 = require("./otherRoute");
const GET = 'GET';
const POST = 'POST';
const DELETE = 'DELETE';
function login(observer) { }
function logout(observer) { }
function getUser(observer) { }
function deleteUser(observer) { }
function postFooBarNoFixedParam(observer) { }
const index = [
    'users',
    ['login', GET, login],
    ['logout', logout],
    [':id', GET, getUser],
    [':id', DELETE, deleteUser],
    [POST,
        [':foo/:bar/fixedParam', otherRoute_1.otherRoute],
        [':foo/:bar', postFooBarNoFixedParam]
    ]
];
exports.default = index;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVEVNUExBVEUgLSBSb3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRFTVBMQVRFIC0gUm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw2Q0FBMEM7QUFJMUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNwQixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFFeEIsZUFBZSxRQUE0QixJQUFHLENBQUM7QUFFL0MsZ0JBQWdCLFFBQTRCLElBQUcsQ0FBQztBQUVoRCxpQkFBaUIsUUFBNEIsSUFBRyxDQUFDO0FBRWpELG9CQUFvQixRQUE0QixJQUFHLENBQUM7QUFFcEQsZ0NBQWdDLFFBQTRCLElBQUcsQ0FBQztBQUVoRSxNQUFNLEtBQUssR0FBRztJQUNiLE9BQU87SUFDTixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDO0lBQ3JCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztJQUNsQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDO0lBQ3JCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDM0IsQ0FBQyxJQUFJO1FBQ0osQ0FBQyxzQkFBc0IsRUFBRSx1QkFBVSxDQUFDO1FBQ3BDLENBQUMsV0FBVyxFQUFFLHNCQUFzQixDQUFDO0tBQ3ZDO0NBQUMsQ0FBQztBQUVILGtCQUFlLEtBQUssQ0FBQyJ9