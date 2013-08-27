(function($, w, d) {
	// Public methods
	var methods = {
		init: function(options) {
			var defaults = $.extend(true, {
				classPrefix: 'rScrollbar',
				
				trackV: {
					position: 'right',

					buttonUp: true,
					buttonUpHTML: null,

					buttonDown: true,
					buttonDownHTML: null,
					
					buttonSpacer: 5,
					buttonScrollDelta: 30,
					buttonScrollInterval: 100,

					trackHTML: null,
					barHTML: null,

					beforeDrag: function() {},
					afterDrag: function() {}
				},

				trackH: {
					position: 'bottom',

					buttonUp: true,
					buttonUpHTML: null,

					buttonDown: true,
					buttonDownHTML: null,
					
					buttonSpacer: 5,
					buttonScrollDelta: 30,
					buttonScrollInterval: 100,

					trackHTML: null,
					barHTML: null,

					beforeDrag: function() {},
					afterDrag: function() {}
				},

				afterInit: function() {}
			}, options);
			
			return this.each(function() {
				var $self = $(this),
					$scroller, $wrap,
					$trackV, $barV, $buttonUpV, $buttonDownV,
					$trackH, $barH, $buttonUpH, $buttonDownH,
					vTimer, hTimer,
					vDrag, hDrag;

				// cache defaults
				$self.data('defaults', defaults);

				// append container
				$self.wrapInner('<div class="' + defaults.classPrefix + '" />');
				$wrap = $self.find('.' + defaults.classPrefix);

				// append scroller
				$self.wrapInner('<div class="' + defaults.classPrefix + '__scroller" />');
				$scroller = $self.find('.' + defaults.classPrefix + '__scroller');

				// append vertical track
				$self.append('<div class="' + defaults.classPrefix + '__track-v" />');
				$trackV = $self.find('.' + defaults.classPrefix + '__track-v');

				if (defaults.trackV.trackHTML && (typeof defaults.trackV.trackHTML === 'string')) {
					$trackV.append($(defaults.trackV.trackHTML));
				}

				// wrap vertical track
				$trackV.wrap('<div class="' + defaults.classPrefix + '__track-cont-v" />');
				$trackVcont = $self.find('.' + defaults.classPrefix + '__track-cont-v');

				// append vertical bar
				$trackV.append('<div class="' + defaults.classPrefix + '__bar-v" />');
				$barV = $trackV.find('.' + defaults.classPrefix + '__bar-v');

				if (defaults.trackV.barHTML && (typeof defaults.trackV.barHTML === 'string')) {
					$barV.append($(defaults.trackV.barHTML));
				}

				// append vertical buttons
				if (defaults.trackV.buttonUp) {
					$trackVcont.append('<div class="' + defaults.classPrefix + '__button-up-v" />');
					$buttonUpV = $self.find('.' + defaults.classPrefix + '__button-up-v');

					if (defaults.trackV.buttonUpHTML && (typeof defaults.trackV.buttonUpHTML === 'string')) {
						$buttonUpV.append($(defaults.trackV.buttonUpHTML));
					}
				}

				if (defaults.trackV.buttonDown) {
					$trackVcont.append('<div class="' + defaults.classPrefix + '__button-down-v" />');
					$buttonDownV = $self.find('.' + defaults.classPrefix + '__button-down-v');

					if (defaults.trackV.buttonDownHTML && (typeof defaults.trackV.buttonDownHTML === 'string')) {
						$buttonDownV.append($(defaults.trackV.buttonDownHTML));
					}
				}

				// append horizontal track
				$self.append('<div class="' + defaults.classPrefix + '__track-h" />');
				$trackH = $self.find('.' + defaults.classPrefix + '__track-h');

				if (defaults.trackH.trackHTML && (typeof defaults.trackH.trackHTML === 'string')) {
					$trackH.append($(defaults.trackH.trackHTML));
				}

				// wrap vertical track
				$trackH.wrap('<div class="' + defaults.classPrefix + '__track-cont-h" />');
				$trackHcont = $self.find('.' + defaults.classPrefix + '__track-cont-h');

				// append horizontal bar
				$trackH.append('<div class="' + defaults.classPrefix + '__bar-h" />');
				$barH = $trackH.find('.' + defaults.classPrefix + '__bar-h');

				if (defaults.trackH.barHTML && (typeof defaults.trackH.barHTML === 'string')) {
					$barH.append($(defaults.trackH.barHTML));
				}

				// append horizontal buttons
				if (defaults.trackH.buttonUp) {
					$trackHcont.append('<div class="' + defaults.classPrefix + '__button-up-h" />');
					$buttonUpH = $self.find('.' + defaults.classPrefix + '__button-up-h');

					if (defaults.trackH.buttonUpHTML && (typeof defaults.trackH.buttonUpHTML === 'string')) {
						$buttonUpH.append($(defaults.trackH.buttonUpHTML));
					}
				}

				if (defaults.trackH.buttonDown) {
					$trackHcont.append('<div class="' + defaults.classPrefix + '__button-down-h" />');
					$buttonDownH = $self.find('.' + defaults.classPrefix + '__button-down-h');

					if (defaults.trackH.buttonDownHTML && (typeof defaults.trackH.buttonDownHTML === 'string')) {
						$buttonDownH.append($(defaults.trackH.buttonDownHTML));
					}
				}

				// setup self
				$self.css({
					'position': 'relative',
					'overflow': 'hidden'
				});

				// setup scroller
				$scroller.css({
					'position': 'absolute',
					'top': '0',
					'right': '0',
					'bottom': '0',
					'left': '0',
					'overflow': 'hidden'
				});

				// setup trackV
				$trackV.css('z-index', '2');

				// setup trackH
				$trackH.css('z-index', '2');

				methods.update.call(this);
				
				// setup event listeners
				$(w).on('resize', function() {
					methods.update.call($self[0]);
				}).on('load', function() {
					methods.update.call($self[0]);
				});

				$self.on('mousewheel DOMMouseScroll', function(e) {
					var E = e.originalEvent,
						delta,
						p = 0, x = 0, y = 0;

					if (e.type === 'mousewheel') {
						delta = E.wheelDelta;
					} else if (e.type === 'DOMMouseScroll') {
						delta = E.detail * -40;
					}

					if ($trackV.is(':visible') && !e.shiftKey) {
						e.preventDefault();
						e.stopPropagation();

						$scroller.scrollTop($scroller.scrollTop() - delta);

						p = $scroller.scrollTop() / ($wrap.outerHeight() - $scroller.innerHeight());
						y = ($trackV.outerHeight(true) - $barV.outerHeight(true)) * p;

						$barV.css('top', Math.round(y) + 'px');
					}

					if ($trackH.is(':visible')) {
						if (!$trackV.is(':visible') || e.shiftKey) {
							e.preventDefault();
							e.stopPropagation();

							$scroller.scrollLeft($scroller.scrollLeft() - delta);

							p = $scroller.scrollLeft() / ($wrap.outerWidth() - $scroller.innerWidth());
							x = ($trackH.outerWidth(true) - $barH.outerWidth(true)) * p;

							$barH.css('left', Math.round(x) + 'px');
						}
					}
				});

				$trackV.on('click', function(e) {
					var y = e.pageY - $(this).offset().top,
						p;

					y -= $barV.outerHeight(true) / 2;

					if (y < 0) {
						y = 0;
					} else if (y + $barV.outerHeight(true) >= $trackV.outerHeight(true)) {
						y = $trackV.outerHeight(true) - $barV.outerHeight(true);
					}

					p = y / ($trackV.outerHeight(true) - $barV.outerHeight(true));

					$barV.css('top', y + 'px');
					$scroller.scrollTop(($wrap.outerHeight(true) - $scroller.innerHeight()) * p);
				}).on('mouseenter', function() {
					$(this).addClass('hover');
				}).on('mouseleave', function() {
					$(this).removeClass('hover');
				});

				$trackH.on('click', function(e) {
					var x = e.pageX - $(this).offset().left,
						p;

					x -= $barH.outerWidth(true) / 2;

					if (x < 0) {
						x = 0;
					} else if (x + $barH.outerWidth(true) >= $trackH.outerWidth(true)) {
						x = $trackH.outerWidth(true) - $barH.outerWidth(true);
					}

					p = x / ($trackH.outerWidth(true) - $barH.outerWidth(true));

					$barH.css('left', x + 'px');
					$scroller.scrollLeft(($wrap.outerWidth(true) - $scroller.innerWidth()) * p);
				}).on('mouseenter', function(e) {
					e.stopPropagation();

					$(this).addClass('hover');
				}).on('mouseleave', function(e) {
					e.stopPropagation();

					$(this).removeClass('hover');
				});

				$barV.on('mousedown', function(e) {
					$barV.data('shift', e.pageY - $barV.position().top);
					vDrag = true;
					defaults.trackV.beforeDrag.call($self);

					$(this).addClass('active');
				}).on('mouseenter', function(e) {
					e.stopPropagation();

					$(this).addClass('hover');
				}).on('mouseleave', function(e) {
					e.stopPropagation();

					$(this).removeClass('hover');
				}).on('mouseleave', function(e) {
					e.stopPropagation();
					
					$(this).removeClass('hover');
				}).on('dragstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
				}).on('click', function(e) {
					e.stopPropagation();
				});

				$barH.on('mousedown', function(e) {
					$barH.data('shift', e.pageX - $barH.position().left);
					hDrag = true;
					defaults.trackH.beforeDrag.call($self);

					$(this).addClass('active');
				}).on('mouseenter', function(e) {
					e.stopPropagation();

					$(this).addClass('hover');
				}).on('mouseleave', function(e) {
					e.stopPropagation();

					$(this).removeClass('hover');
				}).on('mouseleave', function(e) {
					e.stopPropagation();
					
					$(this).removeClass('hover');
				}).on('dragstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
				}).on('click', function(e) {
					e.stopPropagation();
				});

				if (defaults.trackV.buttonUp) {
					$buttonUpV.on('mousedown', function(e) {
						e.stopPropagation();
						w.clearInterval(vTimer);

						$(this).addClass('active');

						vTimer = w.setInterval(function() {
							var y = $barV.position().top, p;

							y -= defaults.trackV.buttonScrollDelta;

							if (y < 0) {
								y = 0;
							}

							$barV.css('top', y + 'px');

							p = y / ($trackV.outerHeight(true) - $barV.outerHeight(true));
							
							$scroller.scrollTop(($wrap.outerHeight(true) - $scroller.innerHeight()) * p);
						}, defaults.trackV.buttonScrollInterval);
					}).on('mouseup', function(e) {
						e.stopPropagation();
						w.clearInterval(vTimer);
					}).on('mouseenter', function(e) {
						e.stopPropagation();
						
						$(this).addClass('hover');
					}).on('mouseleave', function(e) {
						e.stopPropagation();
						
						$(this).removeClass('hover');
					});
				}

				if (defaults.trackV.buttonDown) {
					$buttonDownV.on('mousedown', function(e) {
						e.stopPropagation();
						w.clearInterval(vTimer);

						$(this).addClass('active');

						vTimer = w.setInterval(function() {
							var y = $barV.position().top, p;
							
							y += defaults.trackV.buttonScrollDelta;

							if (y + $barV.outerHeight(true) >= $trackV.outerHeight(true)) {
								y = $trackV.outerHeight(true) - $barV.outerHeight(true);
							}

							$barV.css('top', y + 'px');

							p = y / ($trackV.outerHeight(true) - $barV.outerHeight(true));
							
							$scroller.scrollTop(($wrap.outerHeight(true) - $scroller.innerHeight()) * p);
						}, defaults.trackV.buttonScrollInterval);
					}).on('mouseup', function(e) {
						e.stopPropagation();
						w.clearInterval(vTimer);
					}).on('mouseenter', function(e) {
						e.stopPropagation();
						
						$(this).addClass('hover');
					}).on('mouseleave', function(e) {
						e.stopPropagation();
						
						$(this).removeClass('hover');
					});
				}

				if (defaults.trackH.buttonUp) {
					$buttonUpH.on('mousedown', function(e) {
						e.stopPropagation();
						w.clearInterval(vTimer);

						$(this).addClass('active');

						hTimer = w.setInterval(function() {
							var x = $barH.position().left, p;

							x -= defaults.trackH.buttonScrollDelta;

							if (x < 0) {
								x = 0;
							}

							$barH.css('left', x + 'px');

							p = x / ($trackH.outerWidth(true) - $barH.outerWidth(true));
							
							$scroller.scrollLeft(($wrap.outerWidth(true) - $scroller.innerWidth()) * p);
						}, defaults.trackH.buttonScrollInterval);
					}).on('mouseup', function(e) {
						e.stopPropagation();
						w.clearInterval(hTimer);
					}).on('mouseenter', function(e) {
						e.stopPropagation();
						
						$(this).addClass('hover');
					}).on('mouseleave', function(e) {
						e.stopPropagation();
						
						$(this).removeClass('hover');
					});
				}

				if (defaults.trackH.buttonDown) {
					$buttonDownH.on('mousedown', function(e) {
						e.stopPropagation();
						w.clearInterval(hTimer);

						$(this).addClass('active');

						hTimer = w.setInterval(function() {
							var x = $barH.position().left, p;
							
							x += defaults.trackV.buttonScrollDelta;

							if (x + $barH.outerWidth(true) >= $trackH.outerWidth(true)) {
								x = $trackH.outerWidth(true) - $barH.outerWidth(true);
							}

							$barH.css('left', x + 'px');

							p = x / ($trackH.outerWidth(true) - $barH.outerWidth(true));
							
							$scroller.scrollLeft(($wrap.outerWidth(true) - $scroller.innerWidth()) * p);
						}, defaults.trackV.buttonScrollInterval);
					}).on('mouseup', function(e) {
						e.stopPropagation();
						w.clearInterval(hTimer);
					}).on('mouseenter', function(e) {
						e.stopPropagation();
						
						$(this).addClass('hover');
					}).on('mouseleave', function(e) {
						e.stopPropagation();
						
						$(this).removeClass('hover');
					});
				}

				$(document).on('mousedown', function() {
					if (vDrag || hDrag) {
						$(this).on('selectstart', false);
					}
				}).on('mouseup', function() {
					$(this).off('selectstart');
					
					if (vDrag) {
						defaults.trackV.afterDrag.call($self);
					}
					
					if (hDrag) {
						defaults.trackH.afterDrag.call($self);
					}
					
					vDrag = hDrag = false;

					$barV.removeClass('active');
					$buttonUpV.removeClass('active');
					$buttonDownV.removeClass('active');
					w.clearInterval(vTimer);

					$barH.removeClass('active');
					$buttonUpH.removeClass('active');
					$buttonDownH.removeClass('active');
					w.clearInterval(hTimer);
				}).on('mousemove', function(e) {
					var x = 0, y = 0, shift = 0, p = 0;
					
					if (vDrag) {
						y = e.pageY - $barV.data('shift');
						
						if (y < 0) {
							y = 0;
						} else if (y + $barV.outerHeight(true) >= $trackV.outerHeight(true)) {
							y = $trackV.outerHeight(true) - $barV.outerHeight(true);
						}
						
						$barV.css('top', y + 'px');
						
						p = y / ($trackV.outerHeight(true) - $barV.outerHeight(true));
						
						$scroller.scrollTop(($wrap.outerHeight(true) - $scroller.innerHeight()) * p);
					}
					
					if (hDrag) {
						x = e.pageX - $barH.data('shift');
						
						if (x < 0) {
							x = 0;
						} else if (x + $barH.outerWidth(true) >= $trackH.outerWidth(true)) {
							x = $trackH.outerWidth(true) - $barH.outerWidth(true);
						}

						p = x / ($trackH.outerWidth(true) - $barH.outerWidth(true));

						$barH.css('left', x + 'px');
						$scroller.scrollLeft(($wrap.outerWidth(true) - $scroller.innerWidth()) * p);
					}
				});
				
				defaults.afterInit.call($self);
			});
		},
		update: function() {
			var $self = $(this),
				$scroller, $wrap,
				$trackV, $barV, $buttonUpV, $buttonDownV,
				$trackH, $barH, $buttonUpH, $buttonDownH,
				defaults = $self.data('defaults'),
				selfSize, wrapSize,
				pX, pY;

			$scroller = $self.find('.' + defaults.classPrefix + '__scroller');
			$wrap = $self.find('.' + defaults.classPrefix);

			$trackVcont = $self.find('.' + defaults.classPrefix + '__track-cont-v');
			$trackV = $trackVcont.find('.' + defaults.classPrefix + '__track-v');
			$barV = $trackV.find('.' + defaults.classPrefix + '__bar-v');

			if (defaults.trackV.buttonUp) {
				$buttonUpV = $trackVcont.find('.' + defaults.classPrefix + '__button-up-v');
			}

			if (defaults.trackV.buttonDown) {
				$buttonDownV = $trackVcont.find('.' + defaults.classPrefix + '__button-down-v');
			}

			$trackHcont = $self.find('.' + defaults.classPrefix + '__track-cont-h');
			$trackH = $trackHcont.find('.' + defaults.classPrefix + '__track-h');
			$barH = $trackH.find('.' + defaults.classPrefix + '__bar-h');

			if (defaults.trackH.buttonUp) {
				$buttonUpH = $trackHcont.find('.' + defaults.classPrefix + '__button-up-h');
			}

			if (defaults.trackH.buttonDown) {
				$buttonDownH = $trackHcont.find('.' + defaults.classPrefix + '__button-down-h');
			}

			selfSize = {
				x: $self.innerWidth(),
				y: $self.innerHeight()
			};

			wrapSize = {
				x: $wrap.outerWidth(),
				y: $wrap.outerHeight()
			};

			pX = selfSize.x / wrapSize.x;
			pY = selfSize.y / wrapSize.y;

			// setup tracks visibility
			$trackVcont.hide(0);
			$trackHcont.hide(0);

			if (wrapSize.y > selfSize.y) {
				$trackVcont.show(0);
			}

			if (wrapSize.x > selfSize.x) {
				$trackHcont.show(0);
			}

			// setup scroller & tracks
			if ($trackVcont.is(':visible')) {
				$scroller.css({
					'right': $trackVcont.outerWidth(true) + 'px',
					'left': '0'
				});

				if (defaults.trackV.buttonUp) {
					$trackV.css({
						'top': $buttonUpV.outerHeight(true) + defaults.trackV.buttonSpacer + 'px'
					});
				}

				if (defaults.trackV.buttonDown) {
					$trackV.css({
						'bottom': $buttonDownV.outerHeight(true) + defaults.trackV.buttonSpacer + 'px'
					});
				}

				$trackHcont.css({
					'right': $trackVcont.outerWidth(true) + 'px'
				});

				if (defaults.trackV.position === 'left') {
					$scroller.css({
						'left': $trackVcont.outerWidth(true) + 'px',
						'right': '0'
					});

					$trackVcont.css({
						'left': '0',
						'right': 'auto'
					});

					$trackHcont.css({
						'left': $trackVcont.outerWidth(true) + 'px',
						'right': '0'
					});
				}
			}

			if ($trackHcont.is(':visible')) {
				$scroller.css({
					'bottom': $trackHcont.outerHeight(true) + 'px',
					'top': '0'
				});

				if (defaults.trackH.buttonUp) {
					$trackH.css({
						'left': $buttonUpH.outerWidth(true) + defaults.trackH.buttonSpacer + 'px'
					});
				}

				if (defaults.trackH.buttonDown) {
					$trackH.css({
						'right': $buttonDownH.outerWidth(true) + defaults.trackH.buttonSpacer + 'px'
					});
				}

				$trackVcont.css({
					'bottom': $trackHcont.outerHeight(true) + 'px'
				});

				if (defaults.trackH.position === 'top') {
					$scroller.css({
						'top': $trackHcont.outerHeight(true) + 'px',
						'bottom': '0'
					});

					$trackHcont.css({
						'top': '0',
						'bottom': 'auto'
					});

					$trackVcont.css({
						'top': $trackHcont.outerHeight(true) + 'px',
						'bottom': '0'
					});
				}
			}

			// setup bars
			$barV.css({
				'height': Math.round($trackV.outerHeight() * pY) + 'px'
			});

			$barH.css({
				'width': Math.round($trackH.outerWidth() * pX) + 'px'
			});

			pX = $scroller.scrollLeft() / ($wrap.outerWidth(true) - $scroller.outerWidth(true));
			pY = $scroller.scrollTop() / ($wrap.outerHeight(true) - $scroller.outerHeight(true));
			
			$barH.css({
				'left': ($trackH.outerWidth(true) - $barH.outerWidth(true)) * pX + 'px'
			});
			
			$barV.css({
				'top': ($trackV.outerHeight(true) - $barV.outerHeight(true)) * pY + 'px'
			});
		}
	};
	
	$.fn.rScrollbar = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.rScrollbar');
		} 
	};
})(jQuery, window, document);