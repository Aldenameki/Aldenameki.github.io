// https://www.npmjs.com/package/js-xlsx

var wb;
var table, pickerImage, pickerExcel;
var lastCol = -1;
var colname = "";


function start() {
    pickerImage = new Picker("chooseimage");

    pickerExcel = new Picker("choosefile");
    pickerExcel.addEvent((files) => {
        pickerExcel.openExcel(files[0], manipulate);
    });


    table = new Table("t1");
    table.build();
    table.append(document.body);

    let column = document.getElementById("choosecolumn");
    column.addEventListener('change', (e) => {setColumn(e);});
    column.addEventListener('keydown', (e) => {if(e.key == "Enter" || e.key == "Escape") {e.target.blur()};});

    let columnItem = localStorage.getItem("SRcolumn");
    if(columnItem != null) {
        column.value = columnItem;
        colname = columnItem;
    }
}

function setColumn(event) {
    let value = event.target.value;
    localStorage.setItem("SRcolumn", value);
    colname = value;
}

function manipulate(workbook) {
    let sheetNames = workbook.SheetNames;
    let sheet = workbook.Sheets[sheetNames[0]];
    let data = XLSX.utils.sheet_to_json(sheet);
    let head = Object.keys(data[0]);

    wb = workbook;

    table.clear();
    table.setHead(head);

    for(let i=0; i<data.length; i++) {
        let values = [];
        for(let j=0; j<head.length; j++)
            values.push(data[i][head[j]]);
            
        table.addRow(values);
    }

    table.addCol("Foto", (row, element) => {
        let col = table.col(colname);
        let file = pickerImage.findFile(row.data[col]);

        if(file != null) {
            pickerImage.openImage(pickerImage.files[file], (url) => {
                let img = document.createElement("img");
                img.className = "Timage";
                img.src = url;
                
                element.appendChild(img);
            });
        } else {
            console.log("Image " + row.data[col] +  " not found.");
        }
    });

    table.addHeadEvent((e, i) => {
        let asc = true;
        if(lastCol == i) {
            asc = false;
            lastCol = -1;
        } else {
            lastCol = i;
        }
        table.sort(i, asc);
    }, 3);
}