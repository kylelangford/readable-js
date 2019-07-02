(function () {

  // // Headroom
  // $(".mast-head").headroom({
  //   onTop : function() {
  //     $('.hint').show();
  //   },
  //   offset : 100
  // });

  // grab an element
  var myElement = document.querySelector(".message");
  // construct an instance of Headroom, passing the element
  var readable  = new Readable(myElement);
  // initialise
  readable.init(); 

  // Tween Page Load
  $("body").addClass( "tween" );

  // Menu Trigger
  $('.primary-menu-btn').on('click touchstart',function (e) {
    $('nav.primary').toggleClass('overlay');
    $(this).toggleClass('active');
    $('.mast-head').toggleClass('active');
    $('.site-logo').toggleClass('active');
    e.preventDefault();
  });

})();

