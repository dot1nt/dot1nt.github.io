function parseCsvLine(line) {
    const line_split = line.split(",").map((val) => {
        const parsed_val = parseFloat(val);
        return isNaN(parsed_val) ? val.replace(/\s/g, "") : parsed_val;
    })

    return line_split;
}

function parseCsvFile(file_content) {
    const lines = file_content.split("\n");
    let data = [];

    lines.forEach((line, i) => {
        if (line.trim() === "") {
            return;
        }

        const line_parsed = parseCsvLine(line);

        if (data.length === 0) {
            data = Array.from({ length: line_parsed.length }, () => []);
        }

        if (line_parsed.length != data.length) {
            throw `Line ${i} contains more/less columns than the first line`
        }

        line_parsed.forEach((val, a) => {
            data[a].push(val);
        })
    });

    return data;
}