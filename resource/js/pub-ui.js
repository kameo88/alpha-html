
$(function(){
    environment();
    pubUi.init();

    // 팝업 : onclick 및 별도 function 에 사용
    // popUp.open(pop, btn);
    // popUp.close(pop, btn);

    // cardSwiper
    if( $(document).find(".cardSwiper").length ) cardSwiper();
});



var environment = function(){
    var _user = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPop|BlackBerry|IEmobile|Opera Mini/i.test(_user)) {
        $('html').addClass('mobile');
        if(/iPhone|iPad|iPop/i.test(_user)) $('html').addClass('ios');
        if(/Android/i.test(_user)) $('html').addClass('android');
    } else {
        $('html').addClass('pc');
    }

    if(/MSIE/i.test(_user) && /Trident/i.test(_user)) {
        var _ieV = document.documentMode; // IE 브라우저 버전
        $('html').addClass('ie' + _ieV);
    } else if(! /MSIE/i.test(_user) && /Trident/i.test(_user)) {
        $('html').addClass('ie11');
    } else if(/Edg/i.test(_user)) {
        $('html').addClass('edg');
    } else if(/OPR/i.test(_user) || /Opera/i.test(_user)) {
        $('html').addClass('opera');
    } else if(/Chrome/i.test(_user)) {
        $('html').addClass('chrome');
    } else if(/Safari/i.test(_user)) {
        $('html').addClass('safari');
    } else if(/Firefox/i.test(_user)) {
        $('html').addClass('firefox');
    }
}



