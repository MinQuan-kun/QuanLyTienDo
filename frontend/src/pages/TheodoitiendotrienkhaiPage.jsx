import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Theodoitiendotrienkhai/Header';
import Navbar from '../components/Theodoitiendo/Navbar';
import '../styles/trangchu.css';
import '../styles/thedoitiendo.css';

const TheodoitiendotrienkhaiPage = () => {
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

    return (
        <>
            <Header />
            <Navbar
                onSearch={setSearchTerm}
                onFilterCategory={setCategoryFilter}
                currentFilter={categoryFilter}
                onRefresh={() => window.location.reload()}
                onCreateNew={isEditable ? () => {
                    setEditingProject(null);
                    setIsAddingProject(true);
                } : undefined}
            />
        </>
    );
};

export default TheodoitiendotrienkhaiPage;