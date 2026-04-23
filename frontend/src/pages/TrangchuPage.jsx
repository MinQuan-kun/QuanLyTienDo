import React from 'react';
import Header from '../components/Trangchu/Header';
import Navbar from '../components/trangchu/Navbar';
import QuickAccess from '../components/Trangchu/QuickAccess';
import '../styles/trangchu.css';
import '../styles/thedoitiendo.css';

const TrangchuPage = () => {
    return (
        <>
            <Header />
            <Navbar />
            <QuickAccess />
        </>
    );
};

export default TrangchuPage;