// pubUi
var pubUi = {
    init : function(){
        var _scroll = $(document).scrollTop();
        
        if(10 < _scroll){
            $('body').addClass('scroll');
        } else {
            $('body').removeClass('scroll');
        }

        $(document).on('scroll', function(){
            var _scroll = $(document).scrollTop();

            if(10 < _scroll){
                $('body').addClass('scroll');
            } else {
                $('body').removeClass('scroll');
            }
        });

        pubUi.getFullH();
        $(window).on("resize", pubUi.getFullH);

        pubUi.select();
        pubUi.sortLayer();
        pubUi.tooltip();
        pubUi.float();
        pubUi.asideNav();
        pubUi.gnb();
        pubUi.form.init();

        tagList.init();
        tabList.init();
        acdItem.init();
        scrollFixed.init();
        
    },
    getFullH: function(){
        const fullH = $(document).find(".fullH");
        if( fullH.length < 1 ) return;
        if( !$("html").hasClass("pc") ) return;

        const docH = $(window).height();
        $(document).find(".fullH").css({"min-height": `${docH}px`});
    },
    select : function(){
        $(document).on('click', '.select_list button, .select_list02 button', function(){
            $(this).attr('aria-selected', true);
            $(this).parent('li').addClass('on');
            $(this).parent('li').siblings().find('button').attr('aria-selected', false);
            $(this).parent('li').siblings().removeClass('on');
        });
    }, // select
    sortLayer : function(){
        $(document).on('click', '.sort_wrap .sort_btn', function(){
            if($('.sort_layer.open').length){
                sortClose();
            } else {
                sortOpen();
            }
        });

        $(document).on('click', '.sort_wrap .sort_layer [data-action=close]', function(){
            sortClose();
        });

        $(document).on('click', '.sort_group button', function(){
            $(this).attr('aria-selected', true);
            $(this).parent('li').addClass('on');
            $(this).parent('li').siblings().find('button').attr('aria-selected', false);
            $(this).parent('li').siblings().removeClass('on');

            if($(this).parents('.sort_layer').length){
                $('.sort_btn').text($(this).text());
                sortClose();
            }
        });

        function sortOpen(){
            if($('html').hasClass('mobile')) $('body').addClass('noScroll');
    
            $('.sort_layer').prepend('<div class="sort_s" tabindex="0"></div>');
            $('.sort_layer').append('<div class="sort_e" tabindex="0"></div>');
            $('.sort_layer').find('.sort_layer_wrap').attr('tabindex', '0');
            
            $('.sort_layer').addClass('open');
    
            setTimeout(() => {
                $('.sort_layer').find('.sort_layer_wrap').focus();
            }, 200); // style animation/transition 속도 고려
    
            $('.sort_layer').find('.sort_s, .sort_e').on('focus', function(){
                $('.sort_layer').find('.sort_layer_wrap').focus();
            });
        }

        function sortClose(){
            $('.sort_layer').removeClass('open');
            $('.sort_btn').focus();
    
            $('.sort_layer').removeAttr('style');
            $('.sort_layer').find('.sort_s, .sort_e').remove();
            $('.sort_layer').find('.sort_layer_wrap').removeAttr('tabindex');
    
            if($('html').hasClass('mobile')) $('body').removeClass('noScroll');
        }
    }, // sortLayer
    asideNav : function(){
        $(document).on('click', '.header .h_menu', function(){
            $('.aside').prepend('<div class="asd_s" tabindex="0"></div>');
            $('.aside').append('<div class="asd_e" tabindex="0"></div>');
            $('.aside').find('> .inner').attr('tabindex', '0');
            
            $('.aside').addClass('open');

            setTimeout(() => {
                $('.aside').find('> .inner').focus();
            }, 200); // style animation/transition 속도 고려

            $('.aside').find('.asd_s, .asd_e').on('focus', function(){
                $('.aside').find('> .inner').focus();
            });
            
            $('body').addClass('noScroll');
        });

        $(document).on('click', '.asd_close', function(){
            $(this).closest('.aside').find('.asd_s, .asd_e').remove();
            $(this).closest('.aside').find('> .inner').removeAttr('tabindex');
            $(this).closest('.aside').removeClass('open');
            $('body').removeClass('noScroll');
            $('.header .h_menu').focus();
        });

        $(document).on('click', '.aside_nav button', function(){
            if($(this).attr('aria-expanded') == 'true'){
                $(this).attr('aria-expanded', false);
                $(this).closest('li').find('[role=region]').slideUp();
                $(this).closest('li').removeClass('on');
            } else {
                $(this).attr('aria-expanded', true);
                $(this).closest('li').find('[role=region]').slideDown();
                $(this).closest('li').addClass('on');

                // [06/30] toggle => accordion으로 수정
                $(this).parents("li").siblings("li").removeClass("on");
                $(this).parents("li").siblings("li").find("button").attr('aria-expanded', false);
                $(this).parents("li").siblings("li").find("[role=region]").slideUp();
            }
        });
    }, // asideNav
    tooltip : function(){
        $(document).on('click', '.tooltip button', function(){

            if($(this).parents('.pop_content').length){
                var conWidth = $(this).closest('.pop_content').outerWidth(true);
                var conLeft = $(this).closest('.pop_content').offset().left;
            } else if($(this).parents('.pc').length && $(this).parents('.plan_item').length) {
                var conWidth = ($(this).closest('.plan_item').outerWidth(true)) + 32;
                var conLeft = ($(this).closest('.plan_item').offset().left) - 16;
            } else {
                var conWidth = $('.content').width();
                var conLeft = $('.content').offset().left;
            }

            var tooltipWidth = $(this).parent('.tooltip').outerWidth(true);
            var tooltipLeft = $(this).parent('.tooltip').offset().left;

            var _Left = tooltipLeft - conLeft;
            var _Right = (tooltipLeft + tooltipWidth) - (conLeft + conWidth);

            if($(this).parent('.tooltip').hasClass('on')) {
                $(this).attr('aria-expanded', false);
                $(this).parent('.tooltip').removeClass('on');
                $(this).siblings('.info').removeAttr('style');
            } else {
                $(this).siblings('.info').css({'left': _Left * -1, 'right': _Right});
                $(this).parent('.tooltip').addClass('on');
                $(this).attr('aria-expanded', true);
            }
        });

        $(window).on('resize', function(){
            $('.tooltip.on').each(function(){
                
                if($(this).parents('.pop_content').length){
                    var conWidth = $(this).closest('.pop_content').outerWidth(true);
                    var conLeft = $(this).closest('.pop_content').offset().left;
                } else if($(this).parents('.pc').length && $(this).parents('.plan_item').length) {
                    var conWidth = ($(this).closest('.plan_item').outerWidth(true)) + 32;
                    var conLeft = ($(this).closest('.plan_item').offset().left) - 16;
                } else {
                    var conWidth = $('.content').width();
                    var conLeft = $('.content').offset().left;
                }

                var tooltipWidth = $(this).outerWidth(true);
                var tooltipLeft = $(this).offset().left;

                var _Left = tooltipLeft - conLeft;
                var _Right = (tooltipLeft + tooltipWidth) - (conLeft + conWidth);

                $(this).find('.info').css({'left': _Left * -1, 'right': _Right});
            });
        });
    }, // tooltip
    float : function(){
        if($('.bottom_float').length) {
            var _paddingB = $('.bottom_float').find('.inner').outerHeight(true);

            if($('.footer').length) {
                $('.footer').css('padding-bottom', _paddingB);
            } else {
                $('.container').css('padding-bottom', _paddingB);
            }

            var _bottom = parseInt($('.aside_float > .inner').css('bottom'));

            $('.aside_float > .inner').css('bottom', (_bottom + _paddingB));
        }

        $(document).on('click', '.aside_float .top_btn', function(){
            $('html, body').stop().animate({scrollTop:0}, 200);
        });

    }, // float
    gnb : function(){
        if($('html').hasClass('mobile')){
            $(document).on('click', '.pc_header .menu_class', function(){
                if($(this).closest('.nav').hasClass('on')) {
                    $(this).closest('.nav').removeClass('on');
                    $(this).closest('.nav').find('.sub_menu').stop().slideUp();
                } else {
                    $(this).closest('.nav').addClass('on');
                    $(this).closest('.nav').find('.sub_menu').stop().slideDown();
                }
            });
        } else {
            $(document).on('mouseover focusin', '.pc_header .menu_class', function(){
                $(this).closest('.nav').addClass('on');
                $(this).closest('.nav').find('.sub_menu').stop().slideDown();
            });
    
            $(document).on('mouseleave', '.pc_header .nav', function(){
                $(this).removeClass('on');
                $(this).find('.sub_menu').stop().slideUp();
            });
    
            $(document).on('focusin', '.pc_header h1 a, .pc_header .header_menu a', function(){
                $('.pc_header .nav').removeClass('on');
                $('.pc_header .sub_menu').stop().slideUp();
            });
        }
    }, // gnb
    form : {
        init : function(){
            $(document).on('keyup', '.input_box input', function(){
                if($(this).val().length){
                    $(this).siblings('.del_btn').show();
                } else {
                    $(this).siblings('.del_btn').hide();
                }
            });
        
            $(document).on('focusin', '.input_box input', function(){
                if($(this).val().length){
                    $(this).siblings('.del_btn').show();
                }
            });
        
            $(document).on('blur', '.input_box input', function(){
                setTimeout(() => {
                    $(this).siblings('.del_btn').hide();
                }, 200);
            });
        
            $(document).on('click', '.input_box .del_btn', function(){
                $(this).siblings('input').val('');
                $(this).hide();
            });
        
            // class="radio_active"
            $(document).on('change', '.radio_active [class^=radio_ty] input', function(){
                if($(this).is(':checked') == true) {
                    $(this).closest('li').removeClass('off').addClass('on');
                    $(this).closest('li').siblings().removeClass('on').addClass('off');
                    $(this).closest('li').siblings().find('input:checked').closest('li').removeClass('off').addClass('on');
                }
            });

            $(document).on('keydown keyup', '.textarea_box .textarea', function(){
                if($(this).val().length) {
                    $(this).parent('.textarea_box').addClass('on');
                } else {
                    $(this).parent('.textarea_box').removeClass('on');
                }
                $(this).parent('.textarea_box').find('.byte_check .count').text($(this).val().length);

                if($(this).parent('.textarea_box').hasClass('ty02')) pubUi.form.textareaResize(this);
            });
        },
        textareaResize : function(obj){
            obj.style.height = 'auto';
            obj.style.height = ((obj.scrollHeight + 2) / 10) + 'rem';
        },
    }, // form
}



