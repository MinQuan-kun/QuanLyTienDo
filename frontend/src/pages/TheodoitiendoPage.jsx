import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Theodoitiendo/Header';
import Navbar from '../components/Theodoitiendo/Navbar';
const TheodoitiendoPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useAuth();
    return (
        <>
            <Header />
            <Navbar onSearch={(value) => setSearchTerm(value)} />
        </>

    );
};

export default TheodoitiendoPage;