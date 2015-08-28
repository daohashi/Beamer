//removes url bar at top of screen (DEVELOPMENT PURPOSE ONLY - REMOVE BEFORE DEPLOYMENT)
window.scrollTo(0,1);
//VARIABLE DECLARATION FOR VARIABLES THAT DO NOT NEED HTML ELEMENTS
//x and y hold touch positions
//pos holds player position, tevent used for touchevents/mouse
var x, y, pos={}, mult, swiping = false, fading=false, tevent, clevel, cleveldata, replacelet,
offsetx,offsety,rows,cols,boxsize,current_screen="s_menu", moving=false, movecnt,
levels = new Array(


    "100gf",
    "200yogoof",
    "403yfgp",
    "201fobg",
    "322oofoooyor",
    "301foggyg",
    "130fgyy",
    "211gbfgbo", 
    "311yyfogoygo",
    "220fggbbr",
    "320oygggyfgo",
    "311oyoyggggf",
    "310ygbgbf",
    "210ybgofo",
    "301foyyogyoy",
    "412bfggybpg",
    "310ygroggfoy",
    "322fbgbgygyg",
    "301ybgfbr",
    "403yggpogfoyoyopoop",
    "302gfygbgygg",
    "320gyygoyfgg",
    "300ygyfgygyy",
    "311ybyogogrf",
    "310rgygbgrof",
    "312byobbfybo",
    "321yyggfyrbg",
    "311gyobgyfgg",
    "322fyygbgggy",
    "322fgyybgggr",
    "412gygyoyobypgf",
    "302fgygoyyyb",
    "321yygygbyfy",
    "302yfgbbbbyy",
    "312fbyggyyrg",
    "320ygryofbyy",
    "300ybbfbgyyy",
    "311gyyyggfgy",
    "311ybgfbgbgy",
    "300ygryfbgyb",
    "311ygfgggbyy",
    "301yoyboyrfb",
    "300rfyygbbgg",
    "300rggyobbyf",
    "302ybygbgbyf",
    "332pbyypbyyyfgp",
    "403gpybgoygbyfp",
    "411gyogbfyggpyy",
    "311gyopfyygyggy",
    "412byygyoybyofo",
    "422oogoorbbgbrfogoo",
    "332rgypyygggyfy",
    "320gyyogfopyyyg",
    "310yyoppogggyfy",
    "411gpyygggyyfgp",
    "320pgyypgogyfyy",
    "322fgyyyybgoogbryg",
    "302ygyybgggbygf",
    "412poopoyoopgyfpbgy",
    "301ypyyggooofyoryg",
    "420pygbfryggypg",
    "322fggygygpgygp",
    "311prgbggbporbf",
    "432ypgoggorroggfgpy",
    "410yyppyygppfyypyyy",
    "504gpyyygfyrpbgypb",
    "411fypppyggggggppyp",
    "420ygrooyyggyyooyfy",
    "411fyggpgyyggoppyyb",
    "433fbypbbypyobyopgy",
    "403yoyopgoygggfpgpy",
    "433pgyfyyypgygppppy",
    "411fgpygrobyoypyyyy",
    "433pyfbboyggygyrogp",
    "504gppyypypgpyyfyooygpoyoyop");

function postoind(x,y){ //converts position to index
    return y*cols+x;
}

function indtopos(ind){ //converts index to a position
    var x = (ind)%cols;
    return [x,(ind-x)/cols];
}