// filter and tag
var tagList = {
    init : function(){
        for( var i=0 ; i < $('.tagList').length ; i++){

            if($('.tagList').eq(i).hasClass('multi')){
                $('.tagList').eq(i).find('> ul > li:not(.other) > button, > ul > li:not(.other) > a').attr({'role':'checkbox', 'aria-checked':'false'});
            } else {
                $('.tagList').eq(i).find('> ul > li:not(.other) > button, > ul > li:not(.other) > a').attr({'role':'option', 'aria-selected':'false'});
            }

            var _this = $('.tagList').eq(i).find('.on');

            if($('.tagList').eq(i).hasClass('multi')){
                _this.find('button, a').attr('aria-checked', true);
            } else {
                _this.find('button, a').attr('aria-selected', true);
            }

            if($('.tagList').eq(i).find('> [aria-expanded]').length) tagList.tagWidth($('.tagList').eq(i));
            
            if($('.tagList').eq(i).find('li').hasClass('other')) tagList.other();
        }

        tagList.tab();
    },
    tagWidth : function(obj){
        var _thisUl = obj.find('ul');
        var _thisUlW = _thisUl.outerWidth(true);
        var _thisUlLen = _thisUl.find('> li').length;
        var _thisUlIn = 0;

        for( var i=0 ; i < _thisUlLen ; i++){
            _thisUlIn += _thisUl.find('> li').eq(i).outerWidth(true);
        }

        if(_thisUlW < _thisUlIn){
            if(! obj.hasClass('block')) obj.addClass('variable');
        } else {
            obj.removeClass('variable');
        }

        $(window).on('resize', function(){
            _thisUlW = _thisUl.outerWidth(true);

            if(_thisUlW < _thisUlIn){
                if(! obj.hasClass('block')) obj.addClass('variable');
            } else {
                obj.removeClass('variable');
            }
        });
    },
    tab : function(){
        $(document).on('click', '.tagList > [aria-expanded]', function(e){
            e.preventDefault();
            var _this = $(this);

            if(_this.closest('.tagList').hasClass('multi')){
                var _tab = _this.closest('.tagList').find('> ul > li:not(.other) [aria-checked=true]');
            } else {
                var _tab = _this.closest('.tagList').find('> ul > li:not(.other) [aria-selected=true]');
            }

            if(_this.attr('aria-expanded') == 'true'){
                _this.attr('aria-expanded', false);
                _this.closest('.tagList').removeClass('on');
            } else {
                _this.attr('aria-expanded', true);
                _this.closest('.tagList').addClass('on');
            }

            tagList.tabMove(_tab);
        });

        $(document).on('click', '.tagList > ul > li:not(.other) [aria-checked]', function(e){
            e.preventDefault();
            var _this = $(this);

            if(_this.parent('li').hasClass('on')){
                _this.attr('aria-checked', false).parent('li').removeClass('on')
            } else {
                _this.attr('aria-checked', true).parent('li').addClass('on');
            }

            tagList.tabMove(_this);
        });

        $(document).on('click', '.tagList > ul > li:not(.other) [aria-selected]', function(e){
            e.preventDefault();
            var _this = $(this);

            if(_this.parent('li').hasClass('on')){
                _this.attr('aria-selected', false).parent('li').removeClass('on')
            } else {
                _this.attr('aria-selected', true).parent('li').addClass('on');
                _this.parent('li').siblings().removeClass('on').find('> [aria-selected]').attr('aria-selected', false);
            }

            tagList.tabMove(_this);
        });
    },
    tabMove : function(obj){
        var _tab = obj.closest('ul');
        var _tabW = _tab.width();
        var _tabS = _tab.scrollLeft();
        var _thisL = obj.parent('li').prevAll().length;
        var _thisW = obj.parent('li').outerWidth(true);
        var _thisS = 0;
        for( var i=0 ; i < _thisL ; i++){
            _thisS += _tab.find('> li').eq(i).outerWidth(true);
        }

        if(_tabS + _tabW < _thisS + _thisW || _tabS > _thisS){
            if(_tab.find('li.other').length) _thisS = _thisS - (_tab.find('li.other').outerWidth(true));
            
            _tab.stop().animate({scrollLeft : _thisS}, 300);
        }
    },
    other : function(){
        $(document).on('click', '.tagList > ul > .other [aria-haspopup]', function(e){
            e.preventDefault();
            var _this = $(this);
            var _selec = _this.addClass('on').closest('.tagList').find('.other_pop');

            _selec.prepend('<div class="sel_s" tabindex="0"></div>');
            _selec.append('<div class="sel_e" tabindex="0"></div>');
            _selec.find('> ul').attr('tabindex', 0);

            _selec.addClass('on');
            _selec.find('> ul').focus();
        });

        $(document).on('focus', '.sel_s, .sel_e', function(e){
            e.preventDefault();
            var _this = $(this);

            _this.closest('.other_pop').find(' > ul').focus();
        });

        $(document).on('click', '.tagList > .other_pop button', function(e){
            e.preventDefault();
            var _this = $(this);
            
            _this.attr('aria-selected', true).parent('li').addClass('on');
            _this.parent('li').siblings().removeClass('on').find('> [aria-selected]').attr('aria-selected', false);

            _this.closest('.other_pop').find('.sel_s, .sel_e').remove();
            _this.closest('.other_pop').removeClass('on');
            _this.closest('.tagList').find('> ul .other button').removeClass('on').text(_this.text()).focus();
        });
    }
}



