// simplex
function getSimplex(quantDec, quantRes, choice) {
  $("#inputValues").hide();
  $('#nameApp').remove();
  var hasil_array = getValue(quantDec, quantRes);
  hasil_array.push(getValues(quantDec, quantRes));

  var allTables = [];

  var tablesCount = 0;

  var stopConditionValue = 0;

  var iMax = $("#iMax").val();
  if (iMax <= 0) {
    iMax = 20;
  }
 
  // quantDecision
  var bValues = [];

  variabel_tabel = staticTableVars(quantDec, quantRes);
  variabel_awal = variabel_tabel[0];
  variabel_tipe = variabel_tabel[1];

  jumlah_kolom = quantDec + quantRes + 1;
  jumlah_baris = quantRes + 1;

  for (let i = 0; i < jumlah_baris; i++) {
    console.log(hasil_array[i][jumlah_kolom - 1]);
    bValues.push(hasil_array[i][jumlah_kolom - 1]);
  }

  matrizToTable(
    hasil_array,
    "Initial",
    variabel_tipe,
    variabel_awal,
    jumlah_baris,
    allTables,
    0
  );
  tablesCount++;

  do {
    lowerNumberAndColumn = getLowerNumberAndColumn(
      hasil_array,
      jumlah_baris,
      jumlah_kolom
    );
    lowerNumber = lowerNumberAndColumn[0];
    if (lowerNumber == 0) {
      break;
    }
    columnLowerNumber = lowerNumberAndColumn[1];

    whoLeavesResults = whoLeavesBase(
      hasil_array,
      columnLowerNumber,
      jumlah_kolom,
      jumlah_baris,
      variabel_awal
    );
    variabel_awal = whoLeavesResults[1];
    pivoRow = whoLeavesResults[0];
    pivoColumn = columnLowerNumber;
    pivoValue = hasil_array[pivoRow][pivoColumn];
    hasil_array = divPivoRow(hasil_array, jumlah_kolom, pivoRow, pivoValue);
    hasil_array = nullColumnElements(
      hasil_array,
      pivoRow,
      pivoColumn,
      jumlah_baris,
      jumlah_kolom
    );
    funczValues = hasil_array[jumlah_baris - 1];

    hasNegativeOrPositive = funczValues.some((v) => v < 0);

    stopConditionValue += 1;

    if (stopConditionValue == iMax || stopConditionValue == 3) {
      break;
    }

    if (hasNegativeOrPositive == true) {
      matrizToTable(
        hasil_array,
        "Parcial" + stopConditionValue,
        variabel_tipe,
        variabel_awal,
        jumlah_baris,
        allTables,
        tablesCount
      );
      tablesCount++;
    }
  } while (hasNegativeOrPositive == true);

  matrizToTable(
    hasil_array,
    "Final",
    variabel_tipe,
    variabel_awal,
    jumlah_baris,
    allTables,
    tablesCount
  );
  senseTable(hasil_array, variabel_tipe, variabel_awal, quantDec, bValues);
    // $(".shows").append(
    //   '<br><div class="row" align="center" ><button type="button" id="showss" class="btn btn-primary" onclick="hides()">Hide Table</button></div>'
    // );
  if (choice == 1) {
    $(".container").append(allTables[stopConditionValue]);
    printResults(hasil_array, quantDec, quantRes, jumlah_kolom, variabel_awal);
  }else {
    for (let i = 0; i < allTables.length; i++) {
      $(".container").append(allTables[i]);
    }
    printResults(hasil_array, quantDec, quantRes, jumlah_kolom, variabel_awal);
  }
  6;
}

