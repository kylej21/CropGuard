import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useSnackbar } from 'notistack';

interface BarChartProps {
  username: string;
}

const BarChart: React.FC<BarChartProps> = ({ username }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null); // Ref to store the Chart instance
  const [numOccurrences, setNumOccurrences] = useState<number[]>([]);
  const [occurrenceTypes, setOccurrenceTypes] = useState<string[]>([]);
  const snackbar = useSnackbar();

  useEffect(() => {
    // Simulated data update or API fetch
    const fetchData = async () => {
      // Replace with your data fetching logic
      let categories = await fetch(
        "/api/categories/" , {
          method: "POST",
          body: JSON.stringify({ username: username }),
        }).then((data)=>{
          const body = data.json().then((body)=>{
            if(data.status==200){
              setOccurrenceTypes(body.data);
            }
            else{
              snackbar.enqueueSnackbar('Error Loading Insights!', { variant: 'error', autoHideDuration: 2000 });
            }
          })
        })
      let occurences = await fetch(
        "/api/occurences/", {
          method: "POST",
          body: JSON.stringify({ username: username }),
        }).then((data)=>{
          const body = data.json().then((body)=>{
            if(data.status==200){
              setNumOccurrences(body.data);

            }
            else{
              snackbar.enqueueSnackbar('Error Loading Insights!', { variant: 'error', autoHideDuration: 2000 });
            }
          })
        })
    };

    fetchData();
  }, [username]); // Fetch data on component mount

  useEffect(() => {
    if (
      chartRef.current &&
      numOccurrences.length > 0 &&
      occurrenceTypes.length > 0
    ) {
      // Destroy previous chart instance if exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: occurrenceTypes,
            datasets: [
              {
                label: "Occurrences",
                data: numOccurrences,
                backgroundColor: "rgba(41, 248, 201, 0.2)",
                borderColor: "rgba(41, 248, 201, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy chart instance on component unmount or data update
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [numOccurrences, occurrenceTypes]);

  return <canvas ref={chartRef} width="400" height="400"></canvas>;
};

export default BarChart;