// tab
var tabList = {
    init : function(){
        for( var i=0 ; i < $('[role=tablist]').length ; i++){
            var _tablist = $('[role=tablist]').eq(i);
            var _this = _tablist.find('[role=tab][aria-selected=true]');
            var tabSelected = _this.attr('aria-controls');

            _this.parent('li').addClass('on');
            if(_this.attr('aria-controls').length){
                $('#' + tabSelected).attr('aria-expanded', true);
            };

            if(_this.closest('.scroll_tab').length) tabList.scrollTab();

            tabList.tabMove(_this);
        }

        tabList.tab();
    },
    tab : function(){
        $(document).on('click', '[role=tab]', function(e){
            e.preventDefault();
            _this = $(this);
            
            if(! _this.closest('.scroll_tab').length) {
                _this.attr('aria-selected', true).parent('li').addClass('on');
                _this.parent('li').siblings().removeClass('on').find('[role=tab]').attr('aria-selected', false);

                if($('#' + _this.attr('aria-controls')).length){
                    $('#' + _this.attr('aria-controls')).attr('aria-expanded', true);
                    $('#' + _this.attr('aria-controls')).siblings('[role=tabpanel]').attr('aria-expanded', false);

                    if(! _this.parents('.pop_layer').length) {
                        var _scroll = $(document).scrollTop();
                        var _thisTop = _this.closest('[role=tablist]').offset().top;
                        var _thisHeight = _this.closest('[role=tablist]').outerHeight(true);
                        var _conTop = $('#' + _this.attr('aria-controls')).offset().top;

                        _scroll = _conTop - ((_thisTop + _thisHeight) - _scroll);
                        $('html, body').scrollTop(_scroll);
                    }
                }
            }

            tabList.tabMove(_this);
        });
    },
    scrollTab : function(){

        $(document).on('click', '[role=tab]', function(e){
            e.preventDefault();
            _this = $(this);
            
            if(_this.closest('.scroll_tab').length && $('#' + _this.attr('aria-controls')).length && ! _this.parents('.pop_layer').length) {
                var _conTop = $('#' + _this.attr('aria-controls')).offset().top;
                var _heaH = $('.header').outerHeight(true);
                var _tabH = $('.scroll_tab').outerHeight(true);

                var _scroll = _conTop - _heaH - _tabH + 1;

                $('html, body').stop().animate({scrollTop:_scroll}, 200);
            }

            tabList.tabMove(_this);
        });
        
        setTimeout(() => {
            $('.scroll_panel').each(function(index){
                var _scroll = $(document).scrollTop();
                var _sPanel = $(this);
                var _pLength = $('.scroll_panel').length;

                var _sHeight = _sPanel.outerHeight(true);
                var _sTop = _sPanel.offset().top;
                var _tabH = $('.scroll_tab').outerHeight(true);
                                
                var _sTab = $('[role=tab][aria-controls='+ _sPanel.attr('id') +']');
    
                $(document).on('scroll', function(){
                    _scroll = $(document).scrollTop();
                    var _winHeight = $(window).height();
                    var _tabTop = $('.scroll_tab > ul').offset().top;

                    if(_tabTop + _tabH >= _sTop - 1){
                        if(_tabTop + _tabH > _sTop + _sHeight){
                            _sPanel.attr('aria-expanded', false);
                            _sTab.attr('aria-selected', false).parent('li').removeClass('on');
                        } else {
                            _sPanel.attr('aria-expanded', true);
                            _sTab.attr('aria-selected', true).parent('li').addClass('on');
                        }
                    } else {
                        _sPanel.attr('aria-expanded', false);
                        _sTab.attr('aria-selected', false).parent('li').removeClass('on');
                    }

                    if(Math.ceil(_scroll + _winHeight) == $(document).height() && _pLength - 1 == index){
                        _sPanel.siblings('.scroll_panel').attr('aria-expanded', false);
                        _sTab.parent('li').siblings().removeClass('on').find('[role=tab]').attr('aria-selected', false);
                        
                        _sPanel.attr('aria-expanded', true);
                        _sTab.attr('aria-selected', true).parent('li').addClass('on');
                    }
                    
                });
            });
        }, 500);

    },
    tabMove : function(obj){
        var _tab = obj.closest('ul');
        var _tabW = _tab.width();
        var _tabS = _tab.scrollLeft();
        var _thisL = obj.parent('li').prevAll().length;
        var _thisW = obj.parent('li').outerWidth(true);
        var _thisS = 0;
        for( var i=0 ; i < _thisL ; i++){
            _thisS += _tab.find('> li').eq(i).outerWidth(true);
        }

        if(_tabS + _tabW < _thisS + _thisW || _tabS > _thisS){
            _tab.stop().animate({scrollLeft : _thisS}, 300);
        }
    }
}



