import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FaChartBar, FaSpinner } from 'react-icons/fa';
import { sectionAPI, yearlyProgressAPI } from '../../api/api';

const MainContent = ({ selectedDoc, selectedSection, onSelectSection, isEditable }) => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
  };
  const [sections, setSections] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'order', direction: 'asc' });

  // Auto-select first section
  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      onSelectSection(sections[0]);
    }
  }, [sections, selectedSection, onSelectSection]);

  // Fetch sections when document changes
  useEffect(() => {
    if (!selectedDoc) {
      setSections([]);
      return;
    }
    const fetchSections = async () => {
      try {
        setLoading(true);
        const res = await sectionAPI.getByDocument(selectedDoc._id);
        setSections(res.data.data || []);
      } catch (err) {
        console.error('Failed to load sections', err);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [selectedDoc]);

  // Fetch yearly progress when section changes
  useEffect(() => {
    if (!selectedSection) {
      setYearlyData([]);
      return;
    }
    const fetchProgress = async () => {
      try {
        const res = await yearlyProgressAPI.getBySection(selectedSection._id);
        setYearlyData(res.data.data || []);
      } catch (err) {
        console.error('Failed to load yearly progress', err);
        setYearlyData([]);
      }
    };
    fetchProgress();
  }, [selectedSection]);

  // Placeholder when nothing is selected
  if (!selectedDoc) {
    return (
      <div className="tdt-placeholder">
        <FaChartBar className="tdt-placeholder-icon" />
        <div className="tdt-placeholder-text">Vui lòng chọn một mục để xem biểu đồ</div>
      </div>
    );
  }

  // Build chart data from yearly progress
  const getChartData = () => {
    if (!selectedSection || yearlyData.length === 0) return [];

    // Generate years from document date range
    const startYear = new Date(selectedDoc.startDate).getFullYear();
    const endYear = new Date(selectedDoc.endDate).getFullYear();
    const data = [];

    for (let year = startYear; year <= endYear; year++) {
      const found = yearlyData.find(d => d.year === year);
      data.push({
        year: year.toString(),
        'Thực tế': found ? found.actualValue : 0,
        'Mục tiêu': found ? (found.targetValue || selectedSection.targetValue) : selectedSection.targetValue,
      });
    }
    return data;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedSections = () => {
    const sorted = [...sections];
    sorted.sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'order') {
        valA = a.order || sections.indexOf(a);
        valB = b.order || sections.indexOf(b);
      } else if (sortConfig.key === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortConfig.key === 'targetValue') {
        valA = a.targetValue || 0;
        valB = b.targetValue || 0;
      } else if (sortConfig.key === 'actual') {
        valA = a.yearlyData?.length ? a.yearlyData[a.yearlyData.length - 1].actualValue : 0;
        valB = b.yearlyData?.length ? b.yearlyData[b.yearlyData.length - 1].actualValue : 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const getProgressPercent = (actual, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((actual / target) * 100), 100);
  };

  const getStatusLabel = (actual, target) => {
    if (!actual || actual === 0) return { label: 'Chưa có', cls: 'not-started' };
    const pct = (actual / target) * 100;
    if (pct >= 100) return { label: 'Đạt', cls: 'achieved' };
    return { label: `${Math.round(pct)}%`, cls: 'in-progress' };
  };

  const chartData = getChartData();

  return (
    <div className="tdt-animate-in">
      {/* Document Overview */}
      <div className="tdt-doc-overview">
        <h2 className="tdt-doc-overview-name">{selectedDoc.name}</h2>
        <div className="tdt-doc-overview-meta">
          <span className="tdt-doc-overview-stat">
            📁 {selectedDoc.category}
          </span>
          <span className="tdt-doc-overview-stat">
            📅 {new Date(selectedDoc.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedDoc.endDate).toLocaleDateString('vi-VN')}
          </span>
          <span className="tdt-doc-overview-stat">
            📊 {sections.length} chỉ tiêu
          </span>
        </div>
      </div>

      {loading ? (
        <div className="tdt-placeholder">
          <FaSpinner className="tdt-placeholder-icon" style={{ animation: 'spin 1s linear infinite' }} />
          <div>Đang tải...</div>
        </div>
      ) : (
        <>
          {/* Section list as clickable cards */}
          {sections.length === 0 ? (
            <div className="tdt-chart-container">
              <div className="tdt-placeholder-text" style={{ textAlign: 'center', padding: '40px' }}>
                Chưa có mục tiêu nào trong Nội dung này
              </div>
            </div>
          ) : (
            <>
              {/* Sections list */}
              <div className="tdt-chart-container">
                <h3 className="tdt-chart-title">
                  <FaChartBar className="tdt-chart-title-icon" />
                  Danh sách chỉ tiêu - Chọn để xem biểu đồ
                </h3>
                <table className="tdt-comparison-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', cursor: 'pointer' }} onClick={() => handleSort('order')}>
                        Thứ tự {sortConfig.key === 'order' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                        Tên chỉ tiêu {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={{ width: '120px', cursor: 'pointer' }} onClick={() => handleSort('targetValue')}>
                        Mục tiêu {sortConfig.key === 'targetValue' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={{ width: '120px', cursor: 'pointer' }} onClick={() => handleSort('actual')}>
                        Thực tế {sortConfig.key === 'actual' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={{ width: '150px' }}>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedSections().map((section, idx) => {
                      const latestProgress = section.yearlyData?.length > 0
                        ? section.yearlyData[section.yearlyData.length - 1]
                        : null;
                      const actualVal = latestProgress?.actualValue || 0;
                      const targetVal = section.targetValue || 100;
                      const pct = getProgressPercent(actualVal, targetVal);
                      const status = getStatusLabel(actualVal, targetVal);

                      return (
                        <tr
                          key={section._id}
                          className={selectedSection?._id === section._id ? 'active-row' : ''}
                          onClick={() => onSelectSection(section)}
                          style={{ cursor: 'pointer', transition: 'background 0.2s', background: selectedSection?._id === section._id ? '#fff3e0' : 'transparent' }}
                        >
                          <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {section.order > 0 ? section.order : idx + 1}
                          </td>
                          <td style={{ fontWeight: 500, color: 'var(--tdt-red)' }}>
                            {section.name}
                          </td>
                          <td>
                            <strong>{formatNumber(targetVal)} {section.unit}</strong>
                          </td>
                          <td>
                            <strong style={{ color: '#ff9800' }}>{formatNumber(actualVal)} {section.unit}</strong>
                          </td>
                          <td>
                            <div className="tdt-table-progress-mini">
                              <div className="tdt-table-progress-bar">
                                <div
                                  className="tdt-table-progress-fill"
                                  style={{
                                    width: `${pct}%`,
                                    background: pct >= 100 ? '#4caf50' : pct >= 50 ? '#ff9800' : '#f44336'
                                  }}
                                />
                              </div>
                              <span className={`tdt-table-status ${status.cls}`}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Comparison Table & Chart for selected section */}
              {selectedSection && (
                <div className="tdt-chart-container tdt-animate-in">
                  <h3 className="tdt-chart-title">
                    <FaChartBar className="tdt-chart-title-icon" />
                    So sánh tiến độ theo năm: {selectedSection.name}
                  </h3>

                  {/* Comparison Table */}
                  <table className="tdt-comparison-table">
                    <thead>
                      <tr>
                        <th>Năm</th>
                        <th>Giá trị thực tế</th>
                        <th>Mục tiêu</th>
                        <th>Tỷ lệ đạt</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row) => {
                        const actual = row['Thực tế'];
                        const target = row['Mục tiêu'];
                        const pct = getProgressPercent(actual, target);
                        const status = getStatusLabel(actual, target);
                        const yearEntry = yearlyData.find(d => d.year === parseInt(row.year));

                        return (
                          <tr key={row.year}>
                            <td><strong>{row.year}</strong></td>
                            <td>
                              <span className="tdt-table-value-actual">
                                {actual !== undefined ? formatNumber(actual) : '-'} {actual !== undefined ? selectedSection.unit : ''}
                              </span>
                            </td>
                            <td>
                              <span className="tdt-table-value-target">
                                {formatNumber(target)} {selectedSection.unit}
                              </span>
                            </td>
                            <td>
                              <div className="tdt-table-progress-mini">
                                <div className="tdt-table-progress-bar">
                                  <div
                                    className="tdt-table-progress-fill"
                                    style={{
                                      width: `${pct}%`,
                                      background: pct >= 100 ? '#4caf50' : pct >= 50 ? '#ff9800' : '#f44336'
                                    }}
                                  />
                                </div>
                                <span className={`tdt-table-status ${status.cls}`}>
                                  {status.label}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: '#888', fontSize: '0.8rem' }}>
                              {yearEntry?.note || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Bar Chart */}
                  {chartData.length > 0 && (
                    <div className="tdt-recharts-wrapper" style={{ width: '100%', minHeight: '320px', marginTop: '20px', overflowX: 'auto', textAlign: 'center' }}>
                      <div style={{ display: 'inline-block', minWidth: '800px' }}>
                        <BarChart width={800} height={320} data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="year" tick={{ fontSize: 13, fill: '#666' }} tickMargin={10} />
                          <YAxis tick={{ fontSize: 12, fill: '#666' }} tickMargin={5} tickFormatter={formatNumber} />
                          <Tooltip
                            formatter={(value) => [formatNumber(value), '']}
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid #eee',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              fontSize: '0.85rem'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '0.85rem', paddingTop: '15px' }} />
                          <Bar dataKey="Mục tiêu" fill="#2196f3" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Thực tế" fill="#f44336" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MainContent;