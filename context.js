/*
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 *
 * Modified by 	Joshua Christman
 * 		Michael Rothenbücher
 */

context = (function () {
	
	var createCallback = function(func) {
	    return function(event) { func(event, currentContextSelector) };
	};

	currentContextSelector = undefined;

	var options = {
		fadeSpeed: 100,
		filter: function ($obj) {
			// Modify $obj, Do not return
		},
		above: 'auto',
        left: 'auto',
		preventDoubleContext: true,
		compress: false
	};

	function initialize(opts) {

		options = $.extend({}, options, opts);

		$(document).on('click', function () {
			$('.dropdown-context').fadeOut(options.fadeSpeed, function(){
				$('.dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
			});
		});
		if(options.preventDoubleContext){
			$(document).on('contextmenu', '.dropdown-context', function (e) {
				e.preventDefault();
			});
		}
		$(document).on('mouseenter', '.dropdown-submenu', function(){
			var $sub = $(this).find('.dropdown-context-sub:first'),
				subWidth = $sub.width(),
				subLeft = $sub.offset().left,
				collision = (subWidth+subLeft) > window.innerWidth;
			if(collision){
				$sub.addClass('drop-left');
			}
		});

	}

	function updateOptions(opts){
		options = $.extend({}, options, opts);
	}

	function buildMenu(data, id, subMenu) {
		var subClass = (subMenu) ? ' dropdown-context-sub' : '',
			compressed = options.compress ? ' compressed-context' : '',
			$menu = $('<ul class="context-dropdown-menu dropdown-context' + subClass + compressed +'" id="dropdown-' + id + '"></ul>');
        
        return buildMenuItems($menu, data, id, subMenu);
	}

    function buildMenuItems($menu, data, id, subMenu, addDynamicTag) {
	    var linkTarget = '';
        for(var i = 0; i<data.length; i++) {
        	if (typeof data[i].onBeforeShow === 'function') {
				// if onBeforeShow returns false element will be skipped
				if(!data[i].onBeforeShow(currentContextSelector, data[i])){
					continue;
				}
			}
        	if (typeof data[i].divider !== 'undefined') {
                var divider = '<li class="divider';
                divider += (addDynamicTag) ? ' dynamic-menu-item' : '';
                divider += '"></li>';
				$menu.append(divider);
			} else if (typeof data[i].header !== 'undefined') {
                var header = '<li class="nav-header';
                header += (addDynamicTag) ? ' dynamic-menu-item' : '';
                header += '">' + data[i].header + '</li>';
				$menu.append(header);
            } else if (typeof data[i].menu_item_src !== 'undefined') {
                var funcName;
                if (typeof data[i].menu_item_src === 'function') {
                    if (data[i].menu_item_src.name === "") { // The function is declared like "foo = function() {}"
                        for (var globalVar in window) {
                            if (data[i].menu_item_src == window[globalVar]) {
                                funcName = globalVar;
                                break;
                            }
                        }
                    } else {
                        funcName = data[i].menu_item_src.name;
                    }
                } else {
                    funcName = data[i].menu_item_src;
                }
                $menu.append('<li class="dynamic-menu-src" data-src="' + funcName + '"></li>');
			} else {
				if (typeof data[i].href == 'undefined') {
					data[i].href = '#';
				}
				if (typeof data[i].target !== 'undefined') {
					linkTarget = ' target="'+data[i].target+'"';
				}
				if (typeof data[i].subMenu !== 'undefined') {
                    var sub_menu = '<li class="context-dropdown-submenu';
                    sub_menu += (addDynamicTag) ? ' dynamic-menu-item' : '';
                    sub_menu += '"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>'
					$sub = (sub_menu);
				} else {
                    var element = '<li';
                    element += (addDynamicTag) ? ' class="dynamic-menu-item"' : '';
                    element += '><a tabindex="-1" href="' + data[i].href + '"'+linkTarget+'>';
                    if (typeof data[i].icon !== 'undefined')
                        element += '<span class="glyphicon ' + data[i].icon + '"></span> ';
                    element += data[i].text + '</a></li>';
					$sub = $(element);
				}
				if (typeof data[i].action !== 'undefined') {
                    $action = data[i].action;
					$sub
						.find('a')
						.addClass('context-event')
						.on('click', createCallback($action));
				}
				$menu.append($sub);
				if (typeof data[i].subMenu != 'undefined') {
					var subMenuData = buildMenu(data[i].subMenu, id, true);
					$menu.find('li:last').append(subMenuData);
				}
			}
			if (typeof options.filter == 'function') {
				options.filter($menu.find('li:last'));
			}
		}
        return $menu;
    }

	function addContext(selector, data) {

		var d = new Date(),
        id = d.getTime();
		
		$(selector).on('contextmenu', function (e) {
			e.preventDefault();
			e.stopPropagation();
	        
            currentContextSelector = $(this);
			
			$('.dropdown-context:not(.dropdown-context-sub)').hide();
			
	        $('#dropdown-' + id).remove();
	       
            $menu = buildMenu(data, id);
            $('body').append($menu);

            $menu.find('.dynamic-menu-item').remove(); // Destroy any old dynamic menu items
            $menu.find('.dynamic-menu-src').each(function(idx, element) {
                var menuItems = window[$(element).data('src')]($(selector));
                $parentMenu = $(element).closest('.dropdown-menu.dropdown-context');
                $parentMenu = buildMenuItems($parentMenu, menuItems, id, undefined, true);
            });

			if (typeof options.above == 'boolean' && options.above) {
				$menu.addClass('dropdown-context-up').css({
					top: e.pageY - 20 - $('#dropdown-' + id).height(),
					left: e.pageX - 13
				}).fadeIn(options.fadeSpeed);
			} else if (typeof options.above == 'string' && options.above == 'auto') {
				$menu.removeClass('dropdown-context-up');
				var autoH = $menu.height() + 12;
				if ((e.pageY + autoH) > $('html').height()) {
					$menu.addClass('dropdown-context-up').css({
						top: e.pageY - 20 - autoH,
						left: e.pageX - 13
					}).fadeIn(options.fadeSpeed);
				} else {
					$menu.css({
						top: e.pageY + 10,
						left: e.pageX - 13
					}).fadeIn(options.fadeSpeed);
				}
			}

            if (typeof options.left == 'boolean' && options.left) {
            	$menu.addClass('dropdown-context-left').css({
                    left: e.pageX - $dd.width()
                }).fadeIn(options.fadeSpeed);
            } else if (typeof options.left == 'string' && options.left == 'auto') {
            	$menu.removeClass('dropdown-context-left');
                var autoL = $menu.width() - 12;
                if ((e.pageX + autoL) > $('html').width()) {
                	$menu.addClass('dropdown-context-left').css({
                        left: e.pageX - $dd.width() + 13
                    });
                }
            }
		});
	}

	function destroyContext(selector) {
		$(document).off('contextmenu', selector).off('click', '.context-event');
	}

	return {
		init: initialize,
		settings: updateOptions,
		attach: addContext,
		destroy: destroyContext
	};
})();
