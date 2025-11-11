
import { Timestamp } from "firebase/firestore";

export enum Tab {
    LOGBOOK = 'logbook',
    EQUIPMENT = 'equipment',
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
