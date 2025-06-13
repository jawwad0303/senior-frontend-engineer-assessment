import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { DataTable } from "@/components/shared/ReusableTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubmissions } from "@/hooks/useSubmissions";
import SubmissionDetailDialog from "./SubmissionDetail";
import { useUpdateSubmission } from "@/hooks/useUpdateSubmission";
import { toast } from "sonner"

const SubmissionsDialog = ({
    open,
    onClose,
    assessmentId,
    assessmentName,
    submissionIds,
}: {
    open: boolean;
    onClose: () => void;
    assessmentId: string;
    assessmentName: string;
    submissionIds: string[];
}) => {
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const { data: submissions, isLoading, error } = useSubmissions(assessmentId);
    const filteredSubmissions = submissions?.filter((s) => submissionIds.includes(s.id)) || [];
    const { mutate: updateSubmissionStatus } = useUpdateSubmission();

    const handleActionSelect = (action: string, row: any) => {
        if (action === "unlock") {
            updateSubmissionStatus(
                {
                    submissionId: row.id,
                    updates: { status: "pending" },
                },
                {
                    onSuccess: () => {
                        console.log("Submission unlocked successfully");
                        toast("Submission Unlocked");
                    },
                    onError: () => {
                        toast("Failed to Unlock");
                    },
                }
            );
        }
    };

    const columns = [
        { key: "id", title: "Submission", sortable: true },
        { key: "user", title: "Full Name", sortable: true },
        { key: "loginTime", title: "Login", sortable: true },
        { key: "started", title: "Start", sortable: true, render: (v: boolean) => v ? "Yes" : "-" },
        { key: "questionSynced", title: "Questions Synced", sortable: true, render: (v: string | null) => v || "-" },
        { key: "timeElapsed", title: "Time Elapsed", sortable: true, render: (v: string | null) => v || "-" },
        {
            key: "status", title: "Status", sortable: true, render: (v: string | null) => (
                <span className="text-sm font-medium text-orange-600">{v || "-"}</span>
            )
        },
    ];

    const fields = [
        {
            key: "groupName",
            label: "Group",
            type: "select",
            options: Array.from(
                new Set(
                    submissions
                        ?.map((s) => s.groupName)
                        .filter((value): value is string => typeof value === "string")
                )
            ),
        },
        {
            key: "examinee",
            label: "Examinee",
            type: "select",
            options: Array.from(
                new Set(
                    submissions
                        ?.map((s) => s.examinee)
                        .filter((value): value is string => typeof value === "string")
                )
            ),
        },
        {
            key: "areaName",
            label: "Area",
            type: "select",
            options: Array.from(
                new Set(
                    submissions
                        ?.map((s) => s.areaName)
                        .filter((value): value is string => typeof value === "string")
                )
            ),
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: Array.from(
                new Set(
                    submissions
                        ?.map((s) => s.status)
                        .filter((value) => typeof value === "string")
                )
            ),
        },
    ];

    const rowActions = (row: any) => {
        if (row.status === "Manual Locked") {
            return [{ label: "🔓 Unlock", value: "unlock" }];
        }
        return [
            { label: "🔄 Sync", value: "sync" },
            { label: "📥 Download Logs", value: "download" },
        ];
    };



    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="min-w-[95%] max-w-none max-h-none p-0 gap-0 bg-white dark:bg-gray-900 border-0 shadow-2xl">
                    {/* Header */}
                    <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col space-y-1">
                            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Submissions
                            </DialogTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Assessment: {assessmentName}
                            </p>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden p-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-64 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <p className="text-red-600 dark:text-red-400 mb-2">
                                        Error loading submissions
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Please try again later
                                    </p>
                                </div>
                            </div>
                        ) : filteredSubmissions?.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        No submissions found
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        There are no submissions for the selected criteria
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <DataTable
                                    columns={columns}
                                    data={filteredSubmissions}
                                    filters={fields}
                                    onRowClick={(row) => setSelectedSubmission(row)}
                                    actionOptions={[]}
                                    getRowActions={rowActions}
                                    onActionSelect={handleActionSelect}
                                />
                            </div>
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {filteredSubmissions?.length || 0} submission{filteredSubmissions?.length !== 1 ? 's' : ''}
                            {submissionIds.length > 0 && ` (filtered from ${submissionIds.length} selected)`}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
            {selectedSubmission && (
                <SubmissionDetailDialog
                    submission={selectedSubmission ? [selectedSubmission] : []}
                    onClose={() => setSelectedSubmission(null)}
                />
            )}
        </>
    );
};

export default SubmissionsDialog;