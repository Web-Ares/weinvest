
( function(){
    'use strict';

    $( function () {

        $( '.search-autocomplite' ).each( function () {
            new FilterAutocomplete( $( this ) );
        } );

    } );

    var FilterAutocomplete = function( obj ){

        //private properties
        var _self = this,
            _obj = obj,
            _input = _obj.find( 'input' ),
            _inputWrap = _obj,
            _window = $( window ),
            _body = $( 'body' ),
            _dropDownWrap = $('.listing__filter-categories'),
            _resultList = $( '.listing__filter-results' ),
            _list,
            _listItems;

        //private methods
        var _constructor = function(){
                _obj[ 0 ].obj = _self;
                _createList();
                _onEvents();
            },
            _checkListPosition = function() {
                var offset = _inputWrap.offset();

                _list.css( {
                    top: offset.top - _window.scrollTop() + _inputWrap.height() - 2,
                    left: offset.left
                } );
            },
            _createList = function(){

                _list = _obj.find( '.search-autocomplite__list' ).clone();

                _list.addClass( 'search-autocomplite__list_hidden' );

                _listItems = _list.find( 'li' );

                _body.append( _list );

                _list.perfectScrollbar();

            },
            _filterItems = function() {
                var currentListItem;

                _listItems.removeClass( 'filtered' );

                _listItems.each( function() {

                    currentListItem = $( this );

                    if( currentListItem.text().toLowerCase().indexOf( _input.val().toLowerCase() ) == -1 ){
                        currentListItem.addClass( 'filtered' )
                    }

                } );
            },
            _hideList = function () {
                _obj.removeClass('active');
                _listItems.removeClass( 'hover' );
                _list.addClass( 'search-autocomplite__list_hidden' );
            },
            _hover = function( item ){
                _listItems.removeClass( 'hover' );

                item.addClass( 'hover' );

                if( item.position().top >= _list.height() ){
                    _list.scrollTop(  item.position().top + _list.scrollTop() - ( item.outerHeight() * 3 ) );
                } else if ( item.position().top < 0 ){
                    _list.scrollTop(  item.position().top + _list.scrollTop() );

                }
            },
            _hoverNext = function() {
                var items,
                    currentItem,
                    index;

                items = _listItems.filter( ':not(.hidden)' );
                items = items.filter( ':not(.filtered)' );
                currentItem = items.filter( '.hover' );
                index = items.index( currentItem );
                index = (index < 0)?0:index;


                if( currentItem.length ){

                    if( index + 1 === items.length ){
                        _hover( items.eq( 0 ) );
                    } else {
                        _hover( items.eq( index + 1 ) );
                    }

                } else {
                    _hover( items.eq( 0 ) );
                }

            },
            _hoverPrev = function() {
                var items,
                    currentItem,
                    index;

                items = _listItems.filter( ':not(.hidden)' );
                items = items.filter( ':not(.filtered)' );
                currentItem = items.filter( '.hover' );
                index = items.index( currentItem );

                if( currentItem.length ){
                    _hover( items.eq( index - 1 ) );

                } else {
                    _hover( items.eq( -1 ) );
                }
            },
            _onEvents = function(){

                _input.on( {
                    focus: function() {
                        _showList();
                    },
                    click: function( e ) {
                        e.stopPropagation();
                        _showList();
                    },
                    keyup: function(e) {
                        _showList();

                        if( e.keyCode == 27 ){
                            _hideList();
                        } else if( e.keyCode == 40 ){
                            _hoverNext();
                        } else if( e.keyCode == 38 ){
                            _hoverPrev();
                        } else if ( e.keyCode == 13 ){
                            _selectItem();

                        } else {
                            _filterItems();
                        }
                    },
                    blur: function() {

                    }
                } );
                _listItems.on(  {
                    mousedown: function() {
                        _selectItem();
                    },
                    mouseenter: function() {
                        _hover( $( this ) );
                    }
                } );
                _resultList.on( 'click','> span[data-type = location]',  function() {

                    console.log('_unselectItem');
                    _unselectItem( [ $( this ).text() ] );
                } );
                _window.on( {
                    scroll: function() {

                        _hideList();
                    },
                    resize: function() {

                        _hideList();
                    }
                } );
                _list.on( {
                    click: function(event) {

                        event = event || window.event;

                        if ( event.stopPropagation ) {
                            event.stopPropagation();
                        } else {
                            event.cancelBubble = true;
                        }
                    }
                } );
                _body.on( {
                    click: function() {
                        _hideList();
                    }
                } );

            },
            _selectItem = function() {

                var _hoveredItem = _listItems.filter( '.hover' );

                _hoveredItem.addClass( 'hidden' );

                _resultList.append( '<span data-type="location"><i class="fa fa-times" aria-hidden="true"></i>'+ _elemText( _hoveredItem ) +'</span>' );
            },
            _unselectItem = function( texts ) {

                var curItem;

                _resultList.find( '> span' ).each( function() {

                    curItem = $( this );

                    $.each( texts, function() {

                        if( curItem.text() == this ){
                            curItem.remove();
                        }

                    } );

                } );
                _listItems.each( function() {

                    curItem = $( this );

                    $.each( texts, function () {

                        if( _elemText( curItem ) == this ){

                            curItem.removeClass( 'hidden' );

                        }

                    } );
                } );

            },
            _elemText = function (elem) {

                var cloned = elem.clone();

                    cloned.find('*').remove();

                return ( cloned.text().trim() )

            },
            _showList = function(){
                _dropDownWrap.removeClass('active');
                _obj.addClass('active');
                _checkListPosition();
                _list.removeClass( 'search-autocomplite__list_hidden' );

            };


        //public properties

        //public methods
        _self.refresh = function( items ) {

            var currentItem,
                currentText;

            _listItems.removeClass( 'hidden' );
            _resultList.html( '' );

            _listItems.each( function () {

                currentItem = $( this );
                currentText = _elemText( currentItem );

                $.each( items, function () {

                    if( currentText == this ){
                        currentItem.addClass( 'hidden' );
                    }

                } );

            } );

        };

        _self.hidePopup = function(  ) {

            _listItems.removeClass( 'hover' );
            _list.addClass( 'search-autocomplite__list_hidden' );

        };

        _constructor();
    };

} )();
