function openSite(){
    document.getElementById('threat').style.display = "none";
    setInterval(check, 1000);
}


function check(){
    console.log("This shit works");
    var date =  new Date(Date.parse("Thu Sep 22 2022 23:29:00 GMT-0600 (Mountain Daylight Time)"));
    if(Date.now() > date){
        document.getElementById('date').style.display = "none";
        document.getElementById('threat').style.display = "flex";
        document.getElementById('threat').style.color = "red";
        document.getElementById('body').style.background = "black";
    }
}