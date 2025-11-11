
import React, { useState, useEffect } from 'react';
import { Tab, LogEntry, EquipmentItem } from './types';
import LogbookView from './components/LogbookView';
import EquipmentView from './components/EquipmentView';
import LoginModal from './components/LoginModal';
import Tabs from './components/Tabs';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './index';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.LOGBOOK);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const logsCollection = collection(db, 'logs');
            const q = query(logsCollection, orderBy('borrowDate', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LogEntry[];
            setLogs(fetchedLogs);
        } catch (error) {
            console.error("Error fetching logs: ", error);
            alert("Could not connect to the database for logs. Please check your Firebase setup and internet connection.");
        }
    };

    const fetchEquipment = async () => {
        try {
            const equipmentCollection = collection(db, 'equipment');
            const q = query(equipmentCollection, orderBy('name', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedEquipment = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EquipmentItem[];
            setEquipment(fetchedEquipment);
        } catch (error) {
            console.error("Error fetching equipment: ", error);
            alert("Could not connect to the database for equipment. Please check your Firebase setup and internet connection.");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchLogs(), fetchEquipment()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLoginSuccess = () => {
        setIsAdminLoggedIn(true);
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
    };
    
    return (
        <div className="container mx-auto p-5 max-w-7xl">
            <header className="text-center py-10 animate-slideUpFadeIn">
                <h1 className="text-4xl font-semibold m-0">Marketing Equipment Hub</h1>
            </header>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="tab-content">
                <div className={`tab-pane ${activeTab === Tab.LOGBOOK ? 'block' : 'hidden'}`}>
                    <LogbookView
                        isAdminLoggedIn={isAdminLoggedIn}
                        logs={logs}
                        equipment={equipment}
                        fetchLogs={fetchData}
                        onLoginClick={() => setIsLoginModalOpen(true)}
                        onLogoutClick={handleLogout}
                    />
                </div>
                <div className={`tab-pane ${activeTab === Tab.EQUIPMENT ? 'block' : 'hidden'}`}>
                    <EquipmentView 
                        isAdminLoggedIn={isAdminLoggedIn}
                        equipment={equipment}
                        fetchEquipment={fetchData}
                    />
                </div>
            </main>

            <footer className="text-center py-10 text-brand-text-light text-sm">
                <p>All equipment must be returned in the condition it was borrowed.</p>
            </footer>

            {isLoginModalOpen && (
                <LoginModal
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
};

// Animation utility styles are not directly translatable to Tailwind config without plugins,
// so we define a helper to inject them if needed, or rely on Tailwind's animation classes.
// For this case, we can use a simple CSS-in-JS for the keyframes.
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes slideUpFadeIn { 
    from { opacity: 0; transform: translateY(20px); } 
    to { opacity: 1; transform: translateY(0); } 
}
.animate-slideUpFadeIn { 
    animation: slideUpFadeIn 0.6s ease-out forwards; 
}
.tab-pane {
    animation: slideUpFadeIn 0.5s ease-out;
}
`;
document.head.appendChild(styleSheet);


export default App;
