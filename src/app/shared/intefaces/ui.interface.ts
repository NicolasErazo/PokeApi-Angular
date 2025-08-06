export interface MenuItem {
    label: string;
    icon?: string;
    route?: string;
    action?: () => void;
    children?: MenuItem[];
}

export interface NotificationConfig {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: {
        label: string;
        handler: () => void;
    };
}

export interface ModalConfig {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'confirm' | 'alert' | 'custom';
}

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'number' | 'date' | 'custom';
    width?: string;
}