function matrizToTable(matriz, divName, head, base, jumlah_baris, allTables, aux) {
  $("#auxDiv").html(
    '<div class="row"><div id="divTable' +
      divName +
      '" class="offset-md-2 col-md-8 offset-md-2 table-responsive"><div class="row"><h3>Table ' +
      divName +
      ':</h3></div><table id="table' +
      divName +
      '" class="table table-bordered"></table></div></div>'
  );
  var table = $("#table" + divName);
  var row, cell;
  var matrizTable = [];
  var headTable = [];
  var baseTable = [];

  for (let i = 0; i < matriz.length; i++) {
    matrizTable[i] = matriz[i].slice();
  }

  for (let i = 0; i < head.length; i++) {
    headTable[i] = head[i].slice();
  }

  for (let i = 0; i < base.length; i++) {
    baseTable[i] = base[i].slice();
  }

  $("#firstPhase").remove();
  $("#startInputs").hide();
  $("#stepByStep	").remove();

  matrizTable.unshift(headTable);
  for (let i = 1, j = 0; i <= jumlah_baris; i++, j++) {
    matrizTable[i].unshift(baseTable[j]);
  }

  for (let i = 0; i < matrizTable.length; i++) {
    row = $("<tr />");
    table.append(row);
    for (let j = 0; j < matrizTable[i].length; j++) {
      if(divName=="Final" && i == matrizTable.length-1){
        if (matrizTable[i][j]<0){
          cell = $("<td>0</td>");
        }
        else if (!isNaN(matrizTable[i][j])) {
          cell = $("<td>" + Math.round(matrizTable[i][j] * 100) / 100 + "</td>");
        } else {
          cell = $("<td>" + matrizTable[i][j] + "</td>");
        }
      }
      else if (!isNaN(matrizTable[i][j])) {
        cell = $("<td>" + Math.round(matrizTable[i][j] * 100) / 100 + "</td>");
      } else {
        cell = $("<td>" + matrizTable[i][j] + "</td>");
      }

      row.append(cell);
    }
  }
  allTables[aux] = $("#divTable" + divName + "")[0].outerHTML;
}

//mostra resultados
function printResults(matriz, quantDec, quantRes, jumlah_kolom, base) {
  if ($("#min").is(":checked")) {
    var zValue = matriz[matriz.length - 1][jumlah_kolom - 1] * -1;
  } else {
    var zValue = matriz[matriz.length - 1][jumlah_kolom - 1];
  }

  $("#results").append(
    '<div class="col-md-12">The optimal solution is Z = ' +
      Math.round(zValue * 100) / 100 +
      "</div><br>"
  );
  $("#results").append("<div> Basic Variables </div>");
  for (let i = 0; i < quantRes; i++) {
    var baseName = base[i];
    var baseValue = matriz[i][jumlah_kolom - 1];
    $("#results").append(
      "<div>" + baseName + " = " + Math.round(baseValue * 100) / 100 + "</div>"
    );
  }
}

function staticTableVars(quantDec, quantRes) {
  base = [];
  head = [];

  for (let i = 0; i < quantRes; i++) {
    base.push("S" + (i + 1));
  }
  base.push("Z");
  head.push("Base");
  // for (let i = 0; i < quantDec; i++) {
  //   head.push("X" + (i + 1));
  // }
  head.push("X");
  head.push("Y");
  for (let i = 0; i < quantRes; i++) {
    head.push("S" + (i + 1));
  }
  head.push("B");

  return [base, head];
}

function nullColumnElements(
  matriz,
  pivoRow,
  pivoColumn,
  jumlah_baris,
  jumlah_kolom
) {
  for (let i = 0; i < jumlah_baris; i++) {
    if (i == pivoRow || matriz[i][pivoColumn] == 0) {
      continue;
    }
    pivoAux = matriz[i][pivoColumn];

    for (let j = 0; j < jumlah_kolom; j++) {
      matriz[i][j] = matriz[pivoRow][j] * (pivoAux * -1) + matriz[i][j];
    }
  }
  return matriz;
}

function divPivoRow(matriz, jumlah_kolom, pivoRow, pivoValue) {
  for (var i = 0; i < jumlah_kolom; i++) {
    matriz[pivoRow][i] = matriz[pivoRow][i] / pivoValue;
  }

  return matriz;
}

function whoLeavesBase(
  matriz,
  columnLowerNumber,
  jumlah_kolom,
  jumlah_baris,
  variabel_awal
) {
  var lowerResult = 99999999999999999999999;
  var lowerResultRow;

  for (let i = 0; i < jumlah_baris - 1; i++) {
    if (!(matriz[i][columnLowerNumber] == 0)) {
      currentValue = 0;
      currentValue = matriz[i][jumlah_kolom - 1] / matriz[i][columnLowerNumber];

      if (currentValue > 0) {
        if (currentValue < lowerResult) {
          lowerResult = currentValue;
          lowerResultRow = i;
        }
      }
    }
  }
  if (lowerResultRow == undefined) {
    pauseSolution();
  } else {
    variabel_awal[lowerResultRow] =(columnLowerNumber + 1) === 1 ? "X" : "Y";

    return [lowerResultRow, variabel_awal];
  }
}

