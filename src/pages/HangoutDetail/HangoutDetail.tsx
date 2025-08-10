import { format } from 'date-fns';
import { id as IND } from 'date-fns/locale';
import { useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, CheckIcon, CrownIcon, MapPinIcon, ShareIcon } from 'lucide-react';

import { useHangout } from '../Hangout/useHangout';
import { ExpenseList } from './ExpenseList';
import { HangoutSettingsModal } from './hangout-setting-modal';

export function HangoutDetail() {
    const { id } = useParams<{ id: string }>();
    const {
        allHangouts,
        allProfiles,
        userId,
        getParticipantOwes,
        calculateHangoutTotal,
        copyJoinCode,
        formatCurrency,
    } = useHangout();

    const currentUserId = userId;

    const hangout = allHangouts.find((h) => h.id === id);
    if (!hangout) return <p>Hangout not found</p>;

    const total = calculateHangoutTotal(hangout);
    const participantCount = hangout.hangoutParticipants?.length ?? 0;
    const expenseCount = hangout.hangoutExpenses?.length ?? 0;

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-4">
            <Card className="relative overflow-hidden shadow-lg">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                    {hangout.ownerId && <CrownIcon className="h-5 w-5 text-yellow-500" />}
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                        {hangout.splitMethod}
                    </Badge>
                    {currentUserId === hangout.ownerId && (
                        <HangoutSettingsModal
                            hangout={hangout}
                            formatCurrency={formatCurrency}
                            // onUpdate={onUpdate}
                        />
                    )}
                </div>

                <CardContent className="mt-2 p-0">
                    {/* HEADER */}
                    <div className="border-b p-2">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <h2 className="text-2xl font-bold">{hangout.title}</h2>
                                </div>
                                {hangout.description && (
                                    <p className="text-muted-foreground mb-3 text-sm">{hangout.description}</p>
                                )}
                                <div className="text-muted-foreground flex gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        {format(new Date(hangout.date), 'dd MMM yyyy', { locale: IND })}
                                    </div>
                                    {hangout.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="h-4 w-4" />
                                            {hangout.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-orange-600">{formatCurrency(total)}</div>
                                <p className="text-muted-foreground text-xs">Total Expenses</p>
                            </div>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="divide-muted grid grid-cols-3 divide-x border-b">
                        <div className="p-4 text-center">
                            <div className="text-lg font-semibold">{participantCount}</div>
                            <div className="text-muted-foreground text-xs">Participants</div>
                        </div>
                        <div className="p-4 text-center">
                            <div className="text-lg font-semibold">{expenseCount}</div>
                            <div className="text-muted-foreground text-xs">Expenses</div>
                        </div>
                        <div className="p-4 text-center">
                            <div className="text-lg font-semibold text-orange-600">
                                {total > 0 ? formatCurrency(total / Math.max(participantCount, 1)) : formatCurrency(0)}
                            </div>
                            <div className="text-muted-foreground text-xs">Per Person</div>
                        </div>
                    </div>

                    {/* PARTICIPANTS */}
                    <div className="border-b p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-medium">Participants</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyJoinCode(hangout.joinCode ?? '')}
                                className="text-xs"
                            >
                                <ShareIcon className="mr-1 h-4 w-4" />
                                {hangout.joinCode}
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {hangout.hangoutParticipants?.map((participant) => {
                                const profile = allProfiles.find((p) => p.userId === participant.userId);
                                const owes = getParticipantOwes(hangout, participant.userId);

                                return (
                                    <div
                                        key={participant.id}
                                        className="flex items-center gap-2 rounded-full border px-3 py-1 shadow-sm"
                                    >
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={profile?.profilePicture} />
                                            <AvatarFallback>{participant.displayName?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">
                                            {participant.displayName}
                                            {participant.userId === hangout.ownerId && ' (Owner)'}
                                        </span>
                                        {owes > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {formatCurrency(owes)}
                                            </Badge>
                                        )}
                                        {participant.hasConfirmed && <CheckIcon className="h-4 w-4 text-green-500" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* EXPENSES */}

                    <ExpenseList hangout={hangout} allProfiles={allProfiles} currentUserId={currentUserId} />
                </CardContent>
            </Card>
        </div>
    );
}
