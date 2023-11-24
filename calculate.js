function init() {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
  }
  
  function handleFileSelect(event){
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
  }
  
let filelist = [];
let statlist = [];

var initialValueList = [100.00, 95.00, 90.00, 85.00, 80.00, 75.00, 70.00, 65.00, 60.00, 55.00, 50.00, 0.00]
let Histrogramlist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// var alertime = 0;
var loadfile = false;

  
function handleFileLoad(event) {
  
 
  while (filelist.length) {
    filelist.pop();
  }
    
  console.log(event);
  
  // // console.log(event.target.result);
  // document.getElementById('fileContent').textContent = event.target.result;
  for (let i = 0; i < Histrogramlist.length; i++){
    Histrogramlist[i] = 0;
  }
  
  
  const temp = (event.target.result).split('\n');

  for (let i = 1; i < temp.length; i++) {
    let object = temp[i].split(",").map(item => item.trim());
    filelist.push(object);
  }
  
  statlist = getStat(filelist);
  loadfile = true;

  writeStat(statlist);

  getHistrogram(filelist, Histrogramlist);

  displayHistogram(Histrogramlist);

 
}

    // handle the input 
    var inputlist = document.querySelectorAll(".userinput")
  
    for (var i = 0; i < inputlist.length; i++) {
    
        //handle invalid input
      var node = inputlist[i];
      node.addEventListener('blur', checking(node, initialValueList[i], i));//////////////
    
    }
    
    function checking(node, initial, index) {
      return function () {
        checkvalid(node, initial, index);/////////
      };
    }

//handle invalid input////////////
function checkvalid(event, initial, index) {

  var temp = parseFloat(event.value);
  event.value = temp.toFixed(2);

  if (isNaN(temp)) {
    event.value = initial.toFixed(2);

  } else {
    var check1 = true;
    var check2 = true;

    for (let j = 0; j < index; j++){
      check1 = (temp >= initialValueList[j]) ? false : true;
    }

    for (let j = 11; j > index; j--){
      check2 = (temp <= initialValueList[j]) ? false : true;
    }

    // if ((index == 0 || temp > 100) ||(index == 11 || temp < 0) ){
    //   check1 == false;
    //   check2 = false;

    // }

    if (check1 == false || check2 == false) {
      event.value = initialValueList[index].toFixed(2);
      // alertime += 1;
      alert("Please make sure the range won't overlap");
    } else {
      initialValueList[index] = temp;
   
    }
    if (loadfile == true) {
      getHistrogram(filelist, Histrogramlist);
      displayHistogram(Histrogramlist);
    }

  }
}


function writeStat(result) {

  document.getElementById("highest").innerHTML = result[0][0][0] + "(" + String(result[0][0][1]) + "%)";
  document.getElementById("lowest").innerHTML = result[1][0][0] + "(" + String(result[1][0][1]) + "%)";
  document.getElementById("mean").innerHTML = result[2][0];
  document.getElementById("median").innerHTML = result[3][0];
  const temp = document.querySelectorAll("#stat-table td");
  //padding left 
  temp.forEach(td => {
    td.style.paddingLeft= '30%';
  });

}

function getStat(filelist) {
  if (filelist == []) {
    return [];
  }

  //get total
  let total = +filelist[0][1];

  for (let i = 1; i < filelist.length; i++){
    total += +(filelist[i][1]);
    
  }
  
  let result = [];

  //sorting 
  let sortList = filelist;
  for (let i = 0; i < (sortList.length)-1; i++){
    let temp = i;
    for (let j = i + 1; j < sortList.length; j++){
      if (+sortList[j][1] < +sortList[temp][1]) {
        temp = j;
      }
    }

    [sortList[temp], sortList[i]] = [sortList[i], sortList[temp]];
    
  }

  //restore into a list 
  result.push([sortList[sortList.length-1]]);
  result.push([sortList[0]]);
  result.push([(total / +filelist.length).toFixed(2)]);

//store the median 
if (Number(sortList.length) % 2 != 0) {
    let index = parseInt((Number(sortList.length) / 2));
    let median = sortList[index][1];
    result.push([median]);
} else {
    let index = parseInt((Number(sortList.length) / 2));
    let median = (+sortList[sortList.length / 2][1] + +sortList[sortList.length / 2 -1][1]) / 2;
    result.push([median]);
}
  
  return result;

}

//initialValueList = [100.00,95.00,90.00,85.00,80.00,75.00,70.00,65.00,60.00,55.00,50.00,0.00]
function getHistrogram(filelist, initialList) {

  for (let i = 0; i < filelist.length; i++) {
    let temp = +filelist[i][1];
    
    if (temp > initialValueList[0]) {
      return;
    }

    if (temp >= initialValueList[1]) {
    // if (temp <= initialValueList[0] && temp >= initialValueList[1]) {
      Histrogramlist[0] += 1;
 
    } else if (temp >= initialValueList[2]) {
      Histrogramlist[1] += 1;
    } else if (temp >= initialValueList[3]) {
      Histrogramlist[2] += 1;
    } else if (temp >= initialValueList[4]) {
      Histrogramlist[3] += 1;
      
    } else if (temp >= initialValueList[5]) {
      Histrogramlist[4] += 1;
      
    } else if (temp >= initialValueList[6]) {
      Histrogramlist[5] += 1;
      
    } else if (temp >= initialValueList[7]) {
      Histrogramlist[6] += 1;

    } else if (temp >= initialValueList[8]) {
      Histrogramlist[7] += 1;
      
    } else if (temp >= initialValueList[9]) {
      Histrogramlist[8] += 1;
     
    } else if (temp >= initialValueList[10]) {
      Histrogramlist[9] += 1;
      
    } else if (temp >= initialValueList[11]) {
      Histrogramlist[10] += 1;
    }
  }
}

function displayHistogram(alist) {
  
  var histogramTableData = document.querySelectorAll("#histogram-table tr");
  var check = document.querySelector("#histogram-table").className;

  
  for (let i = 0; i < Histrogramlist.length; i++){

    if (check == "visit") {

      var temp = document.querySelectorAll("#histogram-table tr")[i];
      var deletenode = temp.lastChild;
      console.log("check");
      deletenode.remove();
      
    } else {

          var exchange = document.querySelector("#histogram-table");
          exchange.classList.remove("nonvisit");
          exchange.classList.add("visit");
      
    }
    
    var node = "";
    for (let j = 0; j < Histrogramlist[i]; j++){
      // node += "1";
      node += "&#10003 ";
   

    }
    console.log(Histrogramlist[i]);
    

      var temp2 = document.createElement('td');
      temp2.innerHTML = node;
   
      temp2.classList.add("histogram-data");
      if (i == 0 || i == 1 || i == 2) {
        temp2.style.color = "blue"; 
      } else if (i == 3 || i == 4 || i == 5) {
        temp2.style.color = "orange"; 
      } else if(i == 6 || i == 7 || i == 8){
        temp2.style.color = "purple"; 
      } else {
        temp2.style.color = "red"; 
      }
     
      
      histogramTableData[i].appendChild(temp2);
      // document.querySelector("#histogram-table td").style..

    

  }

  for (let i = 0; i < Histrogramlist.length; i++){
    Histrogramlist[i] = 0;
  }
  
  // if (check != "visit") {
  //   var exchange = document.querySelector("#histogram-table");
  //   exchange.classList.remove("nonvisit");
  //   exchange.classList.add("visit");
    
  // }

}