function getValue(quantDec, quantRes) {
  var resValues = [];
  var xvalue = [];
  for (let i = 1; i <= quantRes; i++) {
    xvalue = [];

    for (let j = 1; j <= quantDec; j++) {
      var input = $("input[name='X" + j + "_res" + i + "']").val();

      if (input.length == 0) {
        xvalue[j - 1] = 0;
      } else {
        xvalue[j - 1] = parseFloat(input);
      }
    }

    for (let j = 1; j <= quantRes; j++) {
      if (i == j) {
        xvalue.push(1);
      } else {
        xvalue.push(0);
      }
    }

  
    var input_res = $("input[name='valRestriction" + i + "']").val();

    if (input_res.length == 0) {
      xvalue.push(0);
    } else {
      xvalue.push(parseFloat(input_res));
    }

    resValues[i - 1] = xvalue;
  }
  return resValues;
}

function getValues(quantDec, quantRes) {
  var funcValues = [];
  var xvalue = [];
  var maxOrMin = $("#max").is(":checked") ? -1 : 1;
  for (let i = 1; i <= quantDec; i++) {
    var input = $("input[name='valX" + i + "']").val();

    if (input.length == 0) {
      xvalue[i - 1] = 0;
    } else {
      xvalue[i - 1] = parseFloat(input) * maxOrMin;
    }
  }
  funcValues = xvalue;

  for (let i = 0; i <= quantRes; i++) {
    funcValues.push(0);
  }

  return funcValues;
}

function getLowerNumberAndColumn(matriz, rowCount, columnCount) {
  var column = 0;

  rowCount -= 1;

  var lowerNumber = matriz[rowCount][0];

  for (let j = 1, i = rowCount; j < columnCount - 1; j++) {
    if (matriz[i][j] < lowerNumber) {
      lowerNumber = matriz[i][j];
      column = j;
    }
  }
  return [lowerNumber, column];
}

function pauseSolution() {
  $(".container").remove();

  $("body").append(
    '<div class="container"><div class="row"><div class="offset-md-2 col-md-8 offset-md-2"><h1>Solução Impossível</h1></div></div></div>'
  );
  $(".container").append(
    '<div class="row"><div class="offset-md-4 col-md-4 offset-md-4"><button id="back" class="btn-inicio" onclick="location.reload();" >Voltar</button></div>	</div>'
  );
  
}

function PrimeiroPasso() {
  $(document).ready(function () {
    var quantDec = $("input[name=quantDecision]").val();
    if (quantDec.length == 0 || quantDec == "0") {
      alert("Você precisa inserir valores na variavel de decisão");
      return;
    } else {
      quantDec = parseFloat(quantDec);
      if (quantDec < 1) {
        return;
      }
    }

    var quantRes = $("input[name=quantRestriction]").val();
    if (quantRes.length == 0 || quantRes == "0") {
      alert("Você precisa inserir valores na variavel de restrição");
      return;
    } else {
      quantRes = parseFloat(quantRes);
      if (quantRes < 1) {
        return;
      }
    }

    $("#inputValues").remove();

    generateFunctionZ(quantDec);

    generateRestrictions(quantDec, quantRes);

    $("#inputValues").append(
      '<div id="buttons" class="row"><div class="col-md-6 mt-3"></div></div>'
    );

    $(".container").append('<div id="solution" class="row"></div>');
    $(".shows").append(
      '<br><div class="row"><div id="results" class="col-md"></div></div>'
    );

    $("#buttons").append(
      '<div class="offset-md-3 col-md-6 offset-md-3 mt-3"><button id="stepByStep" onclick="getSimplex(' +
        quantDec +
        "," +
        quantRes +
        ',2)" class="btn btn-primary btn-next">Generate Tables</button></div>'
    );
  });
  $('#name').remove();
}
var z = 0 ;
// function hides(){
//   if(z === 0 ){
//     $("#showss").text('Show Table');
//     $(".container").hide();
//     z=1;
//   } else{
//     z=0;
//     $("#showss").text('Hide Table');
//     $(".container").show();
//   }
// }

function generateFunctionZ(quantDec) {
  $(".container").append('<div id="inputValues"></div>');
  $("#inputValues").append(
    '<br><div class="row"><div class="input-group mb-3 d-flex justify-content-center align-items-center" id="funcZ"></div></div>'
  );

  $("#funcZ").append('<h5>Z =</h5><span class="px-2">');
  for (let i = 1; i <= quantDec; i++) {
    $("#funcZ").append(
      '<input class="input-val" type="number" name="valX' + i + '">'
    );
    if (i != quantDec) {
      $("#funcZ").append(
        '<div><span class="m-text"> X </span></div>'
      );
    } else {
      $("#funcZ").append("<div><span> Y </span></div>");
    }
  }
  var input = $('input[name="valX1"]');

  var input = $('input[name="valX1"]');

  input.focus();
}

