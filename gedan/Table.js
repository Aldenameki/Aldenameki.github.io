class Table {
    constructor(id="") {
        this.id = id;

        this.head = [];
        this.row = [];

        this.element;
        this.elementHead;
    }



    rows() {
        return this.row.length;
    }

    col(name) {
        for(let i=0; i<this.head.length; i++)
            if(this.head[i] == name) {return i;}

        return null;
    }



    build() {
        this.element = document.createElement("table");
        this.element.id = this.id;
        this.element.className = "Ttable";
    }

    append(element) {
        element.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    clear() {
        this.head.splice(0);
        this.row.splice(0);
        this.elementHead = null;
        this.element.innerText = "";
    }



    setHead(names=[]) {
        this.head = names;
        if(this.elementHead) {this.elementHead.remove();}
        this._buildHead();
        this.element.insertBefore(this.elementHead, this.element.firstChild);
    }

    addRow(values=[]) {
        let row = document.createElement("tr");

        row.className = "Trow";

        for(let i=0; i<values.length; i++)
            row.appendChild(this._buildRowValue(values[i]));

        this.row.push({data: values, element: row});
        this.element.appendChild(row);
    }

    addCol(name, func) {
        this.head.push(name);
        this.setHead(this.head);

        for(let i=0; i<this.rows(); i++) {
            let cell = this._buildRowValue("");
            func(this.row[i], cell);
            this.row[i].element.appendChild(cell);
        }
    }

    refreshRows() {
        for(let i=0; i<this.rows(); i++)
            this.row[i].element.remove();

        for(let i=0; i<this.rows(); i++)
            this.element.appendChild(this.row[i].element);
    }

    
    addHeadEvent(func, limit=99999) {
        let hds = this.elementHead.children;
        let len = hds.length;

        if(len > limit) {len = limit;}

        for(let i=0; i<hds.length; i++)
            hds[i].addEventListener('click', (event) => {func(event, i);});
    }



    sort(colIndex, asceding=true) {
        let nrow = [];
        let cond;
        
        if(asceding)
            cond = (a, b) => {return a > b;}
        else
            cond = (a, b) => {return a < b;}

        while(this.rows() > 0) {
            let best = this.row[0].data[colIndex];
            let index = 0;

            for(let i=0; i<this.rows(); i++) {
                if(cond(best, this.row[i].data[colIndex])) {
                    best = this.row[i].data[colIndex];
                    index = i;
                }
            }

            nrow.push(this.row.splice(index, 1)[0]);
        }

        this.row = nrow;
        this.refreshRows();
    }

    visible(colIndex, show=true) {
        let display = "none";
        if(show) {display = "table-cell";}

        this.elementHead.children[colIndex].style.display = display;

        for(let i=0; i<this.rows(); i++)
            this.row[i].element.children[colIndex].style.display = display;
    }



    _buildHead() {
        this.elementHead = document.createElement("tr");
        this.elementHead.className = "Thead";

        for(let i=0; i<this.head.length; i++)
            this._buildHeadName(this.head[i]);
    }

    _buildHeadName(name) {
        let hname = document.createElement("th");

        hname.innerText = name;
        hname.className = "Theadname";

        this.elementHead.appendChild(hname);
    }

    _buildRowValue(value) {
        let content = document.createElement("td");

        content.className = "Tcell";
        content.innerText = value;

        return content;
    }
}