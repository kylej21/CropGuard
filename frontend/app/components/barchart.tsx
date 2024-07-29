import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useSnackbar } from 'notistack';
import { TbBinaryTree } from 'react-icons/tb'; // Make sure to install react-icons if not already

interface BarChartProps {
  username: string;
}

const BarChart: React.FC<BarChartProps> = ({ username }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null); // Ref to store the Chart instance
  const [numOccurrences, setNumOccurrences] = useState<number[]>([]);
  const [occurrenceTypes, setOccurrenceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const snackbar = useSnackbar();

  useEffect(() => {
    // Simulated data update or API fetch
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting data fetch
      try {
        let categoriesResponse = await fetch("/api/categories/", {
          method: "POST",
          body: JSON.stringify({ username: username }),
        });
        let categoriesBody = await categoriesResponse.json();
        if (categoriesResponse.status === 200) {
          setOccurrenceTypes(categoriesBody.data);
        } else {
          snackbar.enqueueSnackbar('Error Loading Categories!', { variant: 'error', autoHideDuration: 2000 });
        }

        let occurrencesResponse = await fetch("/api/occurences/", {
          method: "POST",
          body: JSON.stringify({ username: username }),
        });
        let occurrencesBody = await occurrencesResponse.json();
        if (occurrencesResponse.status === 200) {
          setNumOccurrences(occurrencesBody.data);
        } else {
          snackbar.enqueueSnackbar('Error Loading Occurrences!', { variant: 'error', autoHideDuration: 2000 });
        }
      } catch (error) {
        snackbar.enqueueSnackbar('Error Loading Data!', { variant: 'error', autoHideDuration: 2000 });
      } finally {
        setLoading(false); // Set loading to false when data fetch is complete
      }
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

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-80 h-80 border-8 text-green-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-green-400 rounded-full">
              <TbBinaryTree className="w-40 h-40" />
            </div>
          </div>
        </div>
      ) : (
        <canvas ref={chartRef} width="400" height="400"></canvas>
      )}
    </div>
  );
};

export default BarChart;
