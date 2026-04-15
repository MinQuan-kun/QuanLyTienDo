import { useState, useEffect, useRef } from 'react';
import { Save, X } from 'lucide-react';
import { FaUpload, FaFile, FaTimes } from 'react-icons/fa';
import { documentAPI, projectAPI } from '../../api/api';
import '../../styles/main.css';

export default function DataInputForm({
  mode = 'progress', // 'document' or 'progress'
  section,
  yearlyProgress,
  documentStartDate,
  documentEndDate,
  onSaveProgress,
  onDocumentCreated, // Callback when document is created
  loading,
  setAddDocMode, // Optional function to close the form
  initialDoc, // Passed when editing an existing document
  activeProjectId // Mới
}) {
  const [formData, setFormData] = useState({});
  const [editingYears, setEditingYears] = useState(new Set());

  // States for document mode
  const [docData, setDocData] = useState({
    name: '',
    category: 'Kinh tế',
    startDate: '',
    endDate: '',
    description: '',
    driveFileId: '',
    driveFileName: '',
    fileUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setRemoveFile(false);
    }
  };

  useEffect(() => {
    if (mode === 'document' && initialDoc) {
      setDocData({
        name: initialDoc.name || '',
        description: initialDoc.description || '',
        category: initialDoc.category || 'Kinh tế',
        startDate: initialDoc.startDate ? initialDoc.startDate.split('T')[0] : '',
        endDate: initialDoc.endDate ? initialDoc.endDate.split('T')[0] : ''
      });
    } else if (mode === 'project' && initialDoc) {
      setDocData({
        name: initialDoc.name || '',
        description: initialDoc.description || ''
      });
    } else {
      setDocData({
        name: '',
        description: '',
        category: 'Kinh tế',
        startDate: '',
        endDate: ''
      });
    }
  }, [initialDoc, mode]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '';
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Initialize form data from yearly progress
  const initializeFormData = () => {
    if (mode !== 'progress' || !section || !documentStartDate || !documentEndDate) return;

    const startYear = new Date(documentStartDate).getFullYear();
    const endYear = new Date(documentEndDate).getFullYear();
    const newFormData = {};

    for (let year = startYear; year <= endYear; year++) {
      const existing = yearlyProgress?.find(p => p.year === year);
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
    if (mode === 'progress') {
      initializeFormData();
      setEditingYears(new Set());
    }
  }, [section, yearlyProgress, documentStartDate, documentEndDate, mode]);

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'project' && !docData.name) {
      alert("Vui lòng nhập tên chủ đề.");
      return;
    }
    if (mode === 'document' && (!docData.name || !docData.startDate || !docData.endDate)) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    try {
      setIsSubmitting(true);

      let res;
      if (mode === 'project') {
        const payload = { name: docData.name, description: docData.description };
        res = initialDoc
          ? await projectAPI.update(initialDoc._id, payload)
          : await projectAPI.create(payload);
        alert(initialDoc ? "Cập nhật nội dung thành công!" : "Tạo nội dung thành công!");
      } else {
        const formData = new FormData();
        formData.append('name', docData.name);
        formData.append('description', docData.description || '');
        formData.append('category', docData.category);
        formData.append('startDate', docData.startDate);
        formData.append('endDate', docData.endDate);
        formData.append('projectId', activeProjectId);

        if (selectedFile) {
          formData.append('file', selectedFile);
        }
        if (removeFile) {
          formData.append('removeFile', 'true');
        }

        res = initialDoc
          ? await documentAPI.update(initialDoc._id, formData)
          : await documentAPI.create(formData);
        alert(initialDoc ? "Cập nhật nội dung thành công!" : "Thêm nội dung thành công!");
      }

      if (onDocumentCreated) onDocumentCreated(res.data);
      if (setAddDocMode) setAddDocMode(false);
    } catch (error) {
      alert(`Lỗi khi ${mode === 'project' ? 'tạo nội dung' : 'thêm nội dung'}: ` + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'project') {
    return (
      <div style={{ marginTop: '10px' }}>
        <form onSubmit={handleDocSubmit}>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Tên Nội Dung Theo Dõi (Task lớn)</label>
            <input className="tdt-form-input" type="text" value={docData.name || ''} onChange={(e) => setDocData({ ...docData, name: e.target.value })} placeholder="VD: Nghị quyết Đảng bộ xã khóa I..." required />
          </div>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Mô tả (Không bắt buộc)</label>
            <input className="tdt-form-input" type="text" value={docData.description || ''} onChange={(e) => setDocData({ ...docData, description: e.target.value })} placeholder="Mô tả tóm tắt..." />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="tdt-btn-submit" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Đang lưu...' : (initialDoc ? 'Cập Nhật Nội Dung' : 'Lưu Nội Dung')}
            </button>
            <button type="button" className="tdt-btn-cancel-form" onClick={() => setAddDocMode && setAddDocMode(false)} style={{ flex: 1 }}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === 'document') {
    return (
      <div style={{ marginTop: '10px' }}>
        <form onSubmit={handleDocSubmit}>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Tên nội dung</label>
            <input className="tdt-form-input" type="text" value={docData.name} onChange={(e) => setDocData({ ...docData, name: e.target.value })} placeholder="Nhập tên nội dung..." required />
          </div>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Danh mục</label>
            <select className="tdt-form-select" value={docData.category} onChange={(e) => setDocData({ ...docData, category: e.target.value })}>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Xã hội">Xã hội</option>
              <option value="Môi trường">Môi trường</option>
              <option value="Giáo dục">Giáo dục</option>
              <option value="Y tế">Y tế</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="tdt-form-row">
            <div className="tdt-form-group">
              <label className="tdt-form-label">Bắt đầu</label>
              <input className="tdt-form-input" type="date" value={docData.startDate} onChange={(e) => setDocData({ ...docData, startDate: e.target.value })} required />
            </div>
            <div className="tdt-form-group">
              <label className="tdt-form-label">Kết thúc</label>
              <input className="tdt-form-input" type="date" value={docData.endDate} onChange={(e) => setDocData({ ...docData, endDate: e.target.value })} required />
            </div>
          </div>

          {/* File Upload Section for Document */}
          <div className="tdt-form-group">
            <label className="tdt-form-label">Tài liệu đính kèm (Văn bản gốc)</label>
            <div className="tk-drive-link-group" style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
              <div className="tk-drive-link-label" style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                <FaUpload /> File đính kèm (sẽ tải lên Google Drive)
              </div>

              {/* Existing File */}
              {initialDoc && initialDoc.driveFileId && !removeFile && !selectedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#e3f2fd', borderRadius: 6, marginBottom: 8 }}>
                  <FaFile style={{ color: '#1976d2' }} />
                  <span style={{ fontSize: '0.82rem', color: '#1565c0', flex: 1 }}>{initialDoc.driveFileName || 'File đính kèm'}</span>
                  <button
                    type="button"
                    onClick={() => setRemoveFile(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 13 }}
                    title="Xóa file đính kèm"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              {removeFile && (
                <div style={{ fontSize: '0.78rem', color: '#e53935', marginBottom: 8 }}>
                  ⚠️ File đính kèm hiện tại sẽ bị xóa khi lưu.{' '}
                  <button onClick={() => setRemoveFile(false)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.78rem' }}>Hoàn tác</button>
                </div>
              )}

              {/* New File Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="tdt-btn-cancel-form"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', padding: '6px 12px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaUpload /> Chọn file từ máy
                </button>
                {selectedFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32', fontSize: '0.82rem' }}>
                    <FaFile />
                    <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 13 }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="tdt-btn-submit" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Đang lưu...' : (initialDoc ? 'Cập Nhật Nội Dung' : 'Lưu Nội Dung')}
            </button>
            <button type="button" className="tdt-btn-cancel-form" onClick={() => setAddDocMode && setAddDocMode(false)} style={{ flex: 1 }}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- PROGRESS MODE BELOW ---
  if (!section) return null;

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
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={data.actualValue || ''}
                        onChange={(e) => handleInputChange(year, 'actualValue', e.target.value)}
                        className="input-value"
                        disabled={loading}
                      />
                      {data.actualValue && !isNaN(data.actualValue) && (
                        <div style={{ fontSize: '0.7rem', color: '#1565c0', marginTop: '2px', position: 'absolute' }}>
                          {formatNumber(data.actualValue)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{formatNumber(data.actualValue) || '-'}</span>
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
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={data.targetValue || ''}
                        onChange={(e) => handleInputChange(year, 'targetValue', e.target.value)}
                        className="input-target"
                        disabled={loading}
                      />
                      {data.targetValue && !isNaN(data.targetValue) && (
                        <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: '2px', position: 'absolute' }}>
                          {formatNumber(data.targetValue)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{formatNumber(data.targetValue || section.targetValue) || '-'}</span>
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
