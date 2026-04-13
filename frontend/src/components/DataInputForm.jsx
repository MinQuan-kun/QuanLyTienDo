import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import '../styles/main.css';

export default function DataInputForm({ 
  section, 
  yearlyProgress,
  documentStartDate,
  documentEndDate,
  onSaveProgress,
  loading 
}) {
  const [formData, setFormData] = useState({});
  const [editingYears, setEditingYears] = useState(new Set());

  // Initialize form data from yearly progress
  const initializeFormData = () => {
    if (!section || !documentStartDate || !documentEndDate) return;

    const startYear = new Date(documentStartDate).getFullYear();
    const endYear = new Date(documentEndDate).getFullYear();
    const newFormData = {};

    for (let year = startYear; year <= endYear; year++) {
      const existing = yearlyProgress.find(p => p.year === year);
      newFormData[year] = {
        actualValue: existing?.actualValue || '',
        targetValue: (existing?.targetValue ?? section.targetValue) || '',
        note: existing?.note || '',
        id: existing?._id || null,
      };
    }

    setFormData(newFormData);
  };

  useEffect(() => {
    initializeFormData();
    setEditingYears(new Set());
  }, [section, yearlyProgress, documentStartDate, documentEndDate]);

  const startYear = new Date(documentStartDate).getFullYear();
  const endYear = new Date(documentEndDate).getFullYear();
  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const handleInputChange = (year, field, value) => {
    setFormData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: value,
      },
    }));
  };

  const handleSaveYear = async (year) => {
    try {
      const data = formData[year];
      if (!data.actualValue) {
        alert('Vui lòng nhập giá trị');
        return;
      }

      const saved = await onSaveProgress({
        sectionId: section._id,
        year,
        actualValue: parseFloat(data.actualValue),
        targetValue: data.targetValue ? parseFloat(data.targetValue) : section.targetValue,
        note: data.note,
      });

      setFormData(prev => ({
        ...prev,
        [year]: {
          ...prev[year],
          actualValue: saved.actualValue,
          targetValue: saved.targetValue ?? prev[year]?.targetValue,
          note: saved.note,
          id: saved._id || prev[year]?.id,
        },
      }));

      setEditingYears(prev => {
        const newSet = new Set(prev);
        newSet.delete(year);
        return newSet;
      });
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleCancel = (year) => {
    // Restore original value
    const existing = yearlyProgress.find(p => p.year === year);
    setFormData(prev => ({
      ...prev,
      [year]: {
        actualValue: existing?.actualValue || '',
        note: existing?.note || '',
        id: existing?._id || null,
      },
    }));
    setEditingYears(prev => {
      const newSet = new Set(prev);
      newSet.delete(year);
      return newSet;
    });
  };

  if (!section) {
    return null;
  }

  return (
    <div className="data-input-form">
      <div className="form-header">
        <h2>Nhập Dữ Liệu Hàng Năm</h2>
        <p>Mục: {section.name}</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <div className="col-year">Năm</div>
          <div className="col-value">Giá Trị Thực Tế ({section.unit})</div>
          <div className="col-note">Ghi Chú</div>
          <div className="col-target">Mục Tiêu ({section.unit})</div>
          <div className="col-actions">Hành Động</div>
        </div>

        <div className="table-body">
          {years.map(year => {
            const isEditing = editingYears.has(year);
            const data = formData[year] || {};

            return (
              <div key={year} className="table-row">
                <div className="col-year">{year}</div>
                <div className="col-value">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data.actualValue || ''}
                      onChange={(e) => handleInputChange(year, 'actualValue', e.target.value)}
                      className="input-value"
                      disabled={loading}
                    />
                  ) : (
                    <span>{data.actualValue || '-'}</span>
                  )}
                </div>
                <div className="col-note">
                  {isEditing ? (
                    <input
                      type="text"
                      value={data.note || ''}
                      onChange={(e) => handleInputChange(year, 'note', e.target.value)}
                      className="input-note"
                      placeholder="Ghi chú..."
                      disabled={loading}
                    />
                  ) : (
                    <span>{data.note || '-'}</span>
                  )}
                </div>
                <div className="col-target">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data.targetValue || ''}
                      onChange={(e) => handleInputChange(year, 'targetValue', e.target.value)}
                      className="input-target"
                      disabled={loading}
                    />
                  ) : (
                    <span>{data.targetValue || section.targetValue || '-'}</span>
                  )}
                </div>
                <div className="col-actions">
                  {isEditing ? (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleSaveYear(year)}
                        className="btn-save"
                        disabled={loading}
                        title="Lưu"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => handleCancel(year)}
                        className="btn-cancel"
                        disabled={loading}
                        title="Hủy"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingYears(prev => new Set(prev).add(year))}
                      className="btn-edit"
                      disabled={loading}
                    >
                      Sửa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
