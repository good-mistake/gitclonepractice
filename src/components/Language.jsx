import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import octokit from "./octokit";
import { PieChart, Pie, Cell } from "recharts";

const Language = () => {
  const { username, repoName } = useParams();
  const [error, setError] = useState("");

  const [language, setLanguage] = useState({});

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const res = await octokit.request(
          `GET /repos/${username}/${repoName}/languages`,
          {
            owner: "OWNER",
            repo: "REPO",
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        setLanguage(res.data);
      } catch (e) {
        console.log(e);
        setError("An error occurred in Language. Please try again.");
      }
    };

    if (username && repoName) {
      fetchLanguage();
    }
  }, [username, repoName]);
  const getLang = Object.entries(language);
  const data01 = Object.entries(language).map(([key, value]) => ({
    name: key,
    value: value,
  }));
  const COLORS = [
    "#191970",
    "#483D8B",
    "#4B0082",
    "#800080",
    "#00008B",
    "#9932CC",
    "#82ca9d",
    "red",
    "blue",
    "purple",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      {language && Object.keys(language).length > 0 ? (
        <div className="languageContainer">
          <PieChart width={300} height={300}>
            <Pie
              data={data01}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data01.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <div>
            {getLang.map(([key, value], index) => {
              return (
                <>
                  <div
                    className="languageName"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  >
                    {key} : {value}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No Language</p>
      )}{" "}
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Language;
