"use strict";
( function() {

    $( function() {

        $.each( $( '.listing' ), function() {

            new FilterListing ( $( this ) );
            new FilterDropdown ( $( this ) );

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
            _site = $('.site'),
            _scroll = null;

        //private methods
        var _onEvents = function() {

                _window.on( {
                    resize: function() {

                        _setHeight();
                        _setMapPosition();

                    }
                })

            },
            _setHeight = function () {

                if ( _window.width() > 1200 ) {

                    _site.scrollTop(0);

                    var windowHeight = _window.height(),
                        headerHeight = _header.height(),
                        filterHeight = _filter.outerHeight( true ),
                        sortHeight = _sort.outerHeight( true ),
                        marginItem = parseFloat(_listItem.css('margin-bottom'));

                    _obj.css({
                        height: windowHeight - ( headerHeight + filterHeight + sortHeight + marginItem )
                    });

                    _addScroll()

                } else {

                    console.log('_window <= 1200');

                    _obj.css({
                        height: 'auto'
                    });

                    if (_scroll !== null) {

                        _scroll.perfectScrollbar('destroy');
                        _scroll = null

                    }
                }

            },
            _setMapPosition = function () {

                if ( _window.width() >= 1200 ) {

                    var filterHeight = _filter.outerHeight( true ),
                        sortHeight = _sort.outerHeight( true );

                    _map.css({
                        top: filterHeight + sortHeight
                    });

                } else {

                    _map.css({
                        top: 0
                    });

                }

            },
            _addScroll = function () {

                if ( _scroll == null ) {

                    _scroll = _obj.perfectScrollbar();

                } else {

                    _scroll.perfectScrollbar('update');

                }
            },
            _init = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
                _setHeight();
                _setMapPosition();
            };

        _init();
    };
    var FilterDropdown = function( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _filterBtn = _obj.find('.listing__filter-categories-btn'),
            _dropDownWrap = _obj.find('.listing__filter-categories'),
            _body = $('body');

        //private methods
        var _onEvents = function() {

                _filterBtn.on( {
                    click: function() {

                        _dropDown( $(this) );

                    }
                });

                _dropDownWrap.on( {
                    click: function( e ) {

                        e.stopPropagation();

                    }
                });

                _body.on( {
                    click: function() {

                        _dropDownWrap.removeClass( 'active' )

                    }
                })

            },
            _dropDown = function (elem) {

                var curItem = elem,
                    curParent = curItem.parents('.listing__filter-categories');

                curParent.nextAll().removeClass('active');
                curParent.prevAll().removeClass('active');

                if ( !curParent.hasClass('active') ) {

                    curParent.addClass('active')

                }else{

                    curParent.removeClass('active')

                }

            },
            _init = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
            };

        _init();
    };
    var FilterListing = function( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _body = $('body'),
            _closeOpenBtn = _obj.find('.btn-filter'),
            _filter = _obj.find('.listing__filter'),
            _catalogGalleries = $( '.listing__catalog-item-pics > .swiper-container' );

        //private methods
        var _onEvents = function() {

                _closeOpenBtn.on( {
                    click: function(e) {

                        _filter.toggleClass( 'active' );
                        e.stopPropagation();

                    }
                });

                _filter.on( {
                    click: function(e) {

                        e.stopPropagation();

                    }
                });

                _body.on( {
                    click: function() {

                        _filter.removeClass( 'active' )

                    }
                })

            },
            _addSwiper = function () {

                _catalogGalleries.each(function () {

                    var curSwiper = $( this );

                    new Swiper( curSwiper, {
                        nextButton: curSwiper.find('.swiper-button-next'),
                        prevButton: curSwiper.find('.swiper-button-prev'),
                        loop: true
                    });

                })

            },
            _init = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
                _addSwiper();
            };

        _init();
    };

} )();
