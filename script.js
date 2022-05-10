function openSite(){
  
  document.getElementById("codeDiv").style.display = "none";
  document.getElementById("buttonholder").style.display = "none";
  document.getElementById("projectholder").style.display = "flex";
  var projects = document.getElementsByClassName("projects");
  //animates projects
  var counter = 1;
  for(el of projects){
    el.classList.add("animated");
  }
}

function output(){
  console.log("Out");
}
