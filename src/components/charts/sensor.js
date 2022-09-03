import { useEffect, useState } from "react";
import { Loader } from "rsuite";
import { Line } from "react-chartjs-2";

const optionsChartLine = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: '#fff'
      }
    },
    title: {
      display: true,
      color: '#fff',
      font: { weight: 'bold', size: 18 },
      text: "Giá trị cảm biến thu thập",
    },
  },
  scales: {
    y: {
      ticks: { color: '#fff', beginAtZero: true },
      title: {
        display: true,
        text: 'Giá trị',
        color: '#fff'
      }
    },
    x: {
      ticks: { color: '#fff', beginAtZero: true },
      title: {
        display: true,
        text: 'Thời gian',
        color: '#fff'
      }
    }
  }
};

const specialTypeModel = {
  "DHT21-humidity": (value) => value.map((data) => data.value.humidity),
  "DHT21-temperature": (value) => value.map((data) => data.value.temperature),
  none: (value) => value.map((data) => data.value),
};

function ChartSensor({
  options = optionsChartLine,
  sensor,
  label,
  borderColor = "rgb(0, 203, 255)",
  backgroundColor = "rgba(0, 203, 255, 0.5)",
  width = 600,
  height = 400,
}) {
  const [dataChart, setDataChart] = useState(undefined);

  useEffect(() => {
    if (sensor?.payload?.length > 0) {
      const payload = {
        labels: sensor.payload.map(({ timeAt }) => timeAt),
        datasets: [
          {
            label,
            data:
              sensor.model in specialTypeModel
                ? specialTypeModel[sensor.model](sensor.payload)
                : specialTypeModel["none"](sensor.payload),
            borderColor,
            backgroundColor,
          },
        ],
      };
      setDataChart(payload);
      options.plugins.title.text = `Giá trị cảm biến ${label} thu thập`;
      options.scales.y.title.text = sensor.unit;
    } else if (sensor?.payload?.length === 0) {
      setDataChart([]);
    }
  }, [sensor]);

  return dataChart === undefined ? (
    <Loader
      size="md"
      className="col-span-full text-center"
      content="Loading..."
    />
  ) : dataChart.length === 0 ? (
    <h6>Cảm biến {label} chưa thu thập giá trị nào!</h6>
  ) : (
    <Line
      width={width}
      height={height}
      className="animate-[load-smooth_200ms_ease-in-out_alternate]"
      options={options}
      data={dataChart}
    />
  );
}

export { ChartSensor };