window.onload=function () {
    var ctx=$("#canvas")[0].getContext("2d"),WIDTH=$("#canvas").attr("width");
    
        //check touch support (DEVELOPMENT PURPOSE ONLY - REMOVE BEFORE DEPLOYMENT)
        if("ontouchstart" in document.documentElement){tevent="touchstart";}else{tevent="mousedown";}
    
    //change colour of all levels unavailable to player
    if(localStorage.getItem("level")){
    $("ul.levels a:gt("+ (localStorage.getItem("level") - 1)+ ")").addClass("disabled");
    }else{
     $("ul.levels a").addClass("disabled");
       }

    function drawLevel(){
        ctx.fillStyle="rgb(0,0,0)";
        ctx.fillRect(0,0,WIDTH,WIDTH);
        for(var r = 0; r<rows; r++){
            for(var c = 0; c<cols; c++){
                drawCell(c,r,1);
            }
        }
    }

    function drawCell(c,r,a){
        letter=cleveldata.substring(postoind(c,r),postoind(c,r)+1);
        var color;
        //draw the map
        
        if(letter=="f"){
            color="rgba(255,255,255,"+a+")";
        }else if(letter=="g"){
            color="rgba(0,255,0,"+a+")";
        }else if(letter=="r"){
            color="rgba(255,0,0,"+a+")";
        }else if(letter=="y"){
            color="rgba(255,255,0,"+a+")";
        }else if(letter=="b"){
            color="rgba(0,0,255,"+a+")";
        }else if(letter=="p"){
            color="rgba(255,0,255,"+a+")";
        }else if(letter=="o"){
            color="rgba(0,0,0,"+a+")";
        }
        
        if(c==pos[0]&&r==pos[1]){
           
           ctx.beginPath();
           ctx.fillStyle=color;
            ctx.arc((offsetx+(c)*boxsize),(offsety+(r)*boxsize),boxsize*.4,0,2*Math.PI,false);
            ctx.fill();
            ctx.beginPath(); ctx.fillStyle="rgba(0,0,0,"+a+")";
            
            ctx.arc((offsetx+(c)*boxsize),(offsety+(r)*boxsize),boxsize*.2,0,2*Math.PI,false);
            ctx.fill();
        }else{
        ctx.beginPath(); ctx.fillStyle="rgba(0,0,0,"+a+")";
            
            ctx.arc((offsetx+(c)*boxsize),(offsety+(r)*boxsize),boxsize*.5,0,2*Math.PI,false);
            ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle=color;
            ctx.arc((offsetx+(c)*boxsize),(offsety+(r)*boxsize),boxsize*.4,0,2*Math.PI,false);
            ctx.fill();
        }
        
    }

    function move(x,y){
    if(current_screen=="s_play"){
        var ind2=postoind(pos[0]+x,pos[1]+y);
        if(moving||pos[0]+x>=cols || pos[0]+x<0 || pos[1]+y>=rows || pos[1]+y<0 ||
            cleveldata.substring(ind2,ind2+1)=="o"){
            return;
    }else{
        moving=true;
            ind = postoind(pos[0],pos[1]); //old index
            cleveldata=cleveldata.substring(0,ind)+replacelet+cleveldata.substring(ind+1); //remove old string
            pos[0]=pos[0]+x; //chang position
            pos[1]=pos[1]+y;
            anim(x,y,5);
        }
        }
    }

     function anim(x,y,a){
        drawCell(pos[0]-x,pos[1]-y,(5-(a-1))/5);
        drawCell(pos[0],pos[1],(5-(a-1))/5);
        if(a<=1){
            var ind2=postoind(pos[0],pos[1]);
            letter=cleveldata.substring(ind2,ind2+1);
            replacelet="o";
            movecnt--;
            if(letter=="f"){
               mult=1; if(movecnt==0){ //won
                    if(clevel<levels.length){
                        clevel=parseInt(clevel)+1;
                        if(localStorage.getItem("level")<clevel){ localStorage.setItem("level",clevel);
                        $("ul.levels a:eq("+(localStorage.getItem("level")-1) + ")").removeClass("disabled");}
                        sfade("s_play",initLevel);
                    }else{
                        localStorage.setItem("level",levels.length+1);
                        sfade("win");
                    }
                }
            }else{
                setMult(letter);
            }
            moving=false;
        }else{
            if(moving){
                setTimeout(function(){
                    anim(x,y,a-1);
                },50);
            }
        }
    }

    function setMult(let){
        replacelet="o";
        if(let=="g"){
            mult=1;
        }else if(let=="r"){
            mult=2;
            replacelet="y";
        }else if(let=="y"){
            mult=2;
        }else if(let=="b"){
            mult=1;
            replacelet="g";
        }else if(let=="p"){
            mult=3;
        }
    }

    function countMoves(lvl){ //counts number of moves required to complete the level
        movecnt=0;
        for(var i=0;i<lvl.length;i++){
            var letter=lvl.substring(i,i+1);
            if(letter=="f"||letter=="o"){
            }else if(letter=="r"||letter=="b"){
                movecnt+=2;
            }else{
                movecnt+=1;
            }
        }
    }

    function initLevel(){
        cleveldata=levels[clevel-1].substring(3); //load level data into data variable
        rows=parseInt(levels[clevel-1].substring(0,1)); //get number of rows
        pos[0]=parseInt(levels[clevel-1].substring(1,2));
        pos[1]=parseInt(levels[clevel-1].substring(2,3));
        cols=(cleveldata.length)/rows; //get number of cols
        setMult(cleveldata.substr(postoind(pos[0],pos[1]),1));
        countMoves(cleveldata);
        $("div.mtitle").html(clevel); //update title
        if(rows==cols){ //no offset
            boxsize=WIDTH/rows;
            offsetx=boxsize/2;
            offsety=boxsize/2;
        }
        else if(rows>cols){ //offset x position
            boxsize=WIDTH/rows;
            offsetx=((WIDTH-cols*boxsize)/2)+boxsize/2;
            offsety=boxsize/2;
        }else{ //offset y position
            boxsize=WIDTH/cols;
            offsetx=boxsize/2;
            offsety=((WIDTH-rows*boxsize)/2)+boxsize/2;
        }
        drawLevel(); //draw level
        
    }

    //function that changes screen
    function sfade(fin, inbetween){
       if (!fading) {
        fading = true;
        var cur = current_screen;
        current_screen="";
        $("#"+cur).fadeToggle(400, function () {
            if(inbetween) inbetween();
            current_screen=fin;
            $("#"+fin).fadeToggle(400);
            fading = false;
        });
    }	
}

    //START ADDING EVENT LISTENERS
    $("#info").on(tevent, function () {sfade("s_info");}
    ); //MAIN MENU INFO BUTTON CLICK
    $("#packs").on(tevent, function () {sfade("s_packs");}); //MAIN MENU PACKS BUTTON CLICK
    $("#play").on(tevent,function(){
        if(localStorage.getItem("tut?")){
        clevel=localStorage.getItem("level"); //set level for loading
        if(clevel>levels.length){
            clevel=levels.length;
        }
        sfade("s_play",initLevel);
        
    }else{
        
        sfade("s_tut");
    }  
    }); //MAIN MENU PLAY BUTTON CLICK
    
    $("#info_back").on(tevent,function(){sfade("s_menu")}); //INFO SCREEN BACK BUTTON CLICK
    $("#win_back").on(tevent,function(){sfade("s_menu")}); //WIN SCREEN BACK BUTTON CLICK
    $("#packs_back").on(tevent,function(){sfade("s_menu")}); //PACKS SCREEN BACK BUTTON CLICK
    $("#levels_back1, #levels_back2, #levels_back3").on(tevent,function(){sfade("s_packs")}); //LEVELS SCREEN BACK BUTTON CLICK
    $("#tut_next").on(tevent,function(){sfade("s_tut2")});//TUTORIAL SCREEN NEXT BUTTON CLICK
    $("#tut_play").on(tevent,function(){
   localStorage.setItem("tut?", "true");
        localStorage.setItem("level","1"); clevel=1;
       $("ul.levels a:eq(0)").removeClass("disabled"); sfade("s_play",initLevel);});//TUTORIAL SCREEN NEXT BUTTON CLICK
    $("#play_back").on(tevent,function(){moving=false;sfade("s_menu");});

    $("#packs_one").on(tevent,function(){sfade("s_levels1")}); //PACKS SCREEN PACK ONE BUTTON CLICK
    $("#packs_two").on(tevent,function(){sfade("s_levels2")}); //PACKS SCREEN PACK ONE BUTTON CLICK
    $("#packs_three").on(tevent,function(){sfade("s_levels3")}); //PACKS SCREEN PACK ONE BUTTON CLICK
    $("ul.levels a").on(tevent,function(){ //LEVEL SCREEN BUTTONS
        if(!$(this).hasClass("disabled")){
            clevel=this.innerHTML;
            sfade("s_play",initLevel);
        }
    });
    $("#play_reset").on(tevent,function(){moving=false;sfade("s_play",initLevel);}); //PACKS SCREEN PACK ONE BUTTON CLICK

    //(DEVELOPMENT PURPOSE ONLY - REMOVE BEFORE DEPLOYMENT)
    $(document).on('keydown', function (e) {
        if (e.keyCode == 37) {
            move(-1*mult,0);
        } else if (e.keyCode == 38) {
            move(0,-1*mult);
        } else if (e.keyCode == 39) {
            move(1*mult,0);
        } else if (e.keyCode == 40) {
            move(0,1*mult);
        }
    });
    $(document).on('touchmove', function (e) {
        e.preventDefault();
    });
    $(document).on(tevent, function (e) {

        if (!swiping) {
            swiping = e.originalEvent.touches[0].identifier;
            x = e.originalEvent.touches[0].pageX;
            y = e.originalEvent.touches[0].pageY;
        }
    });
    $(document).on('touchend touchcancel', function (e) {

        if (e.originalEvent.changedTouches[0].identifier == swiping) {
            var difx = e.originalEvent.changedTouches[0].pageX - x;
            var dify = e.originalEvent.changedTouches[0].pageY - y;
            if (Math.abs(difx) > Math.abs(dify)) {
                if (Math.abs(difx) > 50) {
                    if (difx > 0) { //right
                        move(mult,0);
                    } else { //left
                        move(-mult,0);
                    }
                }
            } else {
                if (Math.abs(dify) > 50) {
                    if (dify > 0) { //down
                        move(0,mult);
                    } else { //up
                        move(0,-mult);
                    }
                }
            }
            swiping = false;
        }
    });
    $("#s_menu").fadeToggle(400);
}