import { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import '../styles/main.css';


export default function ProgressChart({ 
  section, 
  yearlyProgress,
  documentStartDate,
  documentEndDate
}) {
  const [chartType, setChartType] = useState('bar');
  const [chartWidth, setChartWidth] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!section) {
    return (
      <div className="chart-container empty">
        <p>Vui lòng chọn một mục để xem biểu đồ</p>
      </div>
    );
  }

  // Prepare chart data
  const startYear = new Date(documentStartDate).getFullYear();
  const endYear = new Date(documentEndDate).getFullYear();
  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const chartData = years.map(year => {
    const progress = yearlyProgress.find(p => p.year === year);
    const target = progress?.targetValue ?? section.targetValue;
    return {
      year,
      'Giá trị thực tế': progress?.actualValue || 0,
      'Mục tiêu': target,
    };
  });

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Biểu đồ so sánh: {section.name}</h2>
        <p className="section-detail">
          Mục tiêu: {section.targetValue}{section.unit}
        </p>
      </div>

      <div className="chart-type-toggle">
        <button
          className={chartType === 'bar' ? 'active' : ''}
          onClick={() => setChartType('bar')}
        >
          Biểu đồ cột
        </button>
        <button
          className={chartType === 'line' ? 'active' : ''}
          onClick={() => setChartType('line')}
        >
          Biểu đồ đường
        </button>
      </div>

      <div className="chart-wrapper" ref={containerRef}>
        <div className="chart-wrapper-inner" style={{ width: '100%', height: '400px', minWidth: 0, overflowX: 'auto' }}>
          {chartType === 'bar' ? (
            <BarChart width={chartWidth || 600} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Năm', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                label={{ value: `Giá trị (${section.unit})`, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value) => `${value}${section.unit}`}
                labelFormatter={(label) => `Năm ${label}`}
              />
              <Legend />
              <Bar dataKey="Giá trị thực tế" fill="#3b82f6" />
              <Bar dataKey="Mục tiêu" fill="#10b981" />
            </BarChart>
          ) : (
            <LineChart width={chartWidth || 600} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value) => `${value}${section.unit}`}
                labelFormatter={(label) => `Năm ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Giá trị thực tế" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Mục tiêu" 
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}
