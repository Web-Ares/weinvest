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
            _autocomplete = $('.search-autocomplite'),
            _filterBtn = _obj.find('.listing__filter-categories-btn'),
            _dropDownWrap = _obj.find('.listing__filter-categories'),
            _body = $('body');

        //private methods
        var _onEvents = function() {

                _filterBtn.on( {
                    click: function() {

                        _dropDown( $(this) );
                        _autocomplete[0].obj.hidePopup();

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
            _autocomplete = $( '.search-autocomplite' ),
            _body = $('body'),
            _typeInputs = $('.category-item'),
            _closeOpenBtn = _obj.find('.btn-filter'),
            _budgetWrapper = _obj.find('.listing__filter-budget'),
            _priceItem = _obj.find('.listing__filter-budget-list > li'),
            _budgetPriceListMin = _budgetWrapper.find('.listing__filter-budget-list_min'),
            _budgetPriceListMax = _budgetWrapper.find('.listing__filter-budget-list_max'),
            _priceFields = _budgetWrapper.find('input'),
            _roomsSelect = _obj.find('.listing__filter-rooms select'),
            _filter = _obj.find('.listing__filter'),
            _resultList = _obj.find('.listing__filter-results'),
            _catalog = _obj.find('.listing__catalog'),
            _catalogList = _obj.find('.listing__catalog-list'),
            _catalogGalleries = $( '.listing__catalog-item-pics > .swiper-container' ),
            _canSendRequest = true,
            _request = new XMLHttpRequest(),
            _curUrlPart;

        //private methods
        var _constructor = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
                // _addSwiper();
                _getMinMaxRoom();
                _loadData();
                _checkUrl()
            },
            _addLabel = function ( type, text, value ) {

                var resultItems = _resultList.find(' > span '),
                    resultTypeItem = resultItems.filter( '[data-type='+type+']' ),
                    nod = document.createTextNode(String.fromCharCode(8364)),
                    txt = nod.textContent;

                if (resultTypeItem.length) {

                    resultTypeItem.remove();

                }

                if ( text == null ) {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i>'+value+'</span>' );

                } else if ( type == 'price-min' || type == 'price-max' ) {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i> '+text +' '+value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') + ' '+txt+'</span>' );

                } else {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i> '+text +' '+value+'</span>' );

                }

            },
            _addSwiper = function () {

                console.log(_catalogGalleries.length);

                $('.listing__catalog-gallery').each(function () {

                    var curSwiper = $( this );

                    new Swiper( curSwiper, {
                        nextButton: curSwiper.find('.swiper-button-next'),
                        prevButton: curSwiper.find('.swiper-button-prev'),
                        loop: true
                    });

                })

            },
            _checkUrl= function() {

                var url = document.location.href.split('/'),
                    urlArr = [];

                for ( var i = 0; i < url.length; i++ ) {

                    urlArr.push( url[ i ] )

                }

                _curUrlPart = urlArr[ urlArr.length-1 ];

            },
            _createCard = function( curItem ) {

                var curPrice = curItem.Price,
                    curName = curItem.Name,
                    curAddress = curItem.Address1,
                    curSubCategory = curItem.SubCategory,
                    curArea = curItem.Area,
                    curBath = curItem.BathRooms,
                    curPictures = curItem.Pictures,
                    curRooms = curItem.Rooms,
                    item = $('<a href="#" class="listing__catalog-item"></a>'),
                    itemPic = $('<div class="listing__catalog-item-pics"></div>'),
                    itemNameWrap = $('<div class="listing__catalog-item-name"></div>'),
                    itemName = $('<div class="listing__catalog-name">'+curName+'</div>'),
                    itemPrice = $('<div class="listing__catalog-price">'+curPrice+'</div>'),
                    itemWrap = $('<div class="listing__catalog-item-wrap"></div>'),
                    itemWrapTop = $('<div><strong>'+curSubCategory+'</strong><address>'+curAddress+'</address></div>'),
                    itemWrapList = $('<ul></ul>'),
                    swiper = $('<div class="listing__catalog-gallery swiper-container"></div>'),
                    swiperWrap = $('<div class="swiper-wrapper"></div>'),
                    swiperBtnNext = $('<div class="swiper-button-next"></div>'),
                    swiperBtnprev = $('<div class="swiper-button-prev"></div>');

                console.log( curPictures.length );

                if ( curPictures.length ) {

                    for( var i = 0; curPictures.length > i; i++ ){

                        var curPicture = curPictures[i].UrlLarge;
                        swiperWrap.append('<div class="swiper-slide" style="background-image: url('+curPicture+')"></div>')
                    }

                    swiper.append(swiperBtnNext);
                    swiper.append(swiperBtnprev);

                }

                if ( curRooms !== null && curRooms !== 0 ) {

                    itemWrapList.append('<li>'+curRooms+' chambres</li>')

                }

                if ( curBath !== null && curBath !== 0 ) {

                    itemWrapList.append('<li>'+curBath+' salles de bain</li>')

                }

                if ( curArea !== null ) {

                    itemWrapList.append('<li>'+curArea+' m2</li>')

                }

                item.append(itemPic);
                item.append(itemWrap);
                itemPic.append(itemNameWrap);
                itemPic.append(swiper);
                swiper.append(swiperWrap);
                itemNameWrap.append(itemName);
                itemNameWrap.append(itemPrice);
                itemWrap.append(itemWrapTop);
                itemWrap.append(itemWrapList);

                return item;
            },
            _createCardsList = function( data ) {
                var card;

                _catalogList.html( '' );

                $.each( data.d.EstateList, function() {

                    card = _createCard( this );
                    _catalogList.append( card );

                });

                setTimeout(function () {

                    _addSwiper();

                }, 100);

                _catalog.removeClass( 'loading' );

            },
            _getCategoryArray = function() {

                var typeArr = [];

                _typeInputs.each(function (){

                    var curInput = $( this );

                    if ( curInput.prop( 'checked' ) ) {

                        typeArr.push( curInput.data( 'category' ) );

                    }

                } );

                return typeArr;
            },
            _getFilterString = function() {

                var data = null;

                data = {
                    ClientId: "095007a7cd2c41238ad9",
                    PurposeIDList:[ 1 ],
                    StatusIDList:[1],
                    RowsPerPage:20,
                    Page: 0,
                    Language:'fr-BE',
                    ShowDetails:0,
                    ZipList:[],
                    PriceRange:[10000,900000000000]
                };

                return JSON.stringify( data );

            },
            _getMinRoom = function( rooms ) {
                var minRoom;

                if( rooms.length ){
                    minRoom = rooms[0];
                } else {
                    minRoom = 1;
                }

                return minRoom;
            },
            _getMaxRoom = function( rooms ) {
                var maxRoom;

                if( rooms.length === 1 ){
                    maxRoom = rooms[ 0 ];
                } else if( rooms.length > 1 ){
                    maxRoom = rooms[ rooms.length - 1 ];
                }

                if ( maxRoom === 3 || !rooms.length ) {
                    maxRoom = null;
                }

                return maxRoom;
            },
            _getMinMaxRoom = function( curSelect ) {
                var rooms = [];

                if (curSelect !== undefined) {

                    var selectedOption = curSelect.find( 'option' ).filter( ':selected' );

                    _addLabel( curSelect.attr('name'), null, selectedOption.text() );

                }

                _roomsSelect.each(function () {

                    var curSelect = $( this ),
                        selectedOption = curSelect.find( 'option' ).filter( ':selected' );

                    rooms.push( selectedOption.attr( 'value' ) );

                } );

                return [ _getMinRoom( rooms ), _getMaxRoom( rooms ) ];
            },
            _onEvents = function() {

                _typeInputs.on( {
                    change: function() {

                        var curInput = $( this ),
                            curData = curInput.data('category'),
                            curText = curInput.next().text();

                        _addLabel(curData, null, curText);

                    }
                });
                _priceFields.on( {
                    focus: function() {

                        _setPriceList( $( this ) )

                    }
                });
                _priceItem.on( {
                    click: function() {

                        var curItem = $( this );

                        if ( curItem.hasClass('disabled') || curItem.hasClass('active') ) {

                            return false

                        } else {

                            _setPrice( curItem )

                        }

                    }
                });
                _closeOpenBtn.on( {
                    click: function(e) {

                        var curElem = $(this),
                            curWrap = curElem.find( '> span' );

                        if (_filter.hasClass( 'active' )) {

                            _filter.removeClass( 'active' );
                            curElem.removeClass( 'active' );

                        } else {

                            _filter.addClass( 'active' );
                            curElem.addClass( 'active' );

                        }
                        e.stopPropagation();

                    }
                });
                _body.on( {
                    click: function() {

                        if ( _filter.hasClass( 'active' ) ) {

                            _filter.removeClass( 'active' )
                        }

                        if ( _priceFields.hasClass( 'active' ) ) {

                            _priceFields.removeClass('active');
                        }

                        if ( _closeOpenBtn.hasClass( 'active' ) ) {

                            _closeOpenBtn.removeClass( 'active' );
                        }

                        if ( _budgetPriceListMax.is( ':visible' ) ) {

                            _budgetPriceListMin.show();
                            _budgetPriceListMax.hide();

                        }
                    }
                });
                _resultList.on( 'click',' > span',  function() {

                    _removeLabel( $( this ) )

                } );
                _roomsSelect.on( {
                    change: function() {

                        _getMinMaxRoom( $(this) );

                    }
                });

            },
            _setPrice = function ( item ) {

                var curItem = item,
                    curParent = curItem.parents( '.listing__filter-budget-list' ),
                    curText = curItem.text().replace(/[^-0-9]/gim,'');

                curItem.prevAll().removeClass( 'active' );
                curItem.nextAll().removeClass( 'active' );
                curItem.addClass( 'active' );

                if ( curParent.hasClass('listing__filter-budget-list_min') ) {

                    _priceFields.filter('[name = price-min]').val( curText.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') );

                    _budgetPriceListMax.find('li').each( function() {

                        var curElem = $( this );

                        if ( curElem.text().replace(/[^-0-9]/gim,'') < curText ) {

                            curElem.addClass('disabled')

                        } else {

                            curElem.removeClass('disabled')
                        }

                    });

                    _addLabel( 'price-min', 'Min', curText);

                } else if ( curParent.hasClass('listing__filter-budget-list_max') ) {

                    _priceFields.filter('[name = price-max]').val( curText.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') );

                    _budgetPriceListMin.find('li').each( function() {

                        var curElem = $( this );

                        if ( curElem.text().replace(/[^-0-9]/gim,'') > curText ) {

                            curElem.addClass('disabled')

                        } else {

                            curElem.removeClass('disabled')
                        }

                    });

                    _addLabel( 'price-max', 'Max', curText);
                }

            },
            _setPriceList = function ( elem ) {

                var curField = elem,
                    curName = curField.attr( 'name' );

                _priceFields.removeClass('active');
                curField.addClass('active');

                if ( curName == 'price-min' ) {

                    _budgetPriceListMax.hide();
                    _budgetPriceListMin.show();

                } else if ( curName == 'price-max' ) {

                    _budgetPriceListMin.hide();
                    _budgetPriceListMax.show()

                }

            },
            _sendRequest = function( requestData, newPage ) {

                if( _canSendRequest ){

                    _catalog.addClass('loading');

                    _request.abort();

                    _request = $.ajax({
                        url: _filter.attr( 'action' ),
                        data: 'EstateServiceGetEstateListRequest=' + requestData,
                        dataType: 'json',
                        timeout: 20000,
                        type: 'GET',
                        success: function ( data ) {

                            console.log(data);
                            _createCardsList( data );

                        },
                        error: function (XMLHttpRequest) {
                            if (XMLHttpRequest.statusText != "abort") {
                                console.log('err');
                            }
                        }
                    });
                }

            },
            _loadData = function(){

                var data = _getFilterString( 0 );

                _sendRequest( data, false );

            },
            _uncheckRooms = function ( type, flag ) {

                var curSelect = _roomsSelect.filter( '[name = '+type+']' ),
                    curOptions = curSelect.find( 'option' ),
                    curParent = curSelect.parents('.websters-select'),
                    curPopupItems = curParent.find('websters-select__popup li'),
                    curTextWrap = curParent.find('.websters-select__item');

                curOptions.removeAttr( 'selected' );
                curPopupItems.removeClass( 'active' );
                curTextWrap.text('');

                if ( flag ) {

                    curOptions.eq(0).attr('selected', 'selected');
                    curPopupItems.eq(0).addClass('active');
                    curTextWrap.text( curOptions.eq(0).text() );

                } else {

                    curOptions.eq( curOptions.length - 1 ).attr('selected', 'selected');
                    curPopupItems.eq( curOptions.length - 1 ).addClass('active');
                    curTextWrap.text( curOptions.eq(curOptions.length - 1).text() );

                }

            },
            _removeLabel = function ( curItem ) {

                var curType = curItem.data('type');

                if ( curType == 'price-min' ) {

                    _budgetPriceListMin.find( 'li' ).removeClass( 'active' );
                    _budgetPriceListMax.find( 'li' ).removeClass( 'disabled' );
                    _priceFields.filter( '[name = price-min]').val( '' );

                } else if ( curType == 'price-max' ) {

                    _budgetPriceListMax.find( 'li' ).removeClass( 'active' );
                    _budgetPriceListMin.find( 'li' ).removeClass( 'disabled' );
                    _priceFields.filter( '[name = price-max]').val( '' );

                } else if ( curType == 'min-rooms' ) {

                    _uncheckRooms( curType, true );

                } else if ( curType == 'max-rooms' ) {

                    _uncheckRooms( curType, false );

                } else if ( curType !== 'location' ) {

                    _typeInputs.filter('[data-category = '+curType+']')[0].checked = false

                }

                curItem.remove();

            };

        _constructor();
    };

} )();
