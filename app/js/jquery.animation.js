
( function() {
    "use strict";

    $( function() {

        $.each( $( '.slides' ), function() {
            new Slides ( $( this ) );
        } );

    });

    var Slides = function ( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _window = $( window );

        //private methods
        var _onEvents = function () {
                _window.on({
                    scroll: function () {

                        _checkScroll();

                    }
                });
            },
            _checkScroll = function(){

                var windowH = _window.height();

                _obj.each(function () {

                    var curItem = $(this),
                        topPos = _obj.offset().top;

                    if( _window.scrollTop() > (topPos - windowH/1.8) && !curItem.hasClass( 'animation' ) ){

                        if (curItem.parent( '.method__list' ).length) {

                            _listAnimations( curItem );


                        } else {

                            curItem.addClass( 'animation' );

                        }
                    }
                })
            },
            _listAnimations = function ( elem ) {

                var curElem = elem;

                console.log(curElem);

                if (!curElem.hasClass( 'active' )) {

                    curElem.prev().removeClass( 'active' );
                    curElem.prev().addClass( 'prev' );
                    curElem.next().removeClass( 'active' );
                    curElem.next().removeClass( 'prev' );
                    curElem.removeClass( 'prev' );
                    curElem.addClass( 'active' );

                }

            },
            _init = function () {
                _obj[0].slides = _self;
                _onEvents();
                _checkScroll();
            };

        //public properties

        //public methods

        _init();
    };

} )();




