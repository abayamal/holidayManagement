// Code from the Admin Template start
(function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);
// Code from the Admin Template end

//my code (@mzmarkib)

$(document).ready(function() {

    


    // Calendar initialization and events
    var calendar = $('#calendar').fullCalendar({
     editable:true,
     header:{
      left:'prev,next today',
      center:'title',
      right:'month,agendaWeek,agendaDay'
     },
     events: 'app/load.php',
     selectable:true,
     selectHelper:true,
     select: function(start, end, allDay)
     {
      var title = prompt("Enter Event Title");
      if(title)
      {
       var start = $.fullCalendar.formatDate(start, "Y-MM-DD");
       var end = $.fullCalendar.formatDate(end, "Y-MM-DD");
       $.ajax({
        url:"app/insert.php",
        type:"POST",
        data:{title:title, start:start, end:end},
        success:function()
        {
         calendar.fullCalendar('refetchEvents');
         load();
        }
       })
      }
     },
     editable:true,
     eventResize:function(event)
     {
      var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD");
      var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD");
      var title = event.title;
      var id = event.id;
      $.ajax({
       url:"app/update.php",
       type:"POST",
       data:{title:title, start:start, end:end, id:id},
       success:function(){
        calendar.fullCalendar('refetchEvents');
        load();
       }
      })
     },
 
     eventDrop:function(event)
     {
    //   var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD HH:mm:ss");
    //   var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD HH:mm:ss");
    //   var title = event.title;
    //   var id = event.id;
      updateEvent(event);
     },
 
     eventClick:function(event)
     {
      if(confirm("Are you sure you want to remove it?"))
      {
       deleteEvent(event);
      }
     },
 
    });

    function updateEvent(event){
        var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD");
        var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD");
        var title = event.title;
        var id = event.id;
        $.ajax({
            url:"app/update.php",
            type:"POST",
            data:{title:title, start:start, end:end, id:id},
            success:function()
            {
                calendar.fullCalendar('refetchEvents');
                load();
            }
        });
    }

    function deleteEvent(event){
        var id = event.id;
        $.ajax({
            url:"app/delete.php",
            type:"POST",
            data:{id:id},
            success:function()
            {
            calendar.fullCalendar('refetchEvents');
            load();
            }
        })
    }

    load();
    //load events to the list in the right    
    function load(){

        // refresh calendar 
        calendar.fullCalendar('refetchEvents');

        $.ajax({
            url:"app/load.php",
            type:"POST",
            dataType: "json",
            success:function(data)
            {
                $(".holidayList").empty();
                for(var i=1; i<data.length; i++){

                    // var start = $.formatDate(data[i].start, "Y-MM-DD");
                    // console.log(start);
                    $(".holidayList").append("<a href='#' class='list-group-item list-group-item-action flex-column align-items-start'> <div class='d-flex w-100 justify-content-between'> <h5 class='mb-1'>" + data[i].title + "</h5></div> <p class='mb-1'>start:  " + data[i].start+ " | End:  " + data[i].end+ "</p></a>");
                    
    
    
                }
            }
        });
    }



   });