(function($) {
  // Search ------------
  var $searchWrap = $(".search-form-wrap"),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function() {
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback) {
    setTimeout(function() {
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $(".nav-item-search").on("click", function() {
    if (isSearchAnim) return;
    startSearchAnim();
    $(".o2jsearch").css("width", $(".local-search").width() + 20 + "px");
    $searchWrap.addClass("on");
    stopSearchAnim(function() {
      $(".local-search-input").focus();
    });
  });

  $(document).mouseup(function(e) {
    var _con = $(".local-search");
    if (!_con.is(e.target) && _con.has(e.target).length === 0) {
      $searchWrap.removeClass("on");
    }
  });

  // 移动设备侦测
  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    }
  };
  // 建议在移动端不初始化，其实 /search.xml 文件还挺大的，
  if ($(".local-search").size() && !isMobile.any()) {
    $.getScript("/js/search.js", function() {
      searchFunc("/search.xml", "local-search-input", "local-search-result");
    });
  }

  // Share ------------
  $("body")
    .on("click", function() {
      $(".article-share-box.on").removeClass("on");
    })
    .on("click", ".article-share-link", function(e) {
      e.stopPropagation();

      var $this = $(this),
        url = $this.attr("data-url"),
        encodedUrl = encodeURIComponent(url),
        id = "article-share-box-" + $this.attr("data-id"),
        offset = $this.offset();

      if ($("#" + id).length) {
        var box = $("#" + id);

        if (box.hasClass("on")) {
          box.removeClass("on");
          return;
        }
      } else {
        var html = [
          '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
          '<a href="https://twitter.com/intent/tweet?url=' +
            encodedUrl +
            '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
          '<a href="https://www.facebook.com/sharer.php?u=' +
            encodedUrl +
            '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
          '<a href="http://pinterest.com/pin/create/button/?url=' +
            encodedUrl +
            '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
          '<a href="https://plus.google.com/share?url=' +
            encodedUrl +
            '" class="article-share-google" target="_blank" title="Google+"></a>',
          "</div>",
          "</div>"
        ].join("");

        var box = $(html);
        $("body").append(box);
      }
      $(".article-share-box.on").hide();

      box
        .css({
          top: offset.top + 25,
          left: offset.left
        })
        .addClass("on");
    })
    .on("click", ".article-share-box", function(e) {
      e.stopPropagation();
    })
    .on("click", ".article-share-box-input", function() {
      $(this).select();
    })
    .on("click", ".article-share-box-link", function(e) {
      e.preventDefault();
      e.stopPropagation();

      window.open(
        this.href,
        "article-share-box-window-" + Date.now(),
        "width=500,height=450"
      );
    });

  // fancybox
  if ($.fancybox) {
    $("[data-fancybox]").fancybox({
      protect: true
    });
  }

  // lazyload
  $(".lazy").lazyload();

  //页面加载执行事件
  $(document).ready(function($) {
    if ($("body").width() > 1200) {
      $(".o2jbox").css(
        {
          width: $(".content").width() + 18 + "px"
        },
        {
          "overflow-y": "scroll"
        }
      );
      $(".o2jbox").css({
        "overflow-y": "scroll"
      });
    } else {
      $(".o2jbox").css("width", "100%");
      $(".o2jbox").css({
        "overflow-y": "scroll"
      });
    }
    $(window).resize(function() {
      if ($("body").width() > 1200) {
        $(".o2jbox").css({
          width: $(".content").width() + 18 + "px"
        });
        $(".o2jbox").css({
          "overflow-y": "scroll"
        });
      } else {
        $(".o2jbox").css("width", "100%");
        $(".o2jbox").css({
          "overflow-y": "scroll"
        });
      }
    });
    $(".anchor").click(function(event) {
      event.preventDefault();
      var top = $(this.hash).offset().top;
      $(".o2jbox").animate(
        {
          scrollTop: top
        },
        500
      );
    });
  });

  // To top
  (function($) {
    // When to show the scroll link
    // higher number = scroll link appears further down the page
    var upperLimit = 1000;

    // Our scroll link element
    var scrollElem = $("#totop");

    // Scroll to top speed
    var scrollSpeed = 1600;

    // Show and hide the scroll to top link based on scroll position
    // scrollElem.hide();
    $(".o2jbox").scroll(function() {
      var scrollTop = $(".o2jbox").scrollTop();
      if (scrollTop > upperLimit) {
        $(scrollElem)
          .stop()
          .fadeTo(300, 1); // fade back in
      } else {
        $(scrollElem)
          .stop()
          .fadeTo(300, 0); // fade out
      }
    });

    // Scroll to top animation on click
    $(scrollElem).click(function() {
      $(".o2jbox").animate(
        {
          scrollTop: 0
        },
        scrollSpeed
      );
      return false;
    });
  })(jQuery);

  // Mobile nav
  var $content = $(".content"),
    $sidebar = $(".sidebar"),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;
  // if($('body').width() > 1200){
  //     $('.o2jbox').css("width",($content.width() + 18) +'px')
  // }
  var startMobileNavAnim = function() {
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function() {
    setTimeout(function() {
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  };

  var cont = $("#landlord");
  var contW = $("#landlord").width();
  var contH = $("#landlord").height();
  var startX, startY, sX, sY, moveX, moveY, disX, disY;
  var winW = $(window).width();
  var winH = $(window).height();
  cont.on({
    //绑定事件
    touchstart: function(e) {
      e.preventDefault();
      startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
      startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
      //console.log("startX="+startX+"************startY="+startY);
      sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
      sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
      //console.log("sX="+sX+"***************sY="+sY);
      leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
      rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
      topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
      bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
    },
    touchmove: function(e) {
      e.preventDefault();
      moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
      moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
      //console.log("moveX="+moveX+"************moveY="+moveY);
      if (moveX < leftX) {
        moveX = leftX;
      }
      if (moveX > rightX) {
        moveX = rightX;
      }
      if (moveY < topY) {
        moveY = topY;
      }
      if (moveY > bottomY) {
        moveY = bottomY;
      }
      $(this).css({
        left: moveX + sX - startX,
        top: moveY + sY - startY
      });
    },
    mousedown: function(ev) {
      var patch = parseInt($(this).css("height")) / 2;
      //console.log(patch);
      $(this).mousemove(function(ev) {
        var oEvent = ev || event;
        //console.log(oEvent.target);
        var oX = oEvent.clientX;
        var oY = oEvent.clientY;
        var t = oY - patch;
        var l = oX - patch;
        var w = $(window).width() - $(this).width();
        var h = $(window).height() - $(this).height();
        if (t < 0) {
          t = 0;
        }
        if (l < 0) {
          l = 0;
        }
        if (t > h) {
          t = h;
        }
        if (l > w) {
          l = w;
        }
        $(this).css({ top: t, left: l });
      });
      $(this).mouseup(function() {
        $(this).unbind("mousemove");
      });
    }
  });

  $("#menubtn").on("click", function() {
    if (isMobileNavAnim) return;
    startMobileNavAnim();
    $content.toggleClass("on");
    $sidebar.toggleClass("on");
    stopMobileNavAnim();
  });

  $($content).on("click", function() {
    if (isMobileNavAnim || !$content.hasClass("on")) return;
    $content.removeClass("on");
    $sidebar.removeClass("on");
  });
})(jQuery);
