import React, { useState, useEffect } from 'react';
import { Tab, LogEntry, EquipmentItem, AdminUser, CollateralItem } from './types';
import LogbookView from './components/LogbookView';
import EquipmentView from './components/EquipmentView';
import DashboardView from './components/DashboardView';
import LoginModal from './components/LoginModal';
import Tabs from './components/Tabs';
import AdminSettingsView from './components/AdminSettingsView';
import CollateralsView from './components/CollateralsView';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './index';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [collaterals, setCollaterals] = useState<CollateralItem[]>([]);
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

    const fetchAdmins = async () => {
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, orderBy('username', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedAdmins = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminUser[];
            setAdmins(fetchedAdmins);
        } catch (error) {
            console.error("Error fetching admins: ", error);
        }
    };

    const fetchCollaterals = async () => {
        try {
            const collateralsCollection = collection(db, 'collaterals');
            const q = query(collateralsCollection, orderBy('name', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedCollaterals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CollateralItem[];
            setCollaterals(fetchedCollaterals);
        } catch (error) {
            console.error("Error fetching collaterals: ", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchLogs(), fetchEquipment(), fetchAdmins(), fetchCollaterals()]);
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
        setActiveTab(Tab.DASHBOARD);
    };
    
    return (
        <div className="container mx-auto p-5 max-w-7xl">
            <header className="text-center py-10 animate-slideUpFadeIn">
                <h1 className="text-4xl font-semibold m-0">Marketing Equipment Hub</h1>
            </header>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} isAdminLoggedIn={isAdminLoggedIn}/>

            <main className="tab-content">
                <div className={`tab-pane ${activeTab === Tab.DASHBOARD ? 'block' : 'hidden'}`}>
                    <DashboardView logs={logs} equipment={equipment} />
                </div>
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
                <div className={`tab-pane ${activeTab === Tab.COLLATERALS ? 'block' : 'hidden'}`}>
                    <CollateralsView
                        isAdminLoggedIn={isAdminLoggedIn}
                        collaterals={collaterals}
                        fetchCollaterals={fetchData}
                    />
                </div>
                <div className={`tab-pane ${activeTab === Tab.ADMIN_SETTINGS ? 'block' : 'hidden'}`}>
                    <AdminSettingsView 
                        admins={admins}
                        fetchAdmins={fetchData}
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
