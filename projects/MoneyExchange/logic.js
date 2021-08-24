var e1 = null;
var func1;

function start() {
    let button = document.getElementById("moneybu");
    button.addEventListener('click', (e) => {
        let input = document.getElementById("moneyin");
        func1(input.value);
        //func1(input.value, {200: 1, 100: 2});
    });

    let input = document.getElementById("moneyin");
    input.addEventListener('keypress', (e) => {
        if(e.key == "Enter") {func1(e.target.value);}
    });

    func1 = (value, limit={}) => {
        if(e1 != null) {
            e1.remove();
            e1 = null;
        }

        value = value.replaceAll(',', '.');
        value = eval(value);
        a = Money.exchange(value, limit);
        e1 = Money.genElements(Money.values, a[0]);
        document.getElementById('content').appendChild(e1);

        console.log("Sobrou: " + a[1]);
        console.table([Money.values, a[0]]);
    }
}