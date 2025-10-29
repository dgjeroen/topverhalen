// src/lib/utils/localStorage.ts

export interface BackupData {
    projectId: string;
    storyName: string;
    theme: Record<string, any>;
    data: any[];
    timestamp: number;
}

const BACKUP_PREFIX = 'topverhalen-backup-';
const BACKUP_EXPIRY = 24 * 60 * 60 * 1000; // 24 uur

export function saveBackup(projectId: string, data: Omit<BackupData, 'projectId' | 'timestamp'>) {
    try {
        const backup: BackupData = {
            projectId,
            ...data,
            timestamp: Date.now()
        };

        localStorage.setItem(
            `${BACKUP_PREFIX}${projectId}`,
            JSON.stringify(backup)
        );

        console.log('✅ Backup saved to localStorage');
    } catch (error) {
        console.error('❌ Failed to save backup:', error);
    }
}

export function getBackup(projectId: string): BackupData | null {
    try {
        const item = localStorage.getItem(`${BACKUP_PREFIX}${projectId}`);
        if (!item) return null;

        const backup: BackupData = JSON.parse(item);

        // Check expiry
        if (Date.now() - backup.timestamp > BACKUP_EXPIRY) {
            clearBackup(projectId);
            return null;
        }

        return backup;
    } catch (error) {
        console.error('❌ Failed to get backup:', error);
        return null;
    }
}

export function clearBackup(projectId: string) {
    try {
        localStorage.removeItem(`${BACKUP_PREFIX}${projectId}`);
        console.log('🗑️ Backup cleared');
    } catch (error) {
        console.error('❌ Failed to clear backup:', error);
    }
}

export function hasBackup(projectId: string): boolean {
    return getBackup(projectId) !== null;
}

export function clearExpiredBackups() {
    try {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach(key => {
            if (key.startsWith(BACKUP_PREFIX)) {
                try {
                    const item = localStorage.getItem(key);
                    if (item) {
                        const backup = JSON.parse(item);
                        if (now - backup.timestamp > BACKUP_EXPIRY) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (e) {
                    // Invalid backup, remove it
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('❌ Failed to clear expired backups:', error);
    }
}