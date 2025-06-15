
# RAMS/CPP Generator (MVP)

A web-based tool that:
- Uploads a site-specific quote
- Matches NHF SOR codes to RAMS templates
- Merges into a downloadable CPP + RAMS doc (after manual review)

## Run Locally

```bash
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

## Folder Structure

- `/templates/rams/`: Converted .docx RAMS templates
- `/templates/cpp_template.docx`: Minor Works CPP
- `/uploads/`: Quote input files
- `/output/`: Final generated documents
