import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useMemo, useState } from "react";
import "./chartList.scss";
import type { Data } from "../../App";
import classNames from "classnames";
import { selectExperiments } from "./chartUtils";
import { useSearchParams } from "react-router-dom";

interface Props {
  data: Data[] | null;
}

export const ChartList: React.FC<Props> = React.memo(({ data }) => {
  const [experiments, setExperiments] = useState<string[]>([]);
  const [select, setSelect] = useState<boolean>(false);
  const [preparedData, setPreparedData] = useState<object[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showExp, setShowExp] = useState<string[]>(
    searchParams.get("experiments")?.split(",") ?? []
  );


  useEffect(() => {
    const newSearch = new URLSearchParams();
    newSearch.set("experiments", showExp.join(","));
    setSearchParams(newSearch);
  }, [showExp]);


  useEffect(() => {
    if (!data) return;

    const uniqueExperiments = Array.from(
      new Set(data.map((obj) => obj.experiment_id.toLowerCase()))
    );

    setExperiments(uniqueExperiments);
  }, [data]);


  useEffect(() => {
    if (!data) return;

    const filtered = data.filter((item) =>
      showExp.includes(item.experiment_id.toLowerCase())
    );

    const groupedByStep: Record<number, any> = {};

    filtered.forEach((item) => {
      const step = Number(item.step);
      const key = `${item.metric_name}_${item.experiment_id.toLowerCase()}`;

      if (!groupedByStep[step]) {
        groupedByStep[step] = { step };
      }

      groupedByStep[step][key] = Number(item.value);
    });

    const result = Object.values(groupedByStep).sort((a, b) => a.step - b.step);
    setPreparedData(result);

    // preparedData  = [{ step: 1, loss_exp_1: 0.9, accuracy_exp_1: 0.7 },
    //{ step: 2, loss_exp_1: 0.85, accuracy_exp_1: 0.75 }]
  }, [showExp, data]);




  const lines = useMemo(() => {
    if (preparedData.length === 0) return [];
    console.log(preparedData);

    const keys = Object.keys(preparedData[0]).filter((key) => key !== "step");

    return keys.map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
      />
    ));
  }, [preparedData]);

  return (
    <section className="chart">
      <div className="chart-content">
        <ResponsiveContainer width="70%" height="90%">
          <LineChart className="line-chart" data={preparedData}>
            <XAxis dataKey="step" />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{
                maxWidth: "100%",
                margin: "0 auto",
                overflowX: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                paddingTop: "15px",
                fontFamily: "Lato",
                fontWeight: "600",
                gap: "10px",
              }}
            />
            <CartesianGrid stroke="#000" strokeDasharray="2 2" />
            {lines}
          </LineChart>
        </ResponsiveContainer>

        <div className="select">
          <div className="select-dropdown">
            <button
              className="select-dropdown__button"
              onClick={() => setSelect((prev) => !prev)}
            >
              Choose Experiments
            </button>

            <ul
              tabIndex={0}
              className={classNames("select-dropdown__content", {
                active: select,
              })}
            >
              {experiments.map((exp) => (
                <li
                  key={exp}
                  className={classNames("select-dropdown__content-item", {
                    activeExp: showExp.includes(exp),
                  })}
                  onClick={() => selectExperiments(exp, showExp, setShowExp)}
                >
                  {exp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});
