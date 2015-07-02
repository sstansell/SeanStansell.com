  // Stick menu
  $(".menu").sticky({
                      topSpacing:0,
                      className: "menu-stuck"
                    });

  // Menu Scroll to content and Active menu
  var lastId,
    topMenu = $("#menu"),
    topMenuHeight = topMenu.outerHeight()+145,
    menuItems = topMenu.find("a"),
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

    //animates the scroll to the content when you click on the menu
   $('.menu a').bind('click', function(e) {
	   e.preventDefault();
	   var target = $(this).attr("href");
  	 $('html, body').stop().animate({ scrollTop: $(target).offset().top-60 }, 1000, function() {

  	 });
			
	   return false;
   });
   //sets the active menu item as you scroll through the page
  $(window).scroll(function(){
   var fromTop = $(this).scrollTop()+topMenuHeight;
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)
       return this;
   });

   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;
       menuItems
         .parent().removeClass("active")
         .end().filter("[href=#"+id+"]").parent().addClass("active");
   }                   
  });  
  

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    
    //$(".footer").css( "position", "relative" );
    //$(".contact").css( "marginBottom", "400px" );

}
else 
{

  // FadeTo elements
  if ( $(window).width() > 1023) {  

    //tiles = $("h2, h3, .column-one, .column-two, .column-three, .grid li, .contact .content .form, .contact .content .contact-text ").fadeTo(0, 0);
    tiles = $(".what, .portfolio, .bio, .contact").fadeTo(0, 0);

    $(window).scroll(function(d,h) {
      tiles.each(function(i) {
          a = $(this).offset().top + $(this).height();
          b = $(window).scrollTop() + $(window).height() + 500;
          if (a < b) $(this).fadeTo(750,1);
      });
    });

  }

}
/** loads images after initial pageload
 imageGroup is a param that looks in the data-imageGroup attribute 
 to allow you to load subgroups of images
 */
function loadImages(imageGroup) {
  var imgDefer = document.getElementsByTagName('img');
  for (var i=0; i<imgDefer.length; i++) {
  if(imgDefer[i].getAttribute('data-src')&&imgDefer[i].getAttribute('data-imageGroup')===imageGroup) {
  imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
} } }
window.onload = loadImages('main');

//a bunch of stuff to do when we open a modal
$(document).on('opening', '.remodal', function () {
  //get the ID of the modal we're opening
  var remodalId = this.getAttribute('data-remodal-id');
  //load the images for the modal (don't do this at page load so we don't waste bandwidth & time)
  loadImages(remodalId);
  //start the slideshow
  var slideContainer = '.' + remodalId + '-slides';
  makeBSS(slideContainer, {
    swipe : true            
  });
});
/*  //Menu mobile click
  $( ".icon" ).click(function() {
    $( " ul.menu-click" ).slideToggle( "slow", function() {
    // Animation complete.
    });
  });
*/

/*$(window).load(function(){

  $(".preloader").delay(1000).fadeOut("slow");

  // Parallax
  if ($('.parallax-background').length) {
    $(".parallax-background").parallax();
  }
  
  // Parallax
  if ($('.parallax-background-partners').length) {
    $(".parallax-background-partners").parallax();
  }  

});*/
