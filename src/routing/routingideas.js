/*

input could be
- ./this/is/an/input
    = ./this/is/an/input
    = ./this/[ undefined, 'is' ]/an/input
- ./this/:is/an/input
    = ./this/[ is, * ]/an/input
- ./this/is=anyValue/an/input
    - ./this/[ is, 'anyValue' ]/an/input

route could be
    - ./this/is/a/route
    - ./this/[ is, * ]/a/star/param
    - ./this/[ is, 'anyValue' ]/a/value/param


./this/is/an/input				./this/is/a/route
                                        ./this/[  is, undefined  ]/a/star/param
                                        ./this/[  anyParam, 'is' ]/a/value/param
./this/:is/an/input				./this/[  is, undefined  ]/a/star/param
./this/is=anyValue/an/input	./this/[  is, 'anyValue' ]/a/parameter


./this/is/an/input		./this/is/a/route
./this/is/an/:input		./this/is/a/[ param, undefined ]
./this/is/an/input=value./this/is/a/[ param, value ]


./this/is/an/input		./this/is/a/[ *Param, undefined ]


./this/is/an/input		./this/is/a/[ valueParam, input ]


*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZ2lkZWFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGluZ2lkZWFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DRSJ9