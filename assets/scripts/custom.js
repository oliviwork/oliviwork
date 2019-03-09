/*≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ { global } ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡*/

var fun_global = function(){
  var $this = this,
      $unit = window.location.pathname.split('.html')[0].substr(1),
      $hash = window.location.hash;

  /*banner height*/
  this.bannerH = function(){
    var $h = $('#banner').height();
    $('#main').css({ marginTop: $h });
    return $h;
  };

  /*loading*/
  this.loading = function(){
    $this.bannerH();
    if($hash){
      var move = $('#slidePage > section').eq(Number($hash.split('#')[1])-1).offset().top;
      $this.slidePage(move, true);
    };
    $('#loading').fadeOut('fast',function(){
      $(this).remove();
    });
  };

  /*slidePage*/
  this.slidePage = function(move,isTransition,callback){
    var $speed;
    isTransition ? $speed = 0 : $speed = 400;
    $('body,html').stop(true,false).animate({ scrollTop: move - $('#subMenu').height() }, $speed,function(){
      if(typeof callback === "function"){
        callback();
      }
    });
  };

  /*menu*/
  this.menu = function(){
    //-- hamburger
    $('.btn-hamburger').on('click', function (event) {
      event.preventDefault();
      var hamburger = $('.menu--effect, #menu');
      hamburger.hasClass('open') ? hamburger.removeClass('open') : hamburger.addClass('open');
    });
    //-- navBtn
    var navBar = $('#menu,#footer .sitemap');
    navBar.on('click', 'a', function (event) {
      var $href = $(this).attr('href');
      if($href.indexOf('#')>0 && $unit === $href.split('.html')[0]){
        event.preventDefault();
        var current = Number($href.split('#')[1]);
        window.location.hash = current;
        $this.slidePage($('#slidePage > section').eq(current-1).offset().top);
      }
    });
  }

  /*subMenu*/
  this.subMenu = {
    isfixed:function(){
      ($(window).scrollTop() >= $('#main').offset().top)? $('#subMenu').addClass('fixed') : $('#subMenu').removeClass('fixed');
    },
    currentBtn:function(idx){
      clearTimeout(this.timer);
      this.timer = setTimeout(function(){
        $('#subMenu a').eq(idx).addClass('active').siblings('a').removeClass();
        window.location.hash = idx+1;
      });
    },
    onpress:function(){
      var menu = $('#subMenu');
      menu.on('click','a',function(){
        var current = $(this).index();
        $this.slidePage($('#slidePage > section').eq(current).offset().top);
      });
    },
    scrollPage:function(){
      var $that = this;
      var scrolling = $(window).scrollTop();
      $("#slidePage > section").each(function (idx, elm){ 
        if(scrolling > $(elm).offset().top - ($('#subMenu').innerHeight() + 10)){
          $that.currentBtn(idx);
        }
      });
    }
  }
 
  function init(){
    $this.menu();
    if($('#slidePage').length >0){
      $this.subMenu.onpress();
    }
  }
  init();

}

/*≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ { page } ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡*/;

