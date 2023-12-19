import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import 'chart.js/auto';

import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

const Graph = (props) => {

  const chartType = props.chartType;

  return (
    <div className="w-full h-full">
      {chartType === "bar" &&
      <Bar data={props.chartData.data} options={props.chartData.options}/>
      }

      {chartType == "line" &&
      <Line data={props.chartData.data} />
      }
    </div>
  )

};

export default Graph;