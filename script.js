
function processQuote() {
    const fileInput = document.getElementById("quoteUpload");
    const file = fileInput.files[0];
    const resultsDiv = document.getElementById("results");

    if (!file) {
        alert("Please upload an XLSX file.");
        return;
    }

    resultsDiv.innerHTML = "<p>📂 File selected: " + file.name + "<br>Reading file... please wait.</p>";

    const mapping = {'411316': {'description': 'Repair to roof tiles', 'suggested_rams': 'Roof Leaks Repair to tiles.pdf'}, '450001': {'description': 'Decorating works', 'suggested_rams': 'Internal Decoration Procedure.pdf'}};

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            resultsDiv.innerHTML += "<p>✅ File read successfully. Checking for SOR codes...</p>";

            let sorCodes = [];
            for (let i = 15; i < json.length; i++) {
                let code = json[i][0];
                if (typeof code === "number" || !isNaN(Number(code))) {
                    sorCodes.push(String(code));
                }
            }

            if (sorCodes.length === 0) {
                resultsDiv.innerHTML += "<p style='color:orange;'>⚠️ No valid SOR codes found in this file.</p>";
                return;
            }

            let resultHtml = "<h2>SOR Code Matches</h2><ul>";
            sorCodes.forEach(code => {
                if (mapping[code]) {
                    resultHtml += `<li><strong>${code}</strong> – ${mapping[code].description}<br><em>Suggested RAMS:</em> ${mapping[code].suggested_rams}</li>`;
                } else {
                    resultHtml += `<li><strong>${code}</strong> – ❌ No RAMS match found.</li>`;
                }
            });
            resultHtml += "</ul>";
            resultsDiv.innerHTML += resultHtml;
        } catch (err) {
            resultsDiv.innerHTML += `<p style='color:red;'>❌ An error occurred: ${err.message}</p>`;
        }
    };
    reader.readAsArrayBuffer(file);
}
