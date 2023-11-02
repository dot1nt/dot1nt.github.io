let chart;

function createChart(data, labels, has_time, element) {
    let series_opts = [{}];

    for (let i = 1; i < data.length; i++) {
        let color = getRandomColor()

        series_opts.push(
            {
                label: labels[i],
                stroke: color,
                fill: color + "1A",
            }
        )
    }

    const opts = {
        width: 600,
        height: 400,
        scales: {
            x: {
                time: has_time,
            },
        },
        axes: [
            {
                stroke: "#c7d0d9",
                grid: {
                    width: 1 / devicePixelRatio,
                    stroke: "#2c3235",
                },
                ticks: {
                    width: 1 / devicePixelRatio,
                    stroke: "#2c3235",
                },
            },
            {
                stroke: "#c7d0d9",
                grid: {
                    width: 1 / devicePixelRatio,
                    stroke: "#2c3235",
                },
                ticks: {
                    width: 1 / devicePixelRatio,
                    stroke: "#2c3235",
                },
            },
        ],
        cursor: {
            drag: {
                x: true,
                y: true,
                uni: 50,
            }
        },
        series: series_opts,
    };

    return new uPlot(opts, data, element);
}

function getChartData(data) {
    if (data.length == 0) {
        throw "File is empty";
    }

    let has_header = false;

    for (let i = 0; i < data.length; i++) {
        if (typeof data[i][0] === "string") {
            has_header = true;
        }
    }

    let has_time = false;
    let labels = [];

    if (has_header) {
        for (let i = 0; i < data.length; i++) {
            let column_label = data[i][0];

            if (column_label === "time") {
                has_time = true;
                data.unshift(data[i]);
                data.splice(i+1, 1);
            }
        }

        for (let i = 0; i < data.length; i++) {
            labels.push(data[i][0]);
            data[i].shift();
        }

    } else {
        for (let i = 0; i < data.length; i++) {
            labels.push(`Data ${i}`);
        }

        console.log(labels)
    }

    if (!has_time) {
        data.unshift(Array.from(Array(data[1].length).keys()));
        labels.unshift("time");
    }

    return [data, labels, has_time];
}

function addChartData(data, labels) {
    const combined_data = [chart.data, data]

    const new_data = uPlot.join(combined_data, combined_data.map(t => t.map(s => 2)))
    const new_labels = labels.slice(1)

    new_labels.forEach((label) => {
        let color = getRandomColor()

        chart.addSeries(
            {
                label: label,
                stroke: color,
                fill: color + "1A",
            }
        )
    })

    chart.setData(new_data);
}

function parseAndCreateChart(file) {
    let file_type = file.name.split(".").pop();
    if (file_type != "csv") {
        showErrorModal("Only .csv files are supported")
        return
    }

    readFileContent(file)
        .then((file_content) => {
            const csv_data = parseCsvFile(file_content);
            const [chart_data, chart_labels, has_time] = getChartData(csv_data)

            document.getElementById("upload-page").style.display = "none";
            document.getElementById("view-page").style.display = "block";
            const chart_container = document.getElementById("chart-container")

            if (!chart) {
                chart = createChart(chart_data, chart_labels, has_time, chart_container);
                window.addEventListener("resize", e => {
                    chart.setSize(getWindowSize());
                });
                
                chart.setSize(getWindowSize());
            } else {
                addChartData(chart_data, chart_labels);
            }

            chart.setSize(getWindowSize());
        })
        .catch((error) => {
            showErrorModal(error);
        })
}

///////////////// callbacks /////////////////

function onDragOver(event) {
    event.preventDefault();
    document.body.style.backgroundColor = "#16171d";
}

function onDragLeave() {
    document.body.style.backgroundColor = "#121317";
}

function onFileDrop(event) {
    event.preventDefault();

    let files = event.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
        parseAndCreateChart(files[i]);
    }
}

function onFileSelection() {
    let file_input = document.createElement('input');
    file_input.type = 'file';
    file_input.multiple = 'multiple';
    file_input.click();

    file_input.addEventListener('change', (event) => {
        let files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            parseAndCreateChart(files[i]);
        }
    });
}

function hideErrorModal() {
    const error_modal = document.getElementById("error-modal");
    error_modal.style.top = "-100px";
}

function showErrorModal(msg) {
    const error_modal = document.getElementById("error-modal");
    error_modal.style.top = "20px";

    const error_modal_text = document.getElementById("error-modal-text");
    error_modal_text.innerHTML = `Error: ${msg}`;

    onDragLeave();

    setTimeout(hideErrorModal, 5000);
}