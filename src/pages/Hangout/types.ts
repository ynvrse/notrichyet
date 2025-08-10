
export type SplitMethod = 'equal' | 'percentage' | 'manual' | 'treat';

export interface HangoutProps {
    userId: string;
    userProfile?: {
        fullName: string;
        profilePicture?: string;
    };
}
