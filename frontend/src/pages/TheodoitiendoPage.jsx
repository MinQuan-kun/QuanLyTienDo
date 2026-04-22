import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Theodoitiendo/Header';
import SearchFilterBar from '../components/Theodoitiendo/Navbar';
import DocumentList from '../components/Theodoitiendo/DocumentList';
import MainContent from '../components/Theodoitiendo/MainContent';
import DocumentDetails from '../components/Theodoitiendo/DocumentDetails';
import DataInputForm from '../components/Theodoitiendo/DataInputForm';
import DataInputModal from '../components/Theodoitiendo/DataInputModal';
import { documentAPI, projectAPI } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/thedoitiendo.css';

const TheodoitiendoPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Project states
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Document states
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const { user } = useAuth();
  const isEditable = !!user;
  const isAdmin = user?.role === 'admin';

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      const list = res.data.data || [];
      setProjects(list);
      if (list.length > 0 && !activeProject) {
        setActiveProject(list[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch documents
  const fetchDocuments = async (projId) => {
    if (!projId) return;
    try {
      const res = await documentAPI.getAll({ projectId: projId });
      setDocuments(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  useEffect(() => {
    if (activeProject) {
      fetchDocuments(activeProject._id);
    }
  }, [activeProject]);

  useEffect(() => {
    setSelectedSection(null);
  }, [selectedDoc]);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'All' || doc.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [documents, searchTerm, categoryFilter]);

  // Handlers
  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nội dung này?')) return;
    try {
      await documentAPI.delete(docId);
      if (selectedDoc?._id === docId) {
        setSelectedDoc(null);
        setSelectedSection(null);
      }
      fetchDocuments(activeProject?._id);
    } catch (err) {
      alert('Lỗi xóa: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditDoc = (doc) => {
    setEditingDoc(doc);
    setIsAddingDoc(true);
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nội dung theo dõi này?\nToàn bộ dữ liệu (nội dung mục tiêu, tiến độ) sẽ bị xóa vĩnh viễn!')) return;
    try {
      await projectAPI.delete(projId);
      if (activeProject?._id === projId) {
        setActiveProject(null);
        setSelectedDoc(null);
        setSelectedSection(null);
        setDocuments([]);
      }
      fetchProjects();
    } catch (err) {
      alert('Lỗi xóa: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="tdt-page">
      <Header />

      <SearchFilterBar
        onSearch={setSearchTerm}
        onFilterCategory={setCategoryFilter}
        currentFilter={categoryFilter}
        onRefresh={() => window.location.reload()}
        onCreateNew={isEditable ? () => {
          setEditingProject(null);
          setIsAddingProject(true);
        } : undefined}
      />

      {/* Project Tabs / Thanh theo dõi */}
      <div className="tdt-project-tabs" style={{ display: 'flex', gap: '8px', padding: '10px 24px', background: '#fff', borderBottom: '1px solid #ccc', overflowX: 'auto', alignItems: 'center' }}>
        {projects.length === 0 && <span style={{ fontSize: '0.85rem', color: '#888' }}>Chưa có nội dung nào...</span>}
        {projects.map(proj => (
          <div
            key={proj._id}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
          >
            <button
              onClick={() => {
                setActiveProject(proj);
                setSelectedDoc(null);
                setSelectedSection(null);
              }}
              style={{
                padding: isAdmin ? '8px 28px 8px 16px' : '8px 16px',
                border: 'none',
                background: activeProject?._id === proj._id ? '#4caf50' : '#f0f0f0',
                color: activeProject?._id === proj._id ? '#fff' : '#333',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              {proj.name}
            </button>
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(proj._id);
                }}
                title="Xóa nội dung theo dõi"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeProject?._id === proj._id ? 'rgba(255,255,255,0.7)' : '#999',
                  lineHeight: 1,
                  padding: '2px 4px',
                  borderRadius: '50%',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#e53935'}
                onMouseLeave={(e) => e.target.style.color = activeProject?._id === proj._id ? 'rgba(255,255,255,0.7)' : '#999'}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="tdt-main-layout">
        {/* Left Column - Document List */}
        <aside className="tdt-col-left">

          {/* Add Project Modal */}
          <DataInputModal
            isOpen={isAddingProject}
            onClose={() => {
              setIsAddingProject(false);
              setEditingProject(null);
            }}
            title={editingProject ? "Sửa Nội Dung" : "Thêm Nội Dung Mới"}
          >
            <DataInputForm
              mode="project"
              initialDoc={editingProject}
              setAddDocMode={(val) => {
                setIsAddingProject(val);
                if (!val) setEditingProject(null);
              }}
              onDocumentCreated={(newProj) => {
                fetchProjects();
                setActiveProject(newProj);
              }}
            />
          </DataInputModal>

          {/* Add Document Modal */}
          <DataInputModal
            isOpen={isAddingDoc}
            onClose={() => {
              setIsAddingDoc(false);
              setEditingDoc(null);
            }}
            title={editingDoc ? "Sửa Nội Dung" : "Thêm Nội Dung Mới"}
          >
            <DataInputForm
              mode="document"
              initialDoc={editingDoc}
              setAddDocMode={(val) => {
                setIsAddingDoc(val);
                if (!val) setEditingDoc(null);
              }}
              onDocumentCreated={() => {
                fetchDocuments(activeProject?._id);
              }}
              activeProjectId={activeProject?._id}
            />
          </DataInputModal>

          <DocumentList
            docs={filteredDocs}
            activeProjectName={activeProject?.name || 'Văn Bản'}
            onSelect={setSelectedDoc}
            selectedId={selectedDoc?._id}
            isEditable={isEditable}
            isAdmin={isAdmin}
            onAddDoc={() => setIsAddingDoc(true)}
            onEditDoc={handleEditDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        </aside>

        {/* Middle Column - Main Content */}
        <main className="tdt-col-middle">
          <MainContent
            selectedDoc={selectedDoc}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            isEditable={isEditable}
          />
        </main>

        {/* Right Column - Section Details */}
        <aside className="tdt-col-right">
          <DocumentDetails
            selectedDoc={selectedDoc}
            selectedSection={selectedSection}
            isEditable={isEditable}
            isAdmin={isAdmin}
            onSectionCreated={() => {
              // Refresh main content sections
              setSelectedSection(null);
            }}
            onSectionDeleted={() => {
              setSelectedSection(null);
            }}
          />
        </aside>
      </div>
    </div>
  );
};

export default TheodoitiendoPage;