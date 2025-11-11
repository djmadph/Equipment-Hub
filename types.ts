import { Timestamp } from "firebase/firestore";

export enum Tab {
    DASHBOARD = 'dashboard',
    LOGBOOK = 'logbook',
    EQUIPMENT = 'equipment',
    COLLATERALS = 'collaterals',
    ADMIN_SETTINGS = 'admin_settings',
}

export interface LogEntry {
    id: string;
    requestor: string;
    purpose: string;
    item: string;
    borrowDate: Timestamp;
    returnDate: Timestamp;
    status: 'PENDING' | 'BORROWED' | 'RETURNED';
    clearedBy: string;
}

export interface EquipmentItem {
    id: string;
    name: string;
    imageUrl: string;
}

export interface AdminUser {
    id: string;
    username: string;
    password: string;
}

export interface CollateralItem {
    id: string;
    name: string;
    location: string;
    quantity: number;
    remarks: string;
}
