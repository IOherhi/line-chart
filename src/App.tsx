// Import
import { ChartList } from "./components/chartList";
import { Download } from "./components/download";
import { useEffect, useState } from "react";
import { Spiner } from "./utils/spiner";
import classNames from "classnames";
import Papa from "papaparse";
import "./App.scss";
//

export interface Data {
  experiment_id: string;
  metric_name: string;
  step: number;
  value: number;
}

export function App() {
  const [file, setFile] = useState<File | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [showList, setShowList] = useState<boolean>(false);
  const [cantRead, setCantRead] = useState<boolean>(false);
  const [data, setData] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
     setCantRead(false)

    if (file.type !== "text/csv") {
      setData(null)
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    const timeout = setTimeout(() => {
      setLoading(true);
    });

    reader.onerror = () => {
      console.error("Cannot read CSV file");
      setCantRead(true)
    };


    reader.onload = () => {
      if (reader.result) {
        const result = Papa.parse(reader.result.toString(), {
          header: true,
          skipEmptyLines: true,
        });

        setData(result.data as Data[]);
        setLoading(false);
      }
    };


    return () => {
      clearTimeout(timeout);
    };
  }, [file]);

  return (
    <section className="app">
      <div className={classNames("error", { visible: cantRead })}>
        Сannot read file, <br /> choose another one
      </div>

      {loading ? (
        <Spiner />
      ) : showList ? (
        <ChartList data={data}/>
      ) : (
        <Download
          data={data}
          controls={{
            file,
            setFile,
            lastFile,
            setLastFile,
            setShowList,
            setLoading,
          }}
        />
      )}
    </section>
  );
}
