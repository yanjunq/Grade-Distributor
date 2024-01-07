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
      node.addEventListener('blur', checking(node, initialValueList[i], i));
    
    }
    
    function checking(node, initial, index) {
      return function () {
        checkvalid(node, initial, index);
      };
    }

//handle invalid input
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


    if (check1 == false || check2 == false) {
      event.value = initialValueList[index].toFixed(2);
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
  sortList.sort((a, b) => {
    +a[1] - +b[1];
  })

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

function getHistrogram(filelist) {

  for (let i = 0; i < filelist.length; i++) {
    let temp = +filelist[i][1];
    
    if (temp > initialValueList[0]) {
      return;
    }
    
    for (let j = 0; j <= 10; j++) {
      if (temp >= initialValueList[j + 1]) {
        Histrogramlist[j] += 1;
        j = 11;
      }
    }
  }
}

  function displayHistogram() {
  
    var histogramTableData = document.querySelectorAll("#histogram-table tr");
    var tableClass = document.querySelector("#histogram-table").className;

    for (let i = 0; i < Histrogramlist.length; i++) {
    
      if (tableClass == "visit") {
        var row = document.querySelectorAll("#histogram-table tr")[i];
        var lastChild = row.lastChild;
        lastChild.remove();
      } else {
   
        var table = document.querySelector("#histogram-table");
        table.classList.remove("nonvisit");
        table.classList.add("visit");
      }

      var dataPoint = "";
      for (let j = 0; j < Histrogramlist[i]; j++) {
        dataPoint += "&#10003 ";
      }

      var cell = document.createElement('td');
      cell.innerHTML = dataPoint;
      cell.classList.add("histogram-data");

      if (i < 3) {
        cell.style.color = "blue";
      } else if (i < 6) {
        cell.style.color = "orange";
      } else if (i < 9) {
        cell.style.color = "purple";
      } else {
        cell.style.color = "red";
      }
      histogramTableData[i].appendChild(cell);
    }
  }

  for (let i = 0; i < Histrogramlist.length; i++) {
    Histrogramlist[i] = 0;
  }










