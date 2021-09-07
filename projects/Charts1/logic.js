var canvas1;
var canvas2;
var data2 = {x: [], y: []};
var data2b = {x: [], y: []};
var myChart1;
var myChart2;

function start() {
    canvas1 = document.getElementById("canvas1");
    canvas2 = document.getElementById("canvas2");

    for(let i=0; i<=50; i++) {
        data2.x.push(i);
        data2.y.push(i*i);
        
        data2b.x.push(i);
        data2b.y.push(i*50)
    }

    setchart();
}

function setchart() {

    myChart1 = new Chart(canvas1 , {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    myChart2 = new Chart(canvas2 , {
        type: 'line',
        data: {
            labels: data2.x,
            datasets: [{
                label: 'y1',
                data: data2.y,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            },{
                label: 'y2',
                data: data2b.y,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 0.2)'
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
                    text: 'Linear and Quadratic functions',
                    display: true,
                }
            }
        }
    });

}
