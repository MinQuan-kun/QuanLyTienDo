import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaLock, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import { sectionAPI, yearlyProgressAPI } from '../../api/api';
import DataInputModal from './DataInputModal';

const DocumentDetails = ({ selectedDoc, selectedSection, isEditable, isAdmin, onSectionCreated, onSectionDeleted }) => {
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newSection, setNewSection] = useState({ name: '', targetValue: '', unit: '%', description: '', order: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Yearly progress input for selected section
  const [yearlyData, setYearlyData] = useState([]);
  const [editingYear, setEditingYear] = useState(null);
  const [editValues, setEditValues] = useState({ actualValue: '', note: '' });

  // Fetch sections when doc changes
  useEffect(() => {
    if (!selectedDoc) {
      setSections([]);
      return;
    }
    fetchSections();
  }, [selectedDoc]);

  // Fetch yearly data when section changes
  useEffect(() => {
    if (!selectedSection) {
      setYearlyData([]);
      return;
    }
    fetchYearlyData();
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const res = await sectionAPI.getByDocument(selectedDoc._id);
      setSections(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch sections', err);
    }
  };

  const fetchYearlyData = async () => {
    try {
      const res = await yearlyProgressAPI.getBySection(selectedSection._id);
      setYearlyData(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch yearly data', err);
    }
  };

  const openAddModal = () => {
    setEditingSectionId(null);
    setNewSection({ name: '', targetValue: '', unit: '%', description: '', order: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (section) => {
    setEditingSectionId(section._id);
    setNewSection({
      name: section.name,
      targetValue: section.targetValue,
      unit: section.unit || '%',
      description: section.description || '',
      order: section.order || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSection = async () => {
    if (!newSection.name || !newSection.targetValue) {
      alert('Vui lòng nhập tên mục tiêu và giá trị mục tiêu');
      return;
    }
    try {
      // No longer using FormData for sections as file upload moved to Documents
      const payload = {
        name: newSection.name,
        targetValue: parseFloat(newSection.targetValue),
        unit: newSection.unit || '%',
        description: newSection.description || '',
        order: newSection.order !== '' ? parseInt(newSection.order) : 0,
      };
      
      if (editingSectionId) {
        await sectionAPI.update(editingSectionId, payload);
      } else {
        payload.documentId = selectedDoc._id;
        await sectionAPI.create(payload);
        if (onSectionCreated) onSectionCreated();
      }

      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) return;
    try {
      await sectionAPI.delete(sectionId);
      fetchSections();
      if (onSectionDeleted) onSectionDeleted();
    } catch (err) {
      alert('Lỗi xóa: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveYearlyProgress = async (year) => {
    try {
      await yearlyProgressAPI.createOrUpdate({
        sectionId: selectedSection._id,
        year,
        actualValue: parseFloat(editValues.actualValue),
        targetValue: selectedSection.targetValue,
        note: editValues.note,
      });
      setEditingYear(null);
      fetchYearlyData();
    } catch (err) {
      alert('Lỗi lưu: ' + (err.response?.data?.message || err.message));
    }
  };

  // Get years range from document
  const getYearsRange = () => {
    if (!selectedDoc) return [];
    const start = new Date(selectedDoc.startDate).getFullYear();
    const end = new Date(selectedDoc.endDate).getFullYear();
    const years = [];
    for (let y = start; y <= end; y++) years.push(y);
    return years;
  };

  if (!selectedDoc) {
    return (
      <>
        <div className="tdt-panel-header">
          <h2 className="tdt-panel-title">Các Mục Tiêu</h2>
        </div>
        <div className="tdt-objective-empty">
          Chọn văn kiện để xem mục tiêu
        </div>
      </>
    );
  }

  return (
    <>
      {/* Panel Header */}
      <div className="tdt-panel-header">
        <h2 className="tdt-panel-title">
          Các Mục Tiêu
          {selectedDoc?.fileUrl && (
            <a 
              href={selectedDoc.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tdt-panel-file-link"
              title="Xem văn bản đính kèm"
            >
              <FaExternalLinkAlt /> Xem văn bản
            </a>
          )}
        </h2>
        {isEditable && (
          <button className="tdt-btn-add" onClick={openAddModal}>
            <FaPlus style={{ fontSize: '11px' }} /> Thêm Mục...
          </button>
        )}
      </div>

      {/* Add/Edit Section Modal */}
      <DataInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSectionId ? "Sửa mục tiêu" : "Thêm mục tiêu mới"}
      >
        <div className="tdt-form-group">
          <label className="tdt-form-label">Tên mục tiêu</label>
          <input
            className="tdt-form-input"
            placeholder="Nhập tên mục tiêu..."
            value={newSection.name}
            onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
          />
        </div>
        <div className="tdt-form-row">
          <div className="tdt-form-group">
            <label className="tdt-form-label">Mục tiêu</label>
            <input
              className="tdt-form-input"
              type="number"
              placeholder="VD: 100"
              value={newSection.targetValue}
              onChange={(e) => setNewSection({ ...newSection, targetValue: e.target.value })}
            />
          </div>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Thứ tự</label>
            <input
              className="tdt-form-input"
              type="number"
              placeholder="VD: 1, 2, 3..."
              value={newSection.order}
              onChange={(e) => setNewSection({ ...newSection, order: e.target.value })}
            />
          </div>
          <div className="tdt-form-group">
            <label className="tdt-form-label">Đơn vị</label>
            <select
              className="tdt-form-select"
              value={newSection.unit}
              onChange={(e) => setNewSection({ ...newSection, unit: e.target.value })}
            >
              <option value="%">%</option>
              <option value="người">Người</option>
              <option value="doanh nghiệp">Doanh nghiệp</option>
              <option value="vụ">Vụ</option>
              <option value="trường">Trường</option>
              <option value="đồng">Đồng</option>
              <option value="lao động">Lao động</option>
              <option value="khác">Khác</option>
            </select>
          </div>
        </div>
        <div className="tdt-form-group">
          <label className="tdt-form-label">Mô tả</label>
          <input
            className="tdt-form-input"
            placeholder="Mô tả chi tiết (tùy chọn)"
            value={newSection.description}
            onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            className="tdt-btn-submit"
            onClick={handleSaveSection}
            disabled={isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu mục tiêu'}
          </button>
          <button
            className="tdt-btn-cancel-form"
            onClick={() => setIsModalOpen(false)}
            style={{ width: '100%' }}
          >
            Hủy
          </button>
        </div>
      </DataInputModal>

      {/* Sections / Objectives List */}
      <div className="tdt-objective-list">
        {sections.length === 0 && (
          <div className="tdt-objective-empty">
            Chưa có mục tiêu nào
          </div>
        )}
        {sections.map((section) => (
          <div
            key={section._id}
            className={`tdt-objective-item tdt-animate-in ${selectedSection?._id === section._id ? 'active' : ''}`}
            onClick={() => {/* selection handled via parent */ }}
          >
            <div className="tdt-objective-header">
              <span className="tdt-objective-name">
                {section.order > 0 ? `(${section.order}) ` : ''}{section.name}
              </span>
              {isEditable && (
                <div className="tdt-doc-actions">
                  <button
                    className="tdt-btn-icon edit"
                    title="Chỉnh sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(section);
                    }}
                  >
                    <FaEdit />
                  </button>
                  {isAdmin && (
                    <button
                      className="tdt-btn-icon delete"
                      title="Xóa"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="tdt-objective-meta">
              Mục tiêu: <strong>{section.targetValue}{section.unit}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Yearly Data Input - Only for logged in users with a selected section */}
      {selectedSection && (
        <div className="tdt-input-section tdt-animate-in">
          {isEditable ? (
            <>
              <h4 className="tdt-input-title">Nhập dữ liệu: {selectedSection.name}</h4>
              <table className="tdt-year-table">
                <thead>
                  <tr>
                    <th>Năm</th>
                    <th>Thực tế</th>
                    <th>Ghi chú</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {getYearsRange().map(year => {
                    const existing = yearlyData.find(d => d.year === year);
                    const isEditing = editingYear === year;

                    return (
                      <tr key={year}>
                        <td><strong>{year}</strong></td>
                        <td>
                          {isEditing ? (
                            <input
                              className="tdt-year-input"
                              type="number"
                              step="1"
                              value={editValues.actualValue}
                              onChange={(e) => setEditValues({ ...editValues, actualValue: e.target.value })}
                              placeholder=""
                            />
                          ) : (
                            <span>{existing?.actualValue || '-'}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="tdt-year-input"
                              type="text"
                              value={editValues.note}
                              onChange={(e) => setEditValues({ ...editValues, note: e.target.value })}
                              placeholder="Ghi chú..."
                            />
                          ) : (
                            <span style={{ color: '#888' }}>{existing?.note || '-'}</span>
                          )}
                        </td>
                        <td>
                          <div className="tdt-year-actions">
                            {isEditing ? (
                              <>
                                <button
                                  className="tdt-btn-sm save"
                                  onClick={() => handleSaveYearlyProgress(year)}
                                >
                                  Lưu
                                </button>
                                <button
                                  className="tdt-btn-sm cancel"
                                  onClick={() => setEditingYear(null)}
                                >
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <button
                                className="tdt-btn-sm edit"
                                onClick={() => {
                                  setEditingYear(year);
                                  setEditValues({
                                    actualValue: existing?.actualValue || '',
                                    note: existing?.note || '',
                                  });
                                }}
                              >
                                Sửa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div className="tdt-guest-warning">
              <FaLock className="tdt-guest-icon" />
              <span>Vui lòng đăng nhập để có quyền thêm mục tiêu và cập nhật tiến độ.</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DocumentDetails;