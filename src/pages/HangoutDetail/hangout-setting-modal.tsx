import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/hooks/useInstantDb';
import { format } from 'date-fns';
import { id as IND } from 'date-fns/locale';
import {
    CalendarIcon,
    CheckIcon,
    CopyIcon,
    EditIcon,
    MapPinIcon,
    SettingsIcon,
    Trash2Icon,
    UsersIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { splitMethods } from './constants';

// Safe date utilities
const isValidDate = (date: any): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};

const safeDate = (date: any): Date => {
    if (!date) return new Date();

    if (date instanceof Date) {
        return isValidDate(date) ? date : new Date();
    }

    if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        return isValidDate(parsed) ? parsed : new Date();
    }

    return new Date();
};

const formatSafe = (date: any, formatStr: string, options?: any): string => {
    const safeD = safeDate(date);
    try {
        return format(safeD, formatStr, options);
    } catch (error) {
        console.warn('Date formatting error:', error);
        return 'Invalid Date';
    }
};

interface HangoutSettingsModalProps {
    hangout: any;
    formatCurrency: (amount: number) => string;
    onUpdate?: () => void;
}

export function HangoutSettingsModal({ hangout, formatCurrency, onUpdate }: HangoutSettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: hangout.title || '',
        description: hangout.description || '',
        location: hangout.location || '',
        splitMethod: hangout.splitMethod || 'equal',
        maxParticipants: hangout.maxParticipants?.toString() || '',
    });
    const [selectedDate, setSelectedDate] = useState<Date>(safeDate(hangout.date));

    const total = hangout.hangoutExpenses?.reduce((sum: number, exp: any) => sum + (exp?.amount || 0), 0) || 0;

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error('Please enter hangout title');
            return;
        }

        setIsSubmitting(true);
        try {
            await db.transact([
                db.tx.hangouts[hangout.id].update({
                    title: formData.title.trim(),
                    description: formData.description.trim() || undefined,
                    location: formData.location.trim() || undefined,
                    date: selectedDate,
                    splitMethod: formData.splitMethod,
                    maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                    updatedAt: new Date(),
                }),
            ]);

            toast.success('Hangout updated successfully');
            setIsOpen(false);
            onUpdate?.();
        } catch (error) {
            console.error('Update hangout error:', error);
            toast.error('Failed to update hangout');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await db.transact([db.tx.hangouts[hangout.id].delete()]);

            toast.success('Hangout deleted successfully');
            setIsDeleteConfirmOpen(false);
            setIsOpen(false);
            onUpdate?.();
        } catch (error) {
            console.error('Delete hangout error:', error);
            toast.error('Failed to delete hangout');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyJoinCode = async () => {
        try {
            await navigator.clipboard.writeText(hangout.joinCode);
            toast.success('Join code copied to clipboard');
        } catch {
            toast.error('Failed to copy join code');
        }
    };

    const resetForm = () => {
        setFormData({
            title: hangout.title || '',
            description: hangout.description || '',
            location: hangout.location || '',
            splitMethod: hangout.splitMethod || 'equal',
            maxParticipants: hangout.maxParticipants?.toString() || '',
        });
        setSelectedDate(safeDate(hangout.date));
    };

    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                    resetForm();
                    setIsOpen(true);
                }}
                className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
                <SettingsIcon className="h-4 w-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <SettingsIcon className="h-5 w-5 text-orange-600" />
                            </div>
                            Hangout Settings
                        </DialogTitle>
                        <DialogDescription>
                            Manage your hangout details, split method, and participants
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Overview Stats */}
                        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</div>
                                <p className="text-sm text-orange-700 dark:text-orange-300">Total Expenses</p>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {hangout.hangoutParticipants?.length || 0}
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">Participants</p>
                                </CardContent>
                            </Card>
                            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {hangout.hangoutExpenses?.length || 0}
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300">Transactions</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Join Code */}
                        {hangout.joinCode && (
                            <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                                                Join Code
                                            </h4>
                                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                                Share this code with friends
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="px-3 py-1 font-mono text-lg">
                                                {hangout.joinCode}
                                            </Badge>
                                            <Button size="sm" variant="outline" onClick={copyJoinCode}>
                                                <CopyIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Edit Form */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <EditIcon className="h-5 w-5" />
                                Edit Details
                            </h3>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="title">Hangout Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Weekend trip, Birthday party, etc."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Tell your friends what this hangout is about..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-2 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Date & Location */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Date</Label>
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="mt-2 w-full justify-start">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formatSafe(selectedDate, 'PPP', { locale: IND })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => {
                                                    if (date && isValidDate(date)) {
                                                        setSelectedDate(date);
                                                        setIsCalendarOpen(false);
                                                    }
                                                }}
                                                locale={IND}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Restaurant, Park, Mall, etc."
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Split Method */}
                            <div>
                                <Label className="mb-2 block">Split Method</Label>
                                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {splitMethods.map((method) => {
                                        const isSelected = formData.splitMethod === method.value;
                                        return (
                                            <Card
                                                key={method.value}
                                                onClick={() => setFormData({ ...formData, splitMethod: method.value })}
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
                            </div>

                            {/* Max Participants */}
                            <div>
                                <Label htmlFor="maxParticipants">Maximum Participants (Optional)</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    placeholder="Leave empty for unlimited"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                    className="mt-2"
                                    min="1"
                                    max="50"
                                />
                            </div>

                            {/* Preview */}
                            <Card className="border-2 border-dashed border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-orange-700 dark:text-orange-300">
                                                Preview
                                            </h4>
                                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                                                {formData.splitMethod}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{formData.title}</h3>
                                            {formData.description && (
                                                <p className="text-muted-foreground text-sm">{formData.description}</p>
                                            )}
                                        </div>
                                        <div className="text-muted-foreground flex gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-4 w-4" />
                                                {formatSafe(selectedDate, 'dd MMM yyyy', { locale: IND })}
                                            </div>
                                            {formData.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPinIcon className="h-4 w-4" />
                                                    {formData.location}
                                                </div>
                                            )}
                                            {formData.maxParticipants && (
                                                <div className="flex items-center gap-1">
                                                    <UsersIcon className="h-4 w-4" />
                                                    Max: {formData.maxParticipants}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Trash2Icon className="h-4 w-4" />
                                Delete Hangout
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSubmitting || !formData.title.trim()}
                                    className="flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <CheckIcon className="h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2Icon className="h-5 w-5" />
                            Delete Hangout?
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the hangout and all associated
                            expenses.
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <CardContent className="p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Hangout:</span>
                                    <span className="font-semibold">{hangout.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Expenses:</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Participants:</span>
                                    <span className="font-semibold">{hangout.hangoutParticipants?.length || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <Trash2Icon className="h-4 w-4" />
                            )}
                            Delete Permanently
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
