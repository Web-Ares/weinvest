
( function() {
    'use strict';

    $( function () {

        $( '.listing__map' ).each( function () {
            new FilterMap( $( this ) );
        } );

    } );

    var FilterMap = function( obj ){
    
        //private properties
        var _self = this,
            _obj = obj,
            _map;


        //private methods
        var _init = function(){
                _obj[ 0 ].obj = _self;
                _onEvents();
                google.maps.event.addDomListener(window, 'load', _initMap);
            },
            _initMap = function () {
                _map = new google.maps.Map( _obj[ 0 ], {
                    scrollwheel: false,
                    draggable: !("ontouchend" in document),
                    zoom: 10,
                    center: { "lat": 50.841220, "lng": 4.355132 }
                });

            },
            _onEvents = function(){



            };

        //public properties
    
        //public methods
        _init();
    };
    
} )();
