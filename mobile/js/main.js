//@codekit-prepend "libs/jquery.min.js";
//@codekit-prepend "libs/jquery.migrate.min.js";
//@codekit-prepend "libs/jquery.mousewheel.js";
//@codekit-prepend "libs/TweenMax.min.js";
//@codekit-prepend "libs/modernizr.custom.js";


var data;

function init(){
    
    //Load xml
    $.ajax({
        type  		: "GET",
        url 		: "./json/site.json",
        dataType 	: "jsonp",
        crossDomain : 'true',
        success 	: parseData,
        jsonpCallback: 'callback'
    });
    
    
}

function parseData(d){

    data = d;
    
    //Init copy
    $('#copytop').html(data.copy.top);
    $('#copybottom').html(data.copy.bottom);

    //Init thumbs
    var count = 0;
    for(var i=0;i<data.projects.length;i++){
        if(data.projects[i].thumb){
            var div = document.createElement('div');
            div.setAttribute('class','thumb');
            $('#projects')[0].appendChild(div);
            
            for(var j=0;j<data.projects[i].spots.length;j++){
                var img = new Image();
                if(data.projects[i].spots[j].thumb){
                    img.src = data.projects[i].spots[j].thumb;
                }
                else{
                    img.src = '../'+data.projects[i].spots[j].folder+'01.jpg';
                }
                div.appendChild(img);
                jQuery.data(img,'ident',i);
                jQuery.data(img,'spot',j);
            }

            /*var description = document.createElement('div');
            description.setAttribute('class','copy');
            description.innerHTML = data.projects[i].copybottom;
            div.appendChild(description);*/

            count++;
        }
    }
    
    //Init events
    $('#projects').find('img').click(function(){
        
        var index = jQuery.data(this,'ident');
        var spot = jQuery.data(this,'spot');
        getProject(index,spot);
        
    });
    
}

function getProject(ident,spot){
    $('#project-modal').html('');
    if(data.projects[ident].spots[spot].video){
        $('#project-modal').append('<iframe width='+$(window).width()+' height='+($(window).width()/(2.7))+' src="'+data.projects[ident].spots[spot].video+'" frameborder=0></iframe>');
    }
    if(data.projects[ident].spots[spot].video){
        $('#project-modal').append('<img src="'+data.projects[ident].spots[spot].folder+'01.jpg" />');
    }
    else{
        $('#project-modal').append('<img style="margin-top:50px" src="'+data.projects[ident].spots[spot].folder+'01.jpg" />');
    }
    $('#project-modal').append('<img src="'+data.projects[ident].spots[spot].folder+'02.jpg" />');
    $('#project-modal').append('<img src="'+data.projects[ident].spots[spot].folder+'03.jpg" />');
    $('#project-modal').append('<img src="'+data.projects[ident].spots[spot].folder+'04.jpg" />');
    var description = document.createElement('div');
    description.setAttribute('class','copy');
    description.innerHTML = data.projects[ident].copybottom;
    $('#project-modal')[0].appendChild(description);
    $('#project-modal').append('<img src="assets/img/ui/back.png" style="position:absolute;top:5px;left:5px;width:auto;" class="backBtn" />');

    TweenMax.set($('#project-modal')[0],{x:$(window).width(),autoAlpha:1});
    TweenMax.to($('#project-modal')[0],1,{x:0,ease:Expo.easeOut});

    $('#project-modal').find('.backBtn').click(closeProject);

}

function closeProject(){
    TweenMax.to($('#project-modal')[0],0.6,{x:$(window).width(),ease:Expo.easeOut,onComplete:function(){
        TweenMax.set($('#project-modal')[0],{autoAlpha:0});
        $('#project-modal')[0].innerHTML = '';
    }});
}

$(document).ready(init);