function generateRestrictions(quantDec, quantRes) {
  $("#inputValues").append(
    '<div class="row"><div class="col-md-12 mb-3 mt-3" id="divRestTitle"><h5>Enter the Restrictions:</h5></div></div>'
  );

  for (let i = 1; i <= quantRes; i++) {
    $("#inputValues").append(
      '<div class="row"><div class="input-group mb-3 d-flex justify-content-center align-items-center" id=divRes' +
        i +
        "></div></div>"
    );

    for (let j = 1; j <= quantDec; j++) {
      $("#divRes" + i + "").append(
        '<input class="input-val" type="number" name="X' +
          j +
          "_res" +
          i +
          '" " >'
      );
      if (j != quantDec) {
        $("#divRes" + i).append(
          '<div><span class="input-val"> X </span></div>'
        );
      } else {
        $("#divRes" + i).append("<div><span>Y</span></div>");
      }
    }

    $("#divRes" + i).append(
      '<span></span><div><span class="equal-m"><b>&le;</b></span></div><input class="input-val" type="number" name="valRestriction' +
        i +
        '">'
    );
  }
}


function senseTable(matriz, head, base, quantDec, bValues) {
  var matrizTable = [];
  var headTable = [];
  var baseTable = [];

  var restNames = [];
  var restValues = [];
  var minMaxValues = [];

  for (let i = 0; i < matriz.length; i++) {
    matrizTable[i] = matriz[i].slice();
  }

  for (let i = 0; i < head.length; i++) {
    headTable[i] = head[i].slice();
  }

  for (let i = 0; i < base.length; i++) {
    baseTable[i] = base[i].slice();
  }

  matrizTable.unshift(headTable);

  for (let i = 1, j = 0; i <= jumlah_baris; i++, j++) {
    matrizTable[i].unshift(baseTable[j]);
  }

  for (let i = quantDec + 1, k = 0; i < matrizTable[0].length - 1; k++, i++) {
    restNames.push(matrizTable[0][i]);
    restValues.push(matrizTable[matrizTable.length - 1][i]);
    let auxArray = new Array();
    for (let j = 1; j < matrizTable.length - 1; j++) {
      let bCol = matrizTable[j][matrizTable[0].length - 1];
      let restCol = matrizTable[j][i];

      auxArray.push((bCol / restCol) * -1);
    }
    let minPos = Number.POSITIVE_INFINITY;
    let maxNeg = Number.NEGATIVE_INFINITY;
    for (let j = 0; j < auxArray.length; j++) {
      if (auxArray[j] > 0 && auxArray[j] < minPos) {
        minPos = auxArray[j];
      } else if (auxArray[j] < 0 && auxArray[j] > maxNeg) {
        maxNeg = auxArray[j];
      }
    }
    if (minPos === Number.POSITIVE_INFINITY) {
      minPos = 0;
    }
    if (maxNeg === Number.NEGATIVE_INFINITY) {
      maxNeg = 0;
    }
    minMaxValues.push([maxNeg + bValues[k], minPos + bValues[k]]);
  }

  var senseMatriz = [];

  for (let i = 0; i < matrizTable.length - 2; i++) {
    let auxArray = new Array();
    auxArray.push(restNames[i]);
    auxArray.push(restValues[i]);
    senseMatriz.push(auxArray);
  }

  for (let i = 0; i < senseMatriz.length; i++) {
    for (let j = 0; j < minMaxValues[0].length; j++) {
      senseMatriz[i].push(minMaxValues[i][j]);
    }
    senseMatriz[i].push(bValues[i]);
  }

  senseMatriz.unshift(["Resources", "Shadow Price", "Min", "Max", "Initial"]);

  // $(".container").append(
  //   '<hr><div id="divSenseTable" class="offset-md-2 col-md-8 offset-md-2 table-responsive"><div class="row"><h3>Sensitivity Table:</h3></div></div>'
  // );
  // $(".container").append(
  //   '<div class="row"><div id="divSenseTable" class="offset-md-2 col-md-8 offset-md-2 table-responsive"><table id="senseTable" class="table table-bordered"></table></div></div><hr>'
  // );
  var table = $("#senseTable");
  var row, cell;

  for (let i = 0; i < senseMatriz.length; i++) {
    row = $("<tr />");
    table.append(row);
    for (let j = 0; j < senseMatriz[i].length; j++) {
      if (!isNaN(senseMatriz[i][j])) {
        cell = $("<td>" + Math.round(senseMatriz[i][j] * 100) / 100 + "</td>");
      } else {
        cell = $("<td>" + senseMatriz[i][j] + "</td>");
      }

      row.append(cell);
    }
  }
}