// accordion
var acdItem = {
    init : function(){
        var acdSelected = $('.acdItem [aria-expanded=true]').closest('.acdItem').find('[role=region]');

        $('.acdItem [aria-expanded=true]').closest('.acdItem').addClass('on');
        $(acdSelected).show();

        acdItem.tab();
    },
    tab : function(){
        $(document).on('click', '.acdItem [aria-expanded]', function(e){
            e.preventDefault();
            var _this = $(this);
            var _thisItem = _this.closest('.acdItem');
            
            if(_this.attr('aria-expanded') == 'true'){
                _this.attr('aria-expanded', false);
                _thisItem.find('[role=region]').slideUp();
                _thisItem.removeClass('on');
            } else {
                _this.attr('aria-expanded', true);
                _thisItem.find('[role=region]').slideDown();
                _thisItem.addClass('on');

                if(_this.closest('.acdItem_wrap').hasClass('tog') || _thisItem.hasClass('tog')){} else {
                    _thisItem.siblings('.acdItem:not(.tog)').find('[aria-expanded]').attr('aria-expanded', false);
                    _thisItem.siblings('.acdItem:not(.tog)').find('[role=region]').slideUp()
                    _thisItem.siblings('.acdItem:not(.tog)').removeClass('on');
                }
            }
        });
    }
}



