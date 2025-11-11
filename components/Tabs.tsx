import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    isAdminLoggedIn: boolean;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, isAdminLoggedIn }) => {
    const getTabClass = (tab: Tab) => {
        return `py-4 px-6 cursor-pointer bg-none border-b-3 text-lg font-medium transition-all duration-200 ease-in-out ${
            activeTab === tab 
            ? 'text-brand-text border-brand-accent' 
            : 'text-brand-text-light border-transparent hover:text-brand-text'
        }`;
    };

    return (
        <div className="border-b border-brand-border mb-8">
            <nav className="flex">
                <button className={getTabClass(Tab.DASHBOARD)} onClick={() => setActiveTab(Tab.DASHBOARD)}>
                    Dashboard
                </button>
                <button className={getTabClass(Tab.LOGBOOK)} onClick={() => setActiveTab(Tab.LOGBOOK)}>
                    Logbook
                </button>
                <button className={getTabClass(Tab.EQUIPMENT)} onClick={() => setActiveTab(Tab.EQUIPMENT)}>
                    Equipment
                </button>
                <button className={getTabClass(Tab.COLLATERALS)} onClick={() => setActiveTab(Tab.COLLATERALS)}>
                    Collaterals
                </button>
                {isAdminLoggedIn && (
                    <button className={getTabClass(Tab.ADMIN_SETTINGS)} onClick={() => setActiveTab(Tab.ADMIN_SETTINGS)}>
                        Admin Settings
                    </button>
                )}
            </nav>
        </div>
    );
};

export default Tabs;
