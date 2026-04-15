import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Trangchu/Header';
import Navbar from '../components/Trangchu/Navbar';
import QuickAccess from '../components/Trangchu/QuickAccess';
import '../styles/trangchu.css';
import '../styles/thedoitiendo.css';

const TrangchuPage = () => {
    const { user } = useAuth();

    return (
        <>
            <Header />
            <Navbar />
            <QuickAccess />
        </>
    );
};

export default TrangchuPage;