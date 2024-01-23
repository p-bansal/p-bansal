function openPage(name){
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for(i=0; i<tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    document.getElementById(name).style.display = "flex";
}

document.getElementById("home").click();