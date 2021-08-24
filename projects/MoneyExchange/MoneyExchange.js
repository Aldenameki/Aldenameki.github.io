var Money = {
    values: [200, 100, 50, 20, 10, 5, 2, 0.50, 0.25, 0.10, 0.05, 0.01],

    exchange(value, limit={}) {
        let amount = new Array(this.values.length);
        let left = value;

        for(let i=0; i<amount.length; i++) {
            let value = this.values[i];
            let number = parseInt(left/value);
            if(number>limit[value]) {number = limit[value];}
            amount[i] = number;
            left -= number*value;
            left = Math.round(left*1000)/1000;
        }

        return [amount, left];
    },

    genElements(values, amounts) {
        let container = document.createElement("div");
        container.className = "MONEYcontainer";

        for(let i=0; i<values.length; i++) {
            if(amounts[i] == 0) {continue}

            let cell = document.createElement("div");
            cell.className = "MONEYcurrency MONEY" + (values[i]).toString();
            container.appendChild(cell);
            
            let name = document.createElement("p");
            name.className = "MONEYname";
            name.innerText = (values[i]).toString();
            cell.appendChild(name);

            let amount = document.createElement("p");
            amount.className = "MONEYamount";
            amount.innerText = (amounts[i]).toString();
            cell.appendChild(amount);
        }

        return container;
    }
}