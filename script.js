function openPage(name){
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for(i=0; i<tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    document.getElementById(name).style.display = "flex";
}

function openNewTab(url){
    window.open(url, "_blank");
}

document.getElementById("home").click();