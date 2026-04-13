import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProgressChart from './ProgressChart';
import DataInputForm from './DataInputForm';
import DocumentModal from './DocumentModal';
import SectionModal from './SectionModal';
import { useDocuments, useSections, useYearlyProgress } from '../hooks/useApi';
import '../styles/main.css';

const CATEGORIES = ['Kinh tế', 'Xã hội', 'Môi trường', 'Giáo dục', 'Y tế', 'Khác'];

export default function ProgressTracker() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Modals
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  // API hooks
  const {
    documents,
    loading: docsLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  } = useDocuments();

  const {
    sections,
    loading: sectionsLoading,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  } = useSections();

  const {
    progressList,
    loading: progressLoading,
    fetchProgress,
    createOrUpdateProgress,
  } = useYearlyProgress();

  // Initial load
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Load sections when document changes
  useEffect(() => {
    if (selectedDocument) {
      fetchSections(selectedDocument._id);
      setSelectedSection(null);
    }
  }, [selectedDocument]);

  // Load yearly progress when section changes
  useEffect(() => {
    if (selectedSection) {
      fetchProgress(selectedSection._id);
    }
  }, [selectedSection]);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || doc.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Handle document operations
  const handleAddDocument = () => {
    setEditingDocument(null);
    setShowDocumentModal(true);
  };

  const handleEditDocument = (doc) => {
    setEditingDocument(doc);
    setShowDocumentModal(true);
  };

  const handleSaveDocument = async (data) => {
    if (editingDocument) {
      await updateDocument(editingDocument._id, data);
    } else {
      const newDoc = await createDocument(data);
      setSelectedDocument(newDoc);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa văn bản này? Tất cả dữ liệu liên quan sẽ bị xóa.')) {
      try {
        await deleteDocument(documentId);
        if (selectedDocument && selectedDocument._id === documentId) {
          setSelectedDocument(null);
          setSelectedSection(null);
        }
      } catch (error) {
        alert('Lỗi khi xóa văn bản: ' + error.message);
      }
    }
  };

  // Handle section operations
  const handleAddSection = () => {
    setEditingSection(null);
    setShowSectionModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  const handleSaveSection = async (data) => {
    if (editingSection) {
      await updateSection(editingSection._id, data);
    } else {
      await createSection(data);
      if (selectedDocument) {
        await fetchSections(selectedDocument._id);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    await deleteSection(sectionId);
  };

  // Handle yearly progress
  const handleSaveProgress = async (data) => {
    const saved = await createOrUpdateProgress(data);
    if (selectedSection) {
      await fetchProgress(selectedSection._id);
    }
    return saved;
  };

  return (
    <div className="progress-tracker">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />

      <div className="tracker-layout">
        {/* Left Panel - Document List */}
        <div className="left-panel">
          <div className="documents-panel">
            <div className="panel-header">
              {/* <h2>Văn Bản</h2> */}
              <button onClick={handleAddDocument} className="btn-primary">
                + Thêm nội dung
              </button>
            </div>

            <div className="documents-list">
              {docsLoading ? (
                <div className="loading">Đang tải...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="empty-state">
                  {documents.length === 0
                    ? 'Chưa có văn bản nào. Hãy thêm một cái mới.'
                    : 'Không tìm thấy kết quả phù hợp'}
                </div>
              ) : (
                filteredDocuments.map(doc => (
                  <div
                    key={doc._id}
                    className={`document-item ${selectedDocument?._id === doc._id ? 'active' : ''}`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="doc-info">
                      <h3>{doc.name}</h3>
                      <p className="category">{doc.category}</p>
                      <p className="dates">
                        {new Date(doc.startDate).getFullYear()} -{' '}
                        {new Date(doc.endDate).getFullYear()}
                      </p>
                    </div>
                    <div className="doc-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDocument(doc);
                        }}
                        className="btn-edit-small"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc._id);
                        }}
                        className="btn-delete-small"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle Panel - Content */}
        <div className="middle-panel">
          {selectedDocument ? (
            <>
              <ProgressChart
                section={selectedSection}
                yearlyProgress={progressList}
                documentStartDate={selectedDocument.startDate}
                documentEndDate={selectedDocument.endDate}
              />

              <DataInputForm
                section={selectedSection}
                yearlyProgress={progressList}
                documentStartDate={selectedDocument.startDate}
                documentEndDate={selectedDocument.endDate}
                onSaveProgress={handleSaveProgress}
                loading={progressLoading}
              />
            </>
          ) : (
            <div className="empty-state large">
              <p>Vui lòng chọn một văn bản để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Right Panel - Sections */}
        {selectedDocument && (
          <div className="right-panel">
            <Sidebar
              sections={sections}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
              onAddSection={handleAddSection}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              loading={sectionsLoading}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setEditingDocument(null);
        }}
        onSave={handleSaveDocument}
        initialData={editingDocument}
        categories={CATEGORIES}
      />

      <SectionModal
        isOpen={showSectionModal}
        onClose={() => {
          setShowSectionModal(false);
          setEditingSection(null);
        }}
        onSave={handleSaveSection}
        initialData={editingSection}
        documentId={selectedDocument?._id}
      />
    </div>
  );
}
