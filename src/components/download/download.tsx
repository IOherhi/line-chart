// Import
import { useRef, useState } from "react";
import classNames from "classnames";
import type React from "react";
import "./download.scss";
//

interface Props {
  data: object[] | null;
  controls: {
    file: File | null;
    lastFile: File | null;
    setFile: (arg: File) => void;
    setShowList: (arg: boolean) => void;
    setLastFile: (arg: File) => void;
    setLoading: (arg: boolean) => void;
  };
}

export const Download: React.FC<Props> = ({ data, controls }) => {
  const [isNotCSV, setIsNotCSV] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const { file, lastFile, setFile, setShowList, setLastFile, setLoading } =
    controls;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length === 0) {
      if (lastFile !== null) {
        setFile(lastFile);
      }
      return;
    }

    const file = e.target.files[0];

    if (file.type !== "text/csv") {
      setIsNotCSV(true);
    } else {
      setIsNotCSV(false);
    }

    setFile(file);
    setLastFile(file);
  };

  const handleClick = () => {
    if (data) {
      setShowList(true);
      setLoading(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="download">
      <div className={classNames("error", { visible: isNotCSV })}>
        Is not CSV
      </div>

      <label htmlFor={file ? "N" : "file-input"}>
        <div onClick={() => handleClick()} className="download-button">
          {file ? "Show" : "Upload CSV"}
        </div>
      </label>

      <input
        id="file-input"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {file && (
        <label htmlFor="file-input">
          <div className="download-name">{file.name}</div>
        </label>
      )}
    </div>
  );
};
