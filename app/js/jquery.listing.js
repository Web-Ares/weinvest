"use strict";
( function() {

    $( function() {

        $.each( $( '.listing' ), function() {

            new FilterListing ( $( this ) );

        } );

        $.each( $( '.listing__catalog-list' ), function() {

            new HeightBlock ( $( this ) );

        } );

    });

    var HeightBlock = function( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _header = $( '.site__header' ),
            _filter = $( '.listing__filter' ),
            _sort = $( '.listing__catalog-sort' ),
            _listItem = $('.listing__catalog-item'),
            _map = $('.listing__map'),
            _window = $( window ),
            _scroll = null;

        //private methods
        var _onEvents = function() {


            },
            _setHeight = function () {

                var windowHeight = _window.height(),
                    headerHeight = _header.height(),
                    filterHeight = _filter.outerHeight( true ),
                    sortHeight = _sort.outerHeight( true ),
                    marginItem = parseFloat(_listItem.css('margin-bottom'));

                console.log(headerHeight, filterHeight, sortHeight, marginItem);

                _obj.css({
                    height: windowHeight - ( headerHeight + filterHeight + sortHeight + marginItem )
                });

                _addScroll()
            },
            _setMapPosition = function () {

                var filterHeight = _filter.outerHeight( true ),
                    sortHeight = _sort.outerHeight( true );

                _map.css({
                    top: filterHeight + sortHeight
                });

            },
            _addScroll = function () {

                _scroll = _obj.perfectScrollbar();

            },
            _init = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
                _setHeight();
                _setMapPosition();
            };

        _init();
    };

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
