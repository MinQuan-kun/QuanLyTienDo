



// import React from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import Sidebar from '../components/Theodoitiendo/Sidebar';
// import Header from '../components/Theodoitiendo/Header';
// import ProgressTracker from '../components/Theodoitiendo/ProgressTracker';
// import DataInputForm from '../components/Theodoitiendo/DataInputForm';
// import ProgressChart from '../components/Theodoitiendo/ProgressChart';
// import Navbar from '../components/Trangchu/Navbar';
// const TheodoitiendoPage = () => {
//     const { user } = useAuth();

//     return (
//         /* 1. Container bao quanh toàn bộ trang, xếp theo chiều dọc (flex-col) */
//         <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100">

//             <div className="flex flex-1 overflow-hidden">
                

//                 {/* 4. Vùng nội dung chính bên phải */}
//                 <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

//                     {/* Bảng tiến độ chi tiết */}
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                         <ProgressTracker isReadOnly={!user} />
//                     </div>
                    
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default TheodoitiendoPage;