# Data Explorer

Data Explorer is a lightweight, client-side web application for exploring user-uploaded datasets such as CSV and JSON files.
It automatically generates interactive tables and charts, allowing users to quickly inspect, filter, sort, and visualize data without writing any code.

The project focuses on usability, performance, and clean UI patterns, inspired by tools like Kaggle’s dataset viewer.

## ✨ Features

 - Upload CSV or JSON files directly from your device

 - Automatically renders large datasets (10k+ rows) in a performant table

 - Global search with debouncing

 - Column-wise sorting

 - Pagination for large datasets

 - Dynamic chart generation (e.g. bar charts)

 - User-selectable:

   - Group-by column

   - Metric (count, extensible to sum/average)

 - Graceful handling of missing or unknown values

 - Clean, readable table UI with ellipsis for long cell values

## 📊 Charts & Visualization

 - Charts are generated dynamically based on user input

 - Supports grouping categorical columns

 - Designed to adapt when a new dataset is uploaded

 - Chart logic is decoupled from table rendering

 - This ensures the application remains flexible across different dataset schemas.

## 🧠 Design Decisions

 - **Client-side data processing** for simplicity and transparency

 - **No backend required** — ideal for quick data inspection

 - UI inspired by professional data tools (e.g. Kaggle)

 - Focus on composability and extensibility rather than over-engineering

## 🛠 Technology Stack

 - **React** (with Hooks)

 - **TypeScript** for type safety

 - **Vite** for fast development and builds

 - **PapaParse** for CSV parsing

 - **Recharts** for data visualization

 - **Bootstrap / React-Bootstrap** for UI components

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/data-explorer.git
cd data-explorer
npm install
npm run dev
```

Then open your browser at:

```
http://localhost:5173
```
## 📌 Use Cases

 - Quick exploration of CSV datasets

 - Inspecting Kaggle-style datasets locally

 - Learning and experimenting with data visualization

 - Frontend-focused data tooling without backend complexity

## 📈 Future Improvements

 - Column type inference (numeric vs categorical)

 - Additional chart types (line, pie)

 - Column summary metadata (missing %, unique values)

 - Export filtered data

 - Column visibility toggles

## 👤 Author

Built by **Sourav Bhowmik**
Frontend Developer with interests in data visualization, clean UI design, and scalable frontend architecture.

## 📝 License

MIT License