/*index*/
var fun_index = function(){

  /*device*/
  var isiPad = /ipad/i.test( navigator.userAgent.toLowerCase()),
      isiPhone = /iphone/i.test( navigator.userAgent.toLowerCase()),
      isiDevice = /ipad|iphone|ipod/i.test( navigator.userAgent.toLowerCase()),
      isAndroid = /android/i.test( navigator.userAgent.toLowerCase()),
      isWindowsPhone = /windows phone/i.test( navigator.userAgent.toLowerCase()),
      isBlackBerry = /blackberry/i.test( navigator.userAgent.toLowerCase()),
      $device;
  
      if ( isiPad || isiPhone || isiDevice || isAndroid || isWindowsPhone || isBlackBerry ) {
        $device = 'mobile';
      } else {
        $device = 'pc';
      };
 

  /*banner*/
  var $pic = $('.slider-pic'),
      $slogan = $('.slider-slogan'),
      $nav = $('.slider-nav'),
      $autoPlay = ($('.player',$pic).eq(0).parent().index() == 0 && $device == 'pc') ? false :  true;


  $pic.on('init',function(slick){
    initVideo = function(){
      $('.slick-slide:not(.slick-cloned) .player').each(function(i,elem){
        embedYoutube(i,elem);
      });
    }
    if(!$autoPlay){
      setTimeout(function(){
        ytPlayers[Object.keys(ytPlayers)[0]].playVideo().setVolume(0);
      },2000)
    }
  })
  .on('setPosition',function(){
    gfun.bannerH();
    $('.slick-track iframe').height($(window).width()/2.206896551724138);
  })
  .on('beforeChange',function(){
    $('> li', $slogan).removeClass('active');
    $.each(ytPlayers,function(idx,obj){
      obj.stopVideo();
    });
  })
  .on('afterChange',function(slick, slide){
    var current = slide.currentSlide;
    $('> li', $slogan).eq(current).fadeIn(function(){
      $(this).removeAttr('style').addClass('active');
    });
    $('a', $nav).eq(current).addClass('active').siblings('a').removeClass('active');
    
    if($('[data-slick-index="'+ current +'"] .player', $pic).length >0 && $device == 'pc'){
      var $key = $('[data-slick-index="'+ current +'"] .player', $pic).attr('videoid');
      ytPlayers[$key].playVideo().setVolume(0);
      $pic.slick('slickPause');
    }

  })
  .slick({ slidesToShow: 1,slidesToScroll: 1,arrows: false, autoplay: $autoPlay });

  $nav.on('click','a',function(){
    var idx = $(this).index();
    $pic.slick('slickGoTo',idx);
  });

};

/*quality*/
var fun_quality = function(){
  $('[data-fancybox*="images"]').fancybox({
    buttons : [ 'slideShow', 'zoom', 'fullScreen', 'close' ]
  });
};

/*classic*/
var fun_classic = function(){

  $('[data-fancybox*="images"]').fancybox({
    buttons : [ 'slideShow', 'zoom', 'fullScreen', 'close' ]
  });

  var tag = $('#classic.content');
  var list = $(".list",tag);
  $(".btn-more",tag).on('click', function () {
    list.addClass('loading');
    $.getJSON( "./_temp/data/classic.json")
    .done(function( res ){
      var items = [];
      $.each( res, function( key, val ) {
        items.push('<li class="unvisible"><img src="'+val.img+'" alt=""><h6>'+val.title+'</h6><a class="bdbox" href="classic_content.html">MORE</a></li>');
      });
      list.append(items.join(""));
      list.removeClass('loading');
      gfun.slidePage($(".unvisible",list).offset().top-50,false,function(){
        $(".unvisible",list).each(function(idx,elm){
          $(elm).delay(idx*100).animate({ opacity: 1 },400,function(){
            $(this).removeClass('unvisible');
          });
        });
      });
    })
    .fail(function( jqxhr, textStatus, error ){
      list.removeClass('loading');
      list.after('<p class="nodata">資料已全部載入完畢！</p>')
      $(".nodata",tag).stop(true,false).animate({ opacity: 1 },200,function(){
        setTimeout(function(){
          $('.nodata',tag).stop(true,false).fadeOut(function(){
            $(this).remove();
          });
        },4000);
      });
    });
  });
};

/*news*/
var fun_news = function(){
  $('[data-fancybox*="images"]').fancybox({
    buttons : [ 'slideShow', 'zoom', 'fullScreen', 'close' ]
  });
};

/*service*/
var fun_service = function(){
  $('.rule').on('click','a',function(event){
    event.preventDefault();
    $('.rule .txt').slideToggle();
  });
};

/*≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ { readay } ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡*/

$(function(){

  /*init*/
  gfun = new fun_global();

  /*load*/
  $(window).load(function () {
    gfun.loading();
  });

  /*resize*/
  $(window).resize(function () { 
    gfun.bannerH();
  });

  /*scroll*/
  $(window).scroll(function(){
    if($('#subMenu').length > 0){
      gfun.subMenu.isfixed();
      gfun.subMenu.scrollPage();
    }
  });


});
