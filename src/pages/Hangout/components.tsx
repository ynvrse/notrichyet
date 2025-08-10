import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    CalendarIcon,
    CheckIcon,
    CrownIcon,
    MapPinIcon,
    MessageCircleIcon,
    PartyPopperIcon,
    PlusIcon,
    ReceiptIcon,
    SettingsIcon,
    ShareIcon,
    UsersIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { id as IND } from 'date-fns/locale';
import { useNavigate } from 'react-router';
import { splitMethods } from '../HangoutDetail/constants';
import { HangoutSettingsModal } from '../HangoutDetail/hangout-setting-modal';
import { splitMethodLabels } from './constants';
import { useHangout } from './useHangout';

export function HangoutForm() {
    const {
        activeTab,
        setActiveTab,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isJoinDialogOpen,
        setIsJoinDialogOpen,
        joinCode,
        setJoinCode,
        form,
        updateForm,
        isSubmitting,
        isLoading,
        allProfiles,
        // activeHangouts,
        settledHangouts,
        // allHangouts,
        joinedHangouts,
        // joinedHangoutParticipants,
        ownedHangouts,
        handleCreateHangout,
        handleJoinHangout,
        copyJoinCode,
        calculateHangoutTotal,
        // getParticipantOwes,
        formatCurrency,
    } = useHangout();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="border-foreground h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen p-4 pb-24">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="bg-background flex flex-col gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    {/* Heading */}
                    <div className="flex flex-col items-start">
                        <h1 className="text-foreground flex items-center gap-2 text-xl font-bold sm:text-2xl">
                            <UsersIcon className="h-6 w-6 text-orange-500" />
                            Hangouts
                        </h1>
                        <p className="text-muted-foreground text-sm">Split bills with friends easily</p>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        {/* Join Button */}
                        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Join Hangout
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Join Hangout</DialogTitle>
                                    <DialogDescription>Enter the join code shared by your friend</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Join Code</Label>
                                        <Input
                                            placeholder="Enter 6-digit code"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            className="mt-2 text-center text-lg tracking-wider"
                                            maxLength={6}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleJoinHangout}
                                        disabled={isSubmitting || !joinCode.trim()}
                                        className="w-full"
                                    >
                                        {isSubmitting ? 'Joining...' : 'Join Hangout'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Create Button */}
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="flex w-full items-center gap-2 sm:w-auto">
                                    <PlusIcon className="h-4 w-4" />
                                    Create Hangout
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Hangout</DialogTitle>
                                    <DialogDescription>
                                        Set up a new hangout to split expenses with friends
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh]">
                                    <div className="space-y-4 pr-4">
                                        <div>
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g., Weekend Trip, Birthday Party"
                                                value={form.title}
                                                onChange={(e) => updateForm('title', e.target.value)}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="What's this hangout about?"
                                                value={form.description}
                                                onChange={(e) => updateForm('description', e.target.value)}
                                                className="mt-2 resize-none"
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <Label>Date *</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="mt-2 w-full justify-start">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {format(form.selectedDate, 'PPP', { locale: IND })}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={form.selectedDate}
                                                        onSelect={(date) => date && updateForm('selectedDate', date)}
                                                        disabled={(date) => date < new Date()}
                                                        locale={IND}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                placeholder="Where will you hang out?"
                                                value={form.location}
                                                onChange={(e) => updateForm('location', e.target.value)}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Split Method */}
                                        <div>
                                            <Label className="mb-2 block">Split Method *</Label>
                                            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {splitMethods.map((method) => {
                                                    const isSelected = form.splitMethod === method.value;
                                                    return (
                                                        <Card
                                                            key={method.value}
                                                            onClick={() => updateForm('splitMethod', method.value)}
                                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                                isSelected
                                                                    ? 'border-orange-500 ring-2 ring-orange-200'
                                                                    : 'hover:border-orange-200'
                                                            }`}
                                                        >
                                                            <CardContent className="space-y-1 p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-semibold">{method.label}</h4>
                                                                    {isSelected && (
                                                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                                                    )}
                                                                </div>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {method.description}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>

                                            {/* Extra description below cards */}
                                            <p className="text-muted-foreground mt-2 text-xs">
                                                {form.splitMethod === 'equal' && 'Everyone pays equal amount'}
                                                {form.splitMethod === 'percentage' && 'Split by custom percentage'}
                                                {form.splitMethod === 'manual' &&
                                                    'Set specific amounts for each person'}
                                                {form.splitMethod === 'treat' && "You'll pay for everyone"}
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="maxParticipants">Max Participants</Label>
                                            <Input
                                                id="maxParticipants"
                                                type="number"
                                                placeholder="Optional limit"
                                                value={form.maxParticipants}
                                                onChange={(e) => updateForm('maxParticipants', e.target.value)}
                                                className="mt-2"
                                                min="2"
                                                max="50"
                                            />
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="flex gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreateDialogOpen(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateHangout}
                                        disabled={isSubmitting || !form.title.trim()}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-orange-600">{activeHangouts.length}</div>
                            <p className="text-muted-foreground text-xs">Active Hangouts</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-foreground text-2xl font-bold">{settledHangouts.length}</div>
                            <p className="text-muted-foreground text-xs">Completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(activeHangouts.reduce((sum, h) => sum + calculateHangoutTotal(h), 0))}
                            </div>
                            <p className="text-muted-foreground text-xs">Active Total</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-foreground text-2xl font-bold">
                                {allHangouts.reduce((sum, h) => sum + (h.hangoutParticipants?.length || 0), 0)}
                            </div>
                            <p className="text-muted-foreground text-xs">Total Participants</p>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'mine' | 'joined' | 'all')}>
                    <TabsList className="flex w-full rounded-lg">
                        <TabsTrigger
                            value="mine"
                            className="ml-2 flex flex-1 items-center justify-center gap-1 text-sm"
                        >
                            My Wacana 😅
                            <Badge variant="secondary">{ownedHangouts.length}</Badge>
                        </TabsTrigger>

                        <TabsTrigger value="joined" className="flex flex-1 items-center justify-center gap-1 text-sm">
                            Joined
                            <Badge variant="secondary">{joinedHangouts.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="flex flex-1 items-center justify-center gap-1 text-sm"
                        >
                            Completed
                            <Badge variant="secondary">{settledHangouts.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    {/* My Wacana */}
                    <TabsContent value="mine" className="space-y-4">
                        {ownedHangouts.length === 0 ? (
                            <Card
                                // key={activeHangouts.id}
                                className="cursor-pointer transition-shadow hover:shadow-md"
                                // onClick={() => navigateToHangout(hangout.id)}
                            >
                                <CardContent className="py-12 text-center">
                                    <PartyPopperIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground mb-2">No active hangouts</p>
                                    <p className="text-muted-foreground mb-4 text-sm">
                                        Create a hangout to start splitting bills with friends!
                                    </p>
                                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Your First Hangout
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {ownedHangouts.map((hangout) => {
                                    const total = calculateHangoutTotal(hangout);
                                    const participantCount = hangout.hangoutParticipants?.length || 0;
                                    const expenseCount = hangout.hangoutExpenses.length || 0;

                                    return (
                                        <Card key={hangout.id} className="transition-shadow hover:shadow-md">
                                            <CardContent className="relative p-6">
                                                <div className="absolute top-0 right-6 flex items-center gap-2">
                                                    <CrownIcon className="h-4 w-4 text-yellow-500" />
                                                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                                                        {
                                                            splitMethodLabels[
                                                                hangout.splitMethod as 'equal' | 'manual' | 'treat'
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <h3 className="text-lg font-semibold">
                                                                    {hangout.title}
                                                                </h3>
                                                            </div>

                                                            {hangout.description && (
                                                                <p className="text-muted-foreground mb-2 text-sm">
                                                                    {hangout.description}
                                                                </p>
                                                            )}

                                                            <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <CalendarIcon className="h-3 w-3" />
                                                                    {format(new Date(hangout.date), 'dd MMM yyyy', {
                                                                        locale: IND,
                                                                    })}
                                                                </div>
                                                                {hangout.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPinIcon className="h-3 w-3" />
                                                                        {hangout.location}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-orange-600">
                                                                {formatCurrency(total)}
                                                            </div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Total Expenses
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <div className="text-lg font-semibold">
                                                                {participantCount}
                                                            </div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Participants
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold">{expenseCount}</div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Expenses
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-orange-600">
                                                                {total > 0
                                                                    ? formatCurrency(
                                                                          total / Math.max(participantCount, 1),
                                                                      )
                                                                    : formatCurrency(0)}
                                                            </div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Per Person
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Participants */}
                                                    <div>
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h4 className="font-medium">Participants</h4>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        copyJoinCode(hangout.joinCode as string)
                                                                    }
                                                                    className="text-xs"
                                                                >
                                                                    <ShareIcon className="mr-1 h-3 w-3" />
                                                                    {hangout.joinCode}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            <div className="flex -space-x-2">
                                                                {hangout.hangoutParticipants
                                                                    ?.slice(0, 4)
                                                                    .map((participant, index) => {
                                                                        const profile = allProfiles.find(
                                                                            (p) => p.userId === participant.userId,
                                                                        );

                                                                        return (
                                                                            <div
                                                                                key={participant.id}
                                                                                className="relative"
                                                                                style={{ zIndex: 4 - index }}
                                                                            >
                                                                                <Avatar className="ring-background h-8 w-8 ring-2">
                                                                                    <AvatarImage
                                                                                        src={profile?.profilePicture}
                                                                                    />
                                                                                    <AvatarFallback className="text-xs">
                                                                                        {participant.displayName?.[0] ||
                                                                                            'U'}
                                                                                    </AvatarFallback>
                                                                                </Avatar>

                                                                                {/* Owner badge */}
                                                                                {participant.userId ===
                                                                                    hangout.ownerId && (
                                                                                    <CrownIcon className="bg-secondary absolute -right-1 -bottom-1 h-3 w-3 rounded-full p-0.5 text-black" />
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}

                                                                {/* Show remaining count if more than 4 participants */}
                                                                {(hangout.hangoutParticipants?.length || 0) > 4 && (
                                                                    <div className="bg-muted ring-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ring-2">
                                                                        +
                                                                        {(hangout.hangoutParticipants?.length || 0) - 4}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => navigate(`/hangout/${hangout.id}`)}
                                                            variant="outline"
                                                            className="flex-1"
                                                        >
                                                            <ReceiptIcon className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Button>
                                                        <Button variant="outline" className="flex-1">
                                                            <MessageCircleIcon className="mr-2 h-4 w-4" />
                                                            Chat
                                                        </Button>
                                                        {/* <Button variant="outline">
                                                            <SettingsIcon className="h-4 w-4" />
                                                        </Button> */}
                                                        <div className="border shadow shadow-md">
                                                            <HangoutSettingsModal
                                                                hangout={hangout}
                                                                formatCurrency={formatCurrency}
                                                                // onUpdate={onUpdate}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Joined Hangouts */}
                    <TabsContent value="joined" className="space-y-4">
                        {joinedHangouts.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <UsersIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground mb-2">No joined hangouts yet</p>
                                    <p className="text-muted-foreground text-sm">
                                        Join a hangout using a code to see it here
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {joinedHangouts.map((h) => {
                                    const hangout = h.hangouts[0];
                                    const total = calculateHangoutTotal(hangout);
                                    const participantCount = hangout.hangoutParticipants?.length || 0;
                                    const expenseCount = hangout.hangoutExpenses.length || 0;

                                    return (
                                        <Card key={`joined-${h.id}`} className="transition-shadow hover:shadow-md">
                                            <CardContent className="relative p-6">
                                                {/* Badge posisi kanan atas */}
                                                <div className="absolute top-0 right-6 flex items-center gap-2">
                                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                        Joined
                                                    </Badge>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <h3 className="text-lg font-semibold">
                                                                    {hangout.title}
                                                                </h3>
                                                            </div>

                                                            {hangout.description && (
                                                                <p className="text-muted-foreground mb-2 text-sm">
                                                                    {hangout.description}
                                                                </p>
                                                            )}

                                                            <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <CalendarIcon className="h-3 w-3" />
                                                                    {format(new Date(hangout.date), 'dd MMM yyyy', {
                                                                        locale: IND,
                                                                    })}
                                                                </div>
                                                                {hangout.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPinIcon className="h-3 w-3" />
                                                                        {hangout.location}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold">
                                                                {formatCurrency(total)}
                                                            </div>
                                                            <p className="text-muted-foreground text-xs">Total Spent</p>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <div className="text-lg font-semibold">
                                                                {participantCount}
                                                            </div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Participants
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold">{expenseCount}</div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Expenses
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-orange-600">
                                                                {total > 0
                                                                    ? formatCurrency(
                                                                          total / Math.max(participantCount, 1),
                                                                      )
                                                                    : formatCurrency(0)}
                                                            </div>
                                                            <div className="text-muted-foreground text-xs">
                                                                Per Person
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Participants */}
                                                    <div>
                                                        <h4 className="mb-3 font-medium">Participants</h4>
                                                        <div className="flex -space-x-2">
                                                            {hangout.hangoutParticipants
                                                                ?.slice(0, 4)
                                                                .map((participant, index) => {
                                                                    const profile = allProfiles.find(
                                                                        (p) => p.userId === participant.userId,
                                                                    );

                                                                    return (
                                                                        <div
                                                                            key={participant.id}
                                                                            className="relative"
                                                                            style={{ zIndex: 4 - index }}
                                                                        >
                                                                            <Avatar className="ring-background h-8 w-8 ring-2">
                                                                                <AvatarImage
                                                                                    src={profile?.profilePicture}
                                                                                />
                                                                                <AvatarFallback className="text-xs">
                                                                                    {participant.displayName?.[0] ||
                                                                                        'U'}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            {/* Owner badge */}
                                                                            {participant.userId === hangout.ownerId && (
                                                                                <CrownIcon className="bg-secondary absolute -right-1 -bottom-1 h-3 w-3 rounded-full p-0.5 text-black" />
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            {participantCount > 4 && (
                                                                <div className="bg-muted ring-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ring-2">
                                                                    +{participantCount - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => navigate(`/hangout/${h.hangoutId}`)}
                                                            variant="outline"
                                                            className="flex-1"
                                                        >
                                                            <ReceiptIcon className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Button>
                                                        <Button variant="outline" className="flex-1">
                                                            <MessageCircleIcon className="mr-2 h-4 w-4" />
                                                            Chat
                                                        </Button>
                                                        <Button variant="outline">
                                                            <SettingsIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Completed Hangouts */}
                    <TabsContent value="completed" className="space-y-4">
                        {settledHangouts.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <CheckIcon className="mx-auto mb-4 h-12 w-12 text-green-500" />
                                    <p className="text-muted-foreground">No completed hangouts yet</p>
                                    <p className="text-muted-foreground text-sm">Settled hangouts will appear here</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {settledHangouts.map((hangout) => {
                                    const total = calculateHangoutTotal(hangout);
                                    const participantCount = hangout.hangoutParticipants?.length || 0;

                                    return (
                                        <Card key={hangout.id} className="opacity-75">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <h3 className="font-semibold">{hangout.title}</h3>
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-green-100 text-green-800"
                                                            >
                                                                Completed
                                                            </Badge>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm">
                                                            {format(new Date(hangout.date), 'dd MMM yyyy', {
                                                                locale: IND,
                                                            })}{' '}
                                                            • {participantCount} participants
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {formatCurrency(total)}
                                                        </div>
                                                        <p className="text-muted-foreground text-xs">Total Spent</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
