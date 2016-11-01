"use strict";
( function() {

    $( function() {

        $.each( $( '.listing' ), function() {

            new FilterListing ( $( this ) );

        } );

    });

    var FilterListing = function( obj ) {

        //private properties
        var _self = this,
            _menu = obj,
            _catalogGalleries = $( '.listing__catalog-item-pics > .swiper-container' );

        //private methods
        var _onEvents = function() {


            },
            _addSwiper = function () {

                _catalogGalleries.each(function () {

                    console.log( '_addSwiper' );

                    var curSwiper = $( this );

                    new Swiper( curSwiper, {
                        nextButton: curSwiper.find('.swiper-button-next'),
                        prevButton: curSwiper.find('.swiper-button-prev'),
                        loop: true
                    });

                })

            },
            _init = function() {
                _menu[ 0 ].obj = _self;
                _onEvents();
                _addSwiper();
            };

        _init();
    };

} )();
