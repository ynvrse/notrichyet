'use client';

import { AddForm } from './components';
import { AddProps } from './types';

export function Add({ userId }: AddProps) {
  return <AddForm userId={userId} />;
}