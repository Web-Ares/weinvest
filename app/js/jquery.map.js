
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
                    // scrollwheel: false,
                    draggable: !("ontouchend" in document),
                    zoom: 10,
                    center: { "lat": 50.841220, "lng": 4.355132 },
                    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cfd8da"},{"visibility":"on"}]}]
                });

            },
            _onEvents = function(){



            };

        //public properties
    
        //public methods
        _init();
    };
    
} )();
