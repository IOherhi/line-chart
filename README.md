A React application for visualizing experiment metrics (accuracy, loss) from CSV files.

## DEMO : https://ioherhi.github.io/line-chart/


## Key Features

- Upload CSV file
- First time working with CSV file
- Validate CSV format and show an error if the file is invalid
- Display error messages if file reading fails
- Spinner shown during data loading/processing
- Visualization of metrics as responsive line charts using Recharts — worked with this library for the first time
- Select up to 2 metrics to display (can choose 1 or 2)
- Custom dropdown list for selecting experiments, responsive to screen size
- Normalize experiment_id to lowercase (case-insensitive)
- Save selected experiments in the URL (synchronized parameters)
- Rendering optimizations with React.memo and useMemo

---

## Running the Project

# Install dependencies:
   npm install

# Start the local development server:
  npm start


