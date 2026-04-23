import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaSort } from 'react-icons/fa';
import Header from '../components/Theodoitiendotrienkhai/Header';
import Navbar from '../components/Trangchu/Navbar';
import TreeSidebar from '../components/Theodoitiendotrienkhai/TreeSidebar';
import MainTable from '../components/Theodoitiendotrienkhai/MainTable';
import DataModal from '../components/Theodoitiendotrienkhai/DataModal';
import { tienDoTrienKhaiAPI } from '../api/api';
import '../styles/tiendotrienkhai.css';

const TheodoitiendotrienkhaiPage = () => {
    const { user } = useAuth();
    const isEditable = !!user;
    const isAdmin = user?.role === 'admin';

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'

    // Natural sort helper for soKyHieu
    const naturalSort = (a, b) => {
        const ax = (a.soKyHieu || a.tenVanBan || '').split(/(\d+)/);
        const bx = (b.soKyHieu || b.tenVanBan || '').split(/(\d+)/);
        for (let i = 0; i < Math.max(ax.length, bx.length); i++) {
            const ai = ax[i] || '';
            const bi = bx[i] || '';
            const an = parseInt(ai, 10);
            const bn = parseInt(bi, 10);
            if (!isNaN(an) && !isNaN(bn)) {
                if (an !== bn) return an - bn;
            } else {
                const cmp = ai.localeCompare(bi, 'vi');
                if (cmp !== 0) return cmp;
            }
        }
        return 0;
    };

    const cycleSortOrder = () => {
        setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none');
    };

    const [dataRaw, setDataRaw] = useState({
        trungUong: [],
        thanhUy: [],
        dangUy: [],
        ketQua: []
    });

    // Modal state
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        type: '', // 'trung-uong' | 'thanh-uy' | 'dang-uy' | 'ket-qua'
        parentId: null,
        initialData: null,
        nam: currentYear
    });

    const fetchData = async (year) => {
        try {
            const res = await tienDoTrienKhaiAPI.getAllByYear(year);
            setDataRaw(res.data.data);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
        }
    };

    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    // Build tree
    const treeData = useMemo(() => {
        const tuMap = new Map(dataRaw.trungUong.map(tu => [tu._id, { ...tu, children: [] }]));
        const thuMap = new Map(dataRaw.thanhUy.map(thu => [thu._id, { ...thu, children: [] }]));
        const duMap = new Map(dataRaw.dangUy.map(du => [du._id, { ...du, children: [] }]));

        // Gắn kết quả vào đảng ủy
        dataRaw.ketQua.forEach(kq => {
            const du = duMap.get(kq.dangUyId);
            if (du) {
                du.children.push(kq);
            }
        });

        // Gắn đảng ủy vào thành ủy hoặc trung ương
        duMap.forEach(du => {
            if (du.thanhUyId) {
                const thu = thuMap.get(du.thanhUyId);
                if (thu) thu.children.push({ ...du, treeType: 'dang-uy' });
            } else if (du.trungUongId) {
                const tu = tuMap.get(du.trungUongId);
                if (tu) tu.children.push({ ...du, treeType: 'dang-uy' });
            }
        });

        // Gắn thành ủy vào trung ương
        thuMap.forEach(thu => {
            const tu = tuMap.get(thu.trungUongId);
            if (tu) {
                tu.children.push({ ...thu, treeType: 'thanh-uy' });
            }
        });

        let result = Array.from(tuMap.values());

        // Search filter
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            const nodeMatches = (node) => {
                return (node.soKyHieu || '').toLowerCase().includes(q)
                    || (node.tenVanBan || '').toLowerCase().includes(q)
                    || (node.trichYeu || '').toLowerCase().includes(q)
                    || (node.ghiChu || '').toLowerCase().includes(q)
                    || (node.noiDung || '').toLowerCase().includes(q);
            };
            result = result.filter(tu => {
                if (nodeMatches(tu)) return true;
                return (tu.children || []).some(child => {
                    if (nodeMatches(child)) return true;
                    return (child.children || []).some(gc => {
                        if (nodeMatches(gc)) return true;
                        return (gc.children || []).some(nodeMatches);
                    });
                });
            });
        }

        // Sort
        if (sortOrder === 'asc') {
            result = [...result].sort(naturalSort);
        } else if (sortOrder === 'desc') {
            result = [...result].sort((a, b) => naturalSort(b, a));
        }

        return result;
    }, [dataRaw, searchTerm, sortOrder]);

    const openModal = (type, parentId = null, extra = null) => {
        let initialData = null;
        let parentType = null;

        if (extra && typeof extra === 'string') {
            parentType = extra;
        } else if (extra && typeof extra === 'object') {
            initialData = extra;
        }

        const titles = {
            'trung-uong': initialData ? 'Sửa VB Trung ương' : 'Thêm VB Trung ương',
            'thanh-uy': initialData ? 'Sửa VB Thành ủy' : 'Thêm VB Thành ủy',
            'dang-uy': initialData ? 'Sửa VB Đảng ủy' : 'Thêm VB Đảng ủy',
            'ket-qua': initialData ? 'Sửa Nội dung triển khai' : 'Thêm Nội dung triển khai',
        };
        setModalConfig({
            isOpen: true,
            title: titles[type],
            type,
            parentId,
            parentType,
            initialData,
            nam: selectedYear
        });
    };

    const handleModalSubmit = async (formData) => {
        const { type, initialData } = modalConfig;
        if (initialData) {
            // Update
            if (type === 'trung-uong') await tienDoTrienKhaiAPI.updateTrungUong(initialData._id, formData);
            if (type === 'thanh-uy') await tienDoTrienKhaiAPI.updateThanhUy(initialData._id, formData);
            if (type === 'dang-uy') await tienDoTrienKhaiAPI.updateDangUy(initialData._id, formData);
            if (type === 'ket-qua') await tienDoTrienKhaiAPI.updateKetQua(initialData._id, formData);
        } else {
            // Create
            if (type === 'trung-uong') await tienDoTrienKhaiAPI.createTrungUong(formData);
            if (type === 'thanh-uy') await tienDoTrienKhaiAPI.createThanhUy(formData);
            if (type === 'dang-uy') await tienDoTrienKhaiAPI.createDangUy(formData);
            if (type === 'ket-qua') await tienDoTrienKhaiAPI.createKetQua(formData);
        }
        fetchData(selectedYear); // refresh
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Bạn có chắc muốn xóa mục này? Toàn bộ mục con cũng sẽ mất kết nối.')) return;
        try {
            if (type === 'trung-uong') await tienDoTrienKhaiAPI.deleteTrungUong(id);
            if (type === 'thanh-uy') await tienDoTrienKhaiAPI.deleteThanhUy(id);
            if (type === 'dang-uy') await tienDoTrienKhaiAPI.deleteDangUy(id);
            if (type === 'ket-qua') await tienDoTrienKhaiAPI.deleteKetQua(id);
            fetchData(selectedYear);
        } catch (err) {
            alert('Lỗi xóa: ' + err.message);
        }
    };

    return (
        <div className="tdttk-page">
            <Header />
            <Navbar />

            <div className="tdttk-year-selector">
                <label style={{ fontWeight: 600, color: '#334155' }}>Năm theo dõi:</label>
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(parseInt(e.target.value))}
                    style={{ color: '#334155' }}
                >
                    {years.map(y => (
                        <option
                            key={y}
                            value={y}
                            style={{
                                color: y === selectedYear ? '#334155' : '#94a3b8'
                            }}
                        >
                            {y}
                        </option>
                    ))}
                </select>

                {/* Search */}
                <div style={{ flex: 1, position: 'relative', maxWidth: '360px' }}>
                    <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Tìm theo số ký hiệu, trích yếu..."
                        style={{
                            width: '100%', padding: '7px 32px 7px 32px',
                            border: '1px solid #cbd5e1', borderRadius: '6px',
                            fontSize: '0.88rem', outline: 'none', background: '#f8fafc'
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.9rem' }}
                        >✕</button>
                    )}
                </div>

                {/* Sort */}
                <button
                    onClick={cycleSortOrder}
                    title={sortOrder === 'none' ? 'Sắp xếp theo ký hiệu' : sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', border: sortOrder !== 'none' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                        background: sortOrder !== 'none' ? '#eff6ff' : '#fff',
                        color: sortOrder !== 'none' ? '#2563eb' : '#64748b',
                        transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                >
                    {sortOrder === 'asc' ? <FaSortAlphaDown /> : sortOrder === 'desc' ? <FaSortAlphaUp /> : <FaSort />}
                    {sortOrder === 'none' ? 'Sắp xếp' : sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
            </div>

            <div className="tdttk-main-layout">
                {/* Left Sidebar - Tree View */}
                <TreeSidebar
                    treeData={treeData}
                    isEditable={isEditable}
                    isAdmin={isAdmin}
                    onAdd={openModal}
                    onEdit={openModal}
                    onDelete={handleDelete}
                />

                {/* Center Content - Table View */}
                <div className="tdttk-content">
                    <MainTable treeData={treeData} />
                </div>
            </div>

            <DataModal
                {...modalConfig}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default TheodoitiendotrienkhaiPage;