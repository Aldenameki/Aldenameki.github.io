// https://www.npmjs.com/package/js-xlsx

var wb;
var table, pickerImage, pickerExcel;
var lastCol = -1;
var colname = "";
var chart1;

function start() {
    pickerImage = new Picker("chooseimage");

    pickerExcel = new Picker("choosefile");
    pickerExcel.addEvent((files) => {
        pickerExcel.openExcel(files[0], manipulate);
    });


    table = new Table("t1");
    table.build();
    table.append(document.getElementById("holder"));

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
    let ohead = head.slice();

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

    setGraph(ohead);
}

function setGraph(head) {
    let etype = document.getElementById("graphtype");
    let eyaxis = document.getElementById("graphyaxis");
    let exaxis = document.getElementById("graphxaxis");
    let button = document.getElementById("graphgen");
    let types = ['bar', 'line'];

    etype.innerText = "";
    eyaxis.innerText = "";
    exaxis.innerText = "";

    for(let i=0; i<types.length; i++)
        etype.appendChild(cElement('option', "", types[i], types[i]));

    for(let i=0; i<head.length; i++) {
        eyaxis.appendChild(cElement('option', "", head[i], head[i]));
        exaxis.appendChild(cElement('option', "", head[i], head[i]));
    }

    button.onclick = (e) => {
        let eyaxis = document.getElementById("graphyaxis");
        let exaxis = document.getElementById("graphxaxis");
        let etype = document.getElementById("graphtype");
        let canvas1 = document.getElementById("c1");
        let graph1 = document.getElementById("g1");

        let yname = eyaxis.value;
        let xname = exaxis.value;
        let type_ = etype.value;

        let ydata = table.colData(table.col(yname));
        let xdata = table.colData(table.col(xname));

        if(chart1 != undefined)
            chart1.destroy();

        setChart(canvas1, type_, ydata, xdata, yname, xname);
        graph1.style.display = "block";
    }
}

function cElement(tag, class_, text, value=null) {
    let element = document.createElement(tag);
    element.className = class_;
    element.innerText = text;

    if(value != null)
        element.value = value;

    return element;
}

function setChart(canvas, type, yaxis, xaxis, yname, xname) {
    chart1 = new Chart(canvas , {
        type: type,
        data: {
            labels: xaxis,
            datasets: [{
                label: 'Dado',
                data: yaxis,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    text: yname + " vs " + xname,
                    display: true,
                }
            }
        }
    });
}