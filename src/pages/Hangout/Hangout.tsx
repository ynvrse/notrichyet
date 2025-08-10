'use client';

import { HangoutForm } from './components';
import { HangoutProps } from './types';

export function Hangout({ userProfile }: HangoutProps) {
    return <HangoutForm userProfile={userProfile} />;
}
