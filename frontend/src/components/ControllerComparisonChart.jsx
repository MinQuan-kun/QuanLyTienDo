import './ControllerComparisonChart.css';

export default function ControllerComparisonChart() {
  const controllerData = [
    {
      name: 'Document Controller',
      description: 'Quản lý các văn kiện/dự án',
      fields: ['name', 'description', 'category', 'startDate', 'endDate'],
      endpoints: [
        'POST /api/documents',
        'GET /api/documents',
        'GET /api/documents/:id',
        'PUT /api/documents/:id',
        'DELETE /api/documents/:id',
      ],
      functions: ['Tạo', 'Đọc', 'Cập nhật', 'Xóa'],
      color: '#3b82f6',
    },
    {
      name: 'Section Controller',
      description: 'Quản lý các chỉ tiêu/mục tiêu',
      fields: ['name', 'description', 'targetValue', 'unit', 'document'],
      endpoints: [
        'POST /api/sections',
        'GET /api/sections/:documentId',
        'PUT /api/sections/:id',
        'DELETE /api/sections/:id',
      ],
      functions: ['Tạo', 'Đọc', 'Cập nhật', 'Xóa'],
      color: '#10b981',
    },
    {
      name: 'YearlyProgress Controller',
      description: 'Quản lý dữ liệu hàng năm',
      fields: ['section', 'year', 'actualValue', 'note'],
      endpoints: [
        'POST /api/yearly-progress',
        'GET /api/yearly-progress/:sectionId',
        'DELETE /api/yearly-progress/:id',
      ],
      functions: ['Tạo/Cập nhật', 'Đọc', 'Xóa'],
      color: '#f59e0b',
    },
  ];

  return (
    <div className="controller-comparison">
      <div className="chart-title">
        <h2>🏗️ So Sánh Controllers & Dữ Liệu</h2>
        <p>Bảng so sánh các controller, dữ liệu lưu trữ và chức năng</p>
      </div>

      <div className="controller-grid">
        {controllerData.map((controller, index) => (
          <div
            key={index}
            className="controller-card"
            style={{ borderTop: `4px solid ${controller.color}` }}
          >
            <div className="card-header" style={{ backgroundColor: `${controller.color}15` }}>
              <h3>{controller.name}</h3>
              <p className="description">{controller.description}</p>
            </div>

            <div className="card-content">
              {/* Fields Section */}
              <div className="info-section">
                <h4>📋 Dữ Liệu Lưu Trữ</h4>
                <div className="fields-list">
                  {controller.fields.map((field, i) => (
                    <span key={i} className="field-badge" style={{ backgroundColor: `${controller.color}20`, color: controller.color }}>
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Endpoints Section */}
              <div className="info-section">
                <h4>🔌 API Endpoints</h4>
                <div className="endpoints-list">
                  {controller.endpoints.map((endpoint, i) => (
                    <div key={i} className="endpoint-item">
                      <code>{endpoint}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functions Section */}
              <div className="info-section">
                <h4>⚙️ Chức Năng</h4>
                <div className="functions-list">
                  {controller.functions.map((func, i) => (
                    <span key={i} className="function-badge" style={{ backgroundColor: controller.color, color: 'white' }}>
                      {func}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="summary-table">
        <h3>📊 Bảng Tổng Hợp</h3>
        <table>
          <thead>
            <tr>
              <th>Controller</th>
              <th>Mô Tả</th>
              <th>Số Trường Dữ Liệu</th>
              <th>Số Endpoints</th>
              <th>Chức Năng</th>
            </tr>
          </thead>
          <tbody>
            {controllerData.map((controller, index) => (
              <tr key={index}>
                <td>
                  <strong style={{ color: controller.color }}>{controller.name}</strong>
                </td>
                <td>{controller.description}</td>
                <td>
                  <span className="badge">{controller.fields.length}</span>
                </td>
                <td>
                  <span className="badge">{controller.endpoints.length}</span>
                </td>
                <td>{controller.functions.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Flow Diagram */}
      <div className="data-flow">
        <h3>🔄 Luồng Dữ Liệu</h3>
        <div className="flow-diagram">
          <div className="flow-item">
            <div className="flow-box" style={{ backgroundColor: '#3b82f6' }}>Document</div>
            <div className="flow-arrow">→</div>
          </div>
          <div className="flow-item">
            <div className="flow-box" style={{ backgroundColor: '#10b981' }}>Section</div>
            <div className="flow-arrow">→</div>
          </div>
          <div className="flow-item">
            <div className="flow-box" style={{ backgroundColor: '#f59e0b' }}>YearlyProgress</div>
          </div>
        </div>
        <div className="flow-explanation">
          <p>Mỗi <strong>Document</strong> có nhiều <strong>Section</strong></p>
          <p>Mỗi <strong>Section</strong> có nhiều <strong>YearlyProgress</strong></p>
          <p>Dữ liệu được lưu trữ phân tầng theo cấu trúc này</p>
        </div>
      </div>

      {/* Operation Count */}
      <div className="operation-count">
        <h3>📌 Thống Kê Hoạt Động</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Document Operations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4</div>
            <div className="stat-label">Section Operations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">YearlyProgress Operations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Total API Endpoints</div>
          </div>
        </div>
      </div>
    </div>
  );
}
