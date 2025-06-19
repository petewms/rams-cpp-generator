let ramsMapping = {};
let selectedRAMS = [];

async function loadMapping() {
  const res = await fetch("mapping.json");
  ramsMapping = await res.json();
}

function processQuote() {
  const file = document.getElementById("quoteUpload").files[0];
  if (!file) return alert("Please upload a quote file first.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    selectedRAMS = [];
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h3>Matched RAMS:</h3><ul id='ramsList'></ul>";
    const list = document.getElementById("ramsList");

    for (let i = 15; i < rows.length; i++) {
      const code = String(rows[i][0]).trim();
      if (!code || code.toLowerCase().includes("total")) continue;

      const match = ramsMapping[code];
      const li = document.createElement("li");

      if (match) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.onchange = () => {
          if (checkbox.checked) selectedRAMS.push(match.suggested_rams);
          else selectedRAMS = selectedRAMS.filter(f => f !== match.suggested_rams);
        };
        selectedRAMS.push(match.suggested_rams);

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(" " + code + " — " + match.description + " (" + match.suggested_rams + ")"));
      } else {
        li.textContent = code + " — No RAMS match found";
      }

      list.appendChild(li);
    }
  };
  reader.readAsArrayBuffer(file);
}

function downloadSelected() {
  if (selectedRAMS.length === 0) return alert("No RAMS selected.");

  const zip = new JSZip();
  let fetched = 0;

  selectedRAMS.forEach((file, idx) => {
    fetch("rams/" + file)
      .then(res => res.blob())
      .then(blob => {
        zip.file(file, blob);
        fetched++;
        if (fetched === selectedRAMS.length) {
          zip.generateAsync({ type: "blob" }).then(content => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = "RAMS_Selected.zip";
            a.click();
          });
        }
      })
      .catch(() => console.warn("Missing RAMS file:", file));
  });
}

function generateCPP() {
  const file = document.getElementById("quoteUpload").files[0];
  if (!file) return alert("Please upload a quote file first.");

  const formData = new FormData();
  formData.append("quote", file);

  fetch("https://rams-cpp-backend.onrender.com/generate-cpp", {
    method: "POST",
    body: formData
  })
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "CPP_Filled.docx";
      a.click();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to generate CPP.");
    });
}

window.onload = loadMapping;