class Picker {
    constructor(id) {
        this.id = id;
        this.files = [];
        this.element;
        this.onchange = [];

        this.build();
    }

    build() {
        this.element = document.getElementById(this.id);

        this.element.addEventListener('change', (e) => {
            this.files = e.target.files;
            this.runEvents();
        });
    }

    addEvent(onChange) {
        this.onchange.push(onChange);
    }

    runEvents() {
        for(let i=0; i<this.onchange.length; i++)
            this.onchange[i](this.files);
    }

    findFile(name) {
        for(let i=0; i<this.files.length; i++) {
            let namef = this.files[i].name.split('.');
            if(namef[0] == name) {
                return i;
            }
        }

        return null;
    }



    openExcel(file, func) {
        let reader = new FileReader();
        let oReq = new XMLHttpRequest();
    
        reader.onload = (e) => {
            let data = e.target.result;
            data = new Uint8Array(data);
    
            let arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            let bstr = arr.join("");
            
            /* Call XLSX */
            let workbook = XLSX.read(bstr, {type:"binary"});

            func(workbook);
        }
    
        reader.readAsArrayBuffer(file);
    }

    openImage(file, func) {
        let reader = new FileReader();
        reader.onload = () => {
            let dataURL = reader.result;
            func(dataURL);
        }
        reader.readAsDataURL(file);
    }
}