// scrollFixed
var scrollFixed = {
    init : function(){
        for( var i=0 ; i < $('.scroll_fixed').length ; i++){
            var _this = $('.scroll_fixed').eq(i);
            var _offset = _this.offset().top;
            var _height = _this.find('> *').outerHeight(true);
            var _length = i;

            scrollFixed.scroll(_this, _offset, _height, _length);
        }
    },
    scroll : function(_this, _offset, _height, _length){
        var _top = $('.header').outerHeight(true);

        for( var i=0 ; i < $('.scroll_fixed').length ; i++){
            if(_length > i) _top += $('.scroll_fixed').eq(i).outerHeight(true);
        }

        $(document).on('scroll', function(){
            var _scroll = $(document).scrollTop();

            if(_offset <= _scroll + _top){
                _this.height(_height).addClass('on');
                _this.find('> *').css({'top':_top});
            } else {
                _this.removeAttr('style').removeClass('on');
                _this.find('> *').removeAttr('style')
            }
        });
    }
}



// pop_layer
var popUp = {
    open : function(pop, btn){
        $('body').addClass('noScroll');

        if($('.pop_layer.open').length){
            var _zindex = parseInt($(pop).css('z-index'));
            var _length = $('.pop_layer.open').length;
            
            $(pop).css('z-index', _zindex + _length);
        }

        $(pop).prepend('<div class="pop_s" tabindex="0"></div>');
        $(pop).append('<div class="pop_e" tabindex="0"></div>');
        $(pop).find('.pop_wrap').attr('tabindex', '0');
        
        $(pop).addClass('open');

        setTimeout(() => {
            $(pop).find('.pop_wrap').focus();
        }, 200); // style animation/transition 속도 고려

        $(pop).find('.pop_s, .pop_e').on('focus', function(){
            $(pop).find('.pop_wrap').focus();
        });

        $(pop).find('[data-action=close]').on('click', function(){
            popUp.close(pop, btn);
        });
    },
    close : function(pop, btn){
        $(pop).removeClass('open');

        $(pop).removeAttr('style');
        $(pop).find('.pop_s, .pop_e').remove();
        $(pop).find('.pop_wrap').removeAttr('tabindex');

        if($('.pop_layer.open').length < 1) $('body').removeClass('noScroll');
        
        $(btn).focus();
    }
}

const cardSwiper = function(){
    // console.log('cardSwiper');

    // var swiper = new Swiper(".cardSwiper", {
    //     slidesPerView: "auto",
    //     spaceBetween: 12,
    //     grabCursor: true,
    //     observer: true,
    //     observeParents: true,
    // });
    
    var swiper = new Swiper(".cardSwiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        grabCursor: true,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ('.swiper-button-next'),
            prevEl: ('.swiper-button-prev'),
        },
        on: {
            slideChange	:function(a){

                if( $(a.$el).hasClass("ty04") || !$('html').hasClass("pc") ) return;

                const wrapW = a.width;

                const swiperW = a.virtualSize;
                const Translate = a.translate;
                const gap = 20;

                // console.log( a, swiperW + Translate - gap,  wrapW, swiperW, Translate, gap, ( swiperW + Translate - gap > wrapW ));

                if( swiperW + Translate - gap > wrapW ){
                    // console.log('gg');
                    ( a.activeIndex != 0 ) ? $(a.$el[0]).addClass("activeIndex") : $(a.$el[0]).removeClass("activeIndex");
                }
            }
        }
    });

}