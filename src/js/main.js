$(document)
  .ready(function() {

    //////////
    // Global variables
    //////////

    var _window = $(window);
    var _document = $(document);

    // BREAKPOINT SETTINGS
    var bp = {
      mobileS: 375,
      mobile: 568,
      tablet: 768,
      desktop: 992,
      wide: 1366,
      hd: 1680
    };

    var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

    ////////////
    // READY - triggered when PJAX DONE
    ////////////
    function pageReady() {
      legacySupport();
      updateHeaderActiveClass();
      initHeaderScroll();

      initPopups();
      initSliders();
      initScrollMonitor();
      initMasks();
      initLazyLoad();
      initFormElements();
      initFixers();

      // development helper
      _window.on('resize', debounce(setBreakpoint, 200));

      // AVAILABLE in _components folder
      // copy paste in main.js and initialize here

      // initTeleport();
      // parseSvg();
      // revealFooter();
      // _window.on('resize', throttle(revealFooter, 100));
    }

    // this is a master function which should have all functionality
    pageReady();


    // some plugins work best with onload triggers
    _window.on('load', function() {
      // your functions
    });


    //////////
    // COMMON
    //////////

    function legacySupport() {
      // svg support for laggy browsers
      svg4everybody();

      // Viewport units buggyfill
      window.viewportUnitsBuggyfill.init({
        force: true,
        refreshDebounceWait: 150,
        appendToBody: true
      });
    }


    // Prevent # behavior
    _document
      .on('click', '[href="#"]', function(e) {
        e.preventDefault();
      })
      .on('click', 'a[href^="#section"]', function() { // section scroll
        var el = $(this)
          .attr('href');
        $('body, html')
          .animate({
            scrollTop: $(el)
              .offset().top
          }, 1000);
        return false;
      });


    // HEADER SCROLL
    // add .header-static for .page or body
    // to disable sticky header
    function initHeaderScroll() {
      _window.on('scroll', throttle(function(e) {
        var vScroll = _window.scrollTop();
        var header = $('.header')
          .not('.header--static');
        var headerHeight = header.height();
        var firstSection = _document.find('.page__content div:first-child()')
          .height() - headerHeight;
        var visibleWhen = Math.round(_document.height() / _window.height()) > 2.5;

        if (visibleWhen) {
          if (vScroll > headerHeight) {
            header.addClass('is-fixed');
          } else {
            header.removeClass('is-fixed');
          }
          if (vScroll > firstSection) {
            header.addClass('is-fixed-visible');
          } else {
            header.removeClass('is-fixed-visible');
          }
        }
      }, 10));
    }


    // HAMBURGER TOGGLER
    _document.on('click', '[js-hamburger]', function() {
      $(this)
        .toggleClass('is-active');
      $('.mobile-navi')
        .toggleClass('is-active');
    });

    function closeMobileMenu() {
      $('[js-hamburger]')
        .removeClass('is-active');
      $('.mobile-navi')
        .removeClass('is-active');
    }

    // SET ACTIVE CLASS IN HEADER
    // * could be removed in production and server side rendering when header is inside barba-container
    function updateHeaderActiveClass() {
      $('.header__menu li')
        .each(function(i, val) {
          if ($(val)
              .find('a')
              .attr('href') == window.location.pathname.split('/')
              .pop()) {
            $(val)
              .addClass('is-active');
          } else {
            $(val)
              .removeClass('is-active');
          }
        });
    }

    //////////
    // SLIDERS
    //////////

    function initSliders() {
      var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
      var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>';

      // General purpose sliders
      $('[js-slider]')
        .each(function(i, slider) {
          var self = $(slider);

          // set data attributes on slick instance to control
          if (self && self !== undefined) {
            self.slick({
              autoplay: self.data('slick-autoplay') !== undefined ? true : false,
              dots: self.data('slick-dots') !== undefined ? true : false,
              arrows: self.data('slick-arrows') !== undefined ? true : false,
              prevArrow: slickNextArrow,
              nextArrow: slickPrevArrow,
              infinite: self.data('slick-infinite') !== undefined ? true : true,
              speed: 300,
              slidesToShow: 1,
              accessibility: false,
              adaptiveHeight: true,
              draggable: self.data('slick-no-controls') !== undefined ? false : true,
              swipe: self.data('slick-no-controls') !== undefined ? false : true,
              swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
              touchMove: self.data('slick-no-controls') !== undefined ? false : true
            });
          }

        });

      // other individual sliders goes here
      $('[js-main-page-slider]')
        .each(function(i, sl) {
          $(sl)
            .slick({
              autoplay: 20,
              dots: true,
              customPaging: function(slider, i) {
                return '<a class="fish__bone">';
              },
              vertical: $(sl)
                .attr('vertical') !== undefined,
              fade: $(sl)
                .attr('fade') !== undefined,
              arrows: false,
              prevArrow: slickNextArrow,
              nextArrow: slickPrevArrow,
              infinite: true,
              speed: 300,
              slidesToShow: 1,
              accessibility: false,
              adaptiveHeight: false,
              draggable: true,
              swipe: true,
              swipeToSlide: true,
              touchMove: true
            });
        });
    }

    //////////
    // MODALS
    //////////

    function initPopups() {
      // Magnific Popup
      var startWindowScroll = 0;
      $('[js-popup]')
        .magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'popup-buble',
          callbacks: {
            beforeOpen: function() {
              startWindowScroll = _window.scrollTop();
              // $('html').addClass('mfp-helper');
            },
            close: function() {
              // $('html').removeClass('mfp-helper');
              _window.scrollTop(startWindowScroll);
            }
          }
        });

      $('[js-popup-gallery]')
        .magnificPopup({
          delegate: 'a',
          type: 'image',
          tLoading: 'Загрузка #%curr%...',
          mainClass: 'popup-buble',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
          }
        });
    }

    function closeMfp() {
      $.magnificPopup.close();
    }

    ////////////
    // UI
    ////////////

    // textarea autoExpand
    _document
      .one('focus.autoExpand', '.ui-group textarea', function() {
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
      })
      .on('input.autoExpand', '.ui-group textarea', function() {
        var minRows = this.getAttribute('data-min-rows') | 0,
          rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
      });

    // Masked input
    function initMasks() {
      $('[js-dateMask]')
        .mask('99.99.99', { placeholder: 'ДД.ММ.ГГ' });
      $('input[type=\'tel\']')
        .mask('+7 (000) 000-0000', { placeholder: '+7 (___) ___-____' });
      $('input[data-js-timeMask]')
        .mask('00:00', {
          placeholder: $(this)
            .attr('placeholder')
        });
    }


    ////////////
    // SCROLLMONITOR - WOW LIKE
    ////////////
    function initScrollMonitor() {
      $('.wow')
        .each(function(i, el) {

          var elWatcher = scrollMonitor.create($(el));

          var delay;
          if ($(window)
              .width() < 768) {
            delay = 0;
          } else {
            delay = $(el)
              .data('animation-delay');
          }

          var animationClass = $(el)
            .data('animation-class') || 'wowFadeUp';

          var animationName = $(el)
            .data('animation-name') || 'wowFade';

          elWatcher.enterViewport(throttle(function() {
            $(el)
              .addClass(animationClass);
            $(el)
              .css({
                'animation-name': animationName,
                'animation-delay': delay,
                'visibility': 'visible'
              });
          }, 100, {
            'leading': true
          }));
          elWatcher.exitViewport(throttle(function() {
            $(el)
              .removeClass(animationClass);
            $(el)
              .css({
                'animation-name': 'none',
                'animation-delay': 0,
                'visibility': 'hidden'
              });
          }, 100));
        });

    }


    //////////
    // LAZY LOAD
    //////////
    function initLazyLoad() {
      _document.find('[js-lazy]')
        .Lazy({
          threshold: 500,
          enableThrottle: true,
          throttle: 100,
          scrollDirection: 'vertical',
          effect: 'fadeIn',
          effectTime: 350,
          // visibleOnly: true,
          // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
          onError: function(element) {
            console.log('error loading ' + element.data('src'));
          },
          beforeLoad: function(element) {
            // element.attr('style', '')
          }
        });
    }

    function initFixers() {
      const mobChrome = $('.mobile-chrome-fix-height');

      _window.on('orientationchange', function() {
        legacySupport();
        mobChrome.removeClass('mobile-chrome-fix-height-fix');
        setTimeout(function() {
          mobChrome.addClass('mobile-chrome-fix-height-fix');
        }, 10);
      });
    }

    //////////
    // CUSTOM FORM ELEMENTS
    //////////

    function initFormElements() {
      const $selects = _document.find('[js-select]');
      $selects.chosen({
        disable_search: true
      });
      $selects.each(function() { // Add data-class attribute from original select classes
        const classes = $(this)[0].classList;
        $(this)
          .next('.chosen-container')
          .attr('data-class', classes);
      });
    }

    //////////
    // BARBA PJAX
    //////////

    Barba.Pjax.Dom.containerClass = 'page';

    var FadeTransition = Barba.BaseTransition.extend({
      start: function() {
        Promise
          .all([this.newContainerLoading, this.fadeOut()])
          .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        var deferred = Barba.Utils.deferred();

        anime({
          targets: this.oldContainer,
          opacity: .5,
          easing: easingSwing, // swing
          duration: 300,
          complete: function(anim) {
            deferred.resolve();
          }
        });

        return deferred.promise;
      },

      fadeIn: function() {
        var _this = this;
        var $el = $(this.newContainer);

        $(this.oldContainer)
          .hide();

        $el.css({
          visibility: 'visible',
          opacity: .5
        });

        anime({
          targets: 'html, body',
          scrollTop: 0,
          easing: easingSwing, // swing
          duration: 150
        });

        anime({
          targets: this.newContainer,
          opacity: 1,
          easing: easingSwing, // swing
          duration: 300,
          complete: function(anim) {
            triggerBody();
            _this.done();
          }
        });
      }
    });

    // set barba transition
    Barba.Pjax.getTransition = function() {
      return FadeTransition;
    };

    Barba.Prefetch.init();
    Barba.Pjax.start();

    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

      if ($.fn.fullpage) {
        $.fn.fullpage.reBuild();
      }

      pageReady();
      closeMobileMenu();

    });

    // some plugins get bindings onNewPage only that way
    function triggerBody() {
      $(window)
        .scroll();
      $(window)
        .resize();
    }

    var isFullPage;
    var $mouse = createMouse();
    initDeinitFullpage();

    _window.on('resize', debounce(initDeinitFullpage, 100));

    function createMouse() {

      var $mouse;
      if ($mouse = $('.icon-mouse.down-button')) {
        return $mouse;

      }
      $mouse = $('<a href="#" class="icon-mouse down-button" />');
      $mouse.appendTo('body');
      $mouse.click(function() {
        $mouse.removeClass('mouse-showed');
        $.fn.fullpage.moveSectionDown();

      });
      return $mouse;
    }

    function initDeinitFullpage() {
      isFullPage = $('html')
        .hasClass('fp-enabled');
      var shouldBeFullpage = _window.width() > bp.tablet && _window.height() > 500;

      if (shouldBeFullpage) {
        if (isFullPage) {
          // console.log('Rebuild');
          $.fn.fullpage.reBuild();
          return;
        }

        // console.log('Init');
        const $fp = $('#fullpage');
        $fp.fullpage({
          anchors: ['home', 'about', 'menu', 'news', 'contacts'],
          paddingTop: '70px',
          paddingBottom: '60px',
          fixedElements: '#header, #footer',
          scrollOverflow: true,
          normalScrollElements: '#map',

          //Custom selectors
          sectionSelector: '.fp-sect',

          afterLoad: function(anchorLink, index) {
            if (index === 1) {
              $mouse.addClass('mouse-showed');
            } else {
              $mouse.removeClass('mouse-showed');
            }

            $('[js-fullpage-link]')
              .each(function(i, link) {
                $(link)
                  .click(function() {
                    $.fn.fullpage.moveTo($(this)
                      .attr('js-fullpage-link'));
                  });
              });
          },
          onSlideLeave: function(anchorLink, index) {
            if (index === 1) {
              $mouse.addClass('mouse-showed');
            } else {
              $mouse.removeClass('mouse-showed');
            }
          }
        });

        $fp.addClass('fullpage-active');
      } else {
        if (isFullPage) {
          // console.log('Destroy');
          $.fn.fullpage.destroy('all');
        }
      }
    }


    /// Select box

    const selectContainer = {
      $base: $('.select_container'),
      exists: function() {
        return !!this.$base;
      },
      init: function() {
        if (!this.exists()) {
          return null;
        }
        const _this = this;

        const $controls = this.$base.find('.select_container-control');

        const firstHref = $controls.eq(0)
          .attr('data-link');
        this.setActiveMenu(firstHref);

        $controls.click(function(event) {
          event.preventDefault();
          _this.setActiveMenu($(this)
            .attr('data-link'));
        });
      },
      getActive: function() {
        if (!this.exists()) {
          return null;
        }

        return parseInt(this.$base.attr('data-select-container-active'));
      },
      onMenuChange: function(newHref) {
      },
      menuCount: function() {
        if (!this.exists()) {
          return null;
        }

        return this.$base.find('.select_container-control').length;
      },
      setActiveMenu: function(href) {
        if (!this.exists()) {
          return null;
        }

        if (!this.$base.find(`.select_container-block[data-id=${href}]`)) {
          return;
        }

        this.$base.find(`.select_container-block`)
          .removeClass('select_container-block--active');
        this.$base.find(`.select_container-block[data-id=${href}]`)
          .addClass('select_container-block--active');

        this.$base.find(`.select_container-control`)
          .removeClass('select_container-control--active');
        this.$base.find(`.select_container-control[data-link=${href}]`)
          .addClass('select_container-control--active');

        this.onMenuChange(href);
      }
    };

    selectContainer.init();
    selectContainer.onMenuChange = function(href) {
      const $imgEl = $('.menu_select__image');

      if (!$imgEl) {
        return;
      }

      const $controller = $(`.select_container-control[data-link=${href}]`);

      const imageURL = $controller.attr('data-img');
      $imgEl.find('.menu_select__image-frame')
        .eq(0)
        .css('background-image', `url("${imageURL}")`);
      $imgEl.find('.menu_select__image_text')
        .eq(0)
        .text($controller.text());
    };

    const modalController = {
      showModal: function(href) {
        if (!href) {
          return;
        }

        const $modal = $('#' + href);

        if (!$modal.length) {
          console.error(`Modal with id ${href} doesn't exist`);
          return;
        }

        try {
          $.fn.fullpage.setAllowScrolling(false);
        } catch (e) {
        }

        $modal.addClass('b-modal--open');
        $('html, body')
          .addClass('global-modal--open');
      },
      closeAllModals: function() {
        try {
          $.fn.fullpage.setAllowScrolling(true);
        } catch (e) {
        }

        $('.b-modal--open')
          .removeClass('b-modal--open');
        $('html, body')
          .removeClass('global-modal--open');
      }
    };

    $('[js-modal-invoker]')
      .click(function() {
        modalController.showModal($(this)
          .attr('js-modal-invoker'));
      });

    $('[js-modal-closer]')
      .click(function() {
        modalController.closeAllModals();
      });

    $('video[autoplay]')
      .each(function() {
        this.play();
      });

    //////////
    // DEVELOPMENT HELPER
    //////////
    function setBreakpoint() {
      var wHost = window.location.host.toLowerCase();
      var displayCondition = wHost.indexOf('localhost') >= 0 || wHost.indexOf('surge') >= 0;
      if (displayCondition) {
        console.log(displayCondition);
        var wWidth = _window.width();

        var content = '<div class=\'dev-bp-debug\'>' + wWidth + '</div>';

        $('.page')
          .append(content);
        setTimeout(function() {
          $('.dev-bp-debug')
            .fadeOut();
        }, 1000);
        setTimeout(function() {
          $('.dev-bp-debug')
            .remove();
        }, 1500);
      }
    }

  });

// Map init
function initMap() {
  let map,
    marker;

  const mapElement = document.getElementById('map');

  if (!mapElement) {
    return;
  }

  const mapInitPos = {
    lat: 40.757483,
    lng: -73.971084
  };

  map = new google.maps.Map(mapElement, {
    center: mapInitPos,
    zoom: 17,
    mapTypeControlOptions: {
      mapTypeIds: []
    }, // here´s the array of controls
    disableDefaultUI: true, // a way to quickly hide all controls
    mapTypeControl: true,
    scaleControl: true,
    zoomControl: true,
    styles: [
      {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#e9e9e9' }, { 'lightness': 17 }]
      }, {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#f5f5f5' }, { 'lightness': 20 }]
      }, {
        'featureType': 'road.highway',
        'elementType': 'geometry.fill',
        'stylers': [{ 'color': '#ffffff' }, { 'lightness': 17 }]
      }, {
        'featureType': 'road.highway',
        'elementType': 'geometry.stroke',
        'stylers': [{ 'color': '#ffffff' }, { 'lightness': 29 }, { 'weight': 0.2 }]
      }, {
        'featureType': 'road.arterial',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#ffffff' }, { 'lightness': 18 }]
      }, {
        'featureType': 'road.local',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#ffffff' }, { 'lightness': 16 }]
      }, {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#f5f5f5' }, { 'lightness': 21 }]
      }, {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#dedede' }, { 'lightness': 21 }]
      }, {
        'elementType': 'labels.text.stroke',
        'stylers': [{ 'visibility': 'on' }, { 'color': '#ffffff' }, { 'lightness': 16 }]
      }, {
        'elementType': 'labels.text.fill',
        'stylers': [{ 'saturation': 36 }, { 'color': '#333333' }, { 'lightness': 40 }]
      }, {
        'elementType': 'labels.icon',
        'stylers': [{ 'visibility': 'off' }]
      }, {
        'featureType': 'transit',
        'elementType': 'geometry',
        'stylers': [{ 'color': '#f2f2f2' }, { 'lightness': 19 }]
      }, {
        'featureType': 'administrative',
        'elementType': 'geometry.fill',
        'stylers': [{ 'color': '#fefefe' }, { 'lightness': 20 }]
      }, {
        'featureType': 'administrative',
        'elementType': 'geometry.stroke',
        'stylers': [{ 'color': '#fefefe' }, { 'lightness': 17 }, { 'weight': 1.2 }]
      }
    ]
  });


  const infowindow = new google.maps.InfoWindow({
    content: `<div class="g-marker">
               <p>???</p>
              </div>`
  });

  marker = new google.maps.Marker({
    position: mapInitPos,
    icon: {
      url: '../img/mapMarker.png',
      scaledSize: new google.maps.Size(160, 120),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(80, 115)
    },
    map: map,
    title: 'Tokio',
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  google.maps.event.addListener(map, 'click', function() {
    infowindow.close();
  });
}