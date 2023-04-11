jQuery(function($){
    $("#open-btn").on('click',function() {
      console.log("OPEN!")
      $("#overlay").fadeIn();
    });
    $("#open-btn1").on('click',function() {
      $("#overlay1").fadeIn();
    });
    $(".overlay-event").on('click',function() {
      $("#overlay").fadeOut();
    });
    $(".overlay-event").on('click',function() {
        $("#overlay1").fadeOut();
      });
    // バブリングを停止
    $("#overlay-inner1").on('click',function(event){
      event.stopPropagation();
    });

});