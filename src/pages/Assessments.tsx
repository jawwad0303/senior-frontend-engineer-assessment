// AssessmentList.tsx
"use client";

import  { useState } from "react";
import { useAssessments } from "@/hooks/useAssessment";
import { DataTable } from "@/components/shared/ReusableTable";
import { Skeleton } from "@/components/ui/skeleton";
import SubmissionsDialog from "./Submissions";
import { formatDateOnly } from "@/utils/dateFormatter";
import { toast } from "sonner";


function AssessmentList() {
    const { data: assessments, isLoading, error } = useAssessments();
    const [selectedAssessment, setSelectedAssessment] = useState<{ id: string; name: string; submissionIds: string[] } | null>(null);    

    const columns = [
        { key: "area", title: "Area", sortable: true },
        { key: "program", title: "Program", sortable: true },
        { key: "course", title: "Course", sortable: true },
        {
            key: "examStatus",
            title: "Exam Status",
            sortable: true,
            render: (value: string) => {
                const colorMap: Record<string, string> = {
                    completed: "bg-green-100 text-green-800",
                    pending: "bg-yellow-100 text-yellow-800",
                    active: "bg-blue-100 text-blue-800",
                    absent: "bg-red-100 text-red-800",
                };

                const styles = colorMap[value] || "bg-gray-100 text-gray-700";

                return (
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
                        {value}
                    </span>
                );
            },
        }

        , { key: "assessmentName", title: "Assessment Name", sortable: true },
        {
            key: "submissions",
            title: "Monitor Examinee",
            render: (_: any, row: any) => (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAssessment({
                    id: row.id,
                    name: row.assessmentName,
                    submissionIds: row.submissionIds,
                  });
                }}
                className="text-blue-600 hover:underline"
              >
                {row.submissionIds?.length || 0} View
              </a>
            ),
          }
          
        ,
        {
            key: "startDate",
            title: "Start Date",
            sortable: true,
            render: (value: string | Date | number) => (
                <span className="text-sm">
                    {formatDateOnly(value)}
                </span>
            )
        },
        {
            key: "endDate",
            title: "End Date",
            sortable: true,
            render: (value: string | Date | number) => (
                <span className="text-sm">
                    {formatDateOnly(value)}
                </span>
            )
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

    const fields = [
        { field: "area", label: "Area", type: "select", options: Array.from(new Set(assessments?.map(a => a.area) || [])) },
        { field: "program", label: "Program", type: "select", options: Array.from(new Set(assessments?.map(a => a.program) || [])) },
        { field: "course", label: "Course", type: "select", options: Array.from(new Set(assessments?.map(a => a.course) || [])) },
        {
            field: "examStatus",
            label: "Exam Status",
            type: "select",
            options: [
                { label: "✅ Completed", value: "completed" },
                { label: "🕒 Pending", value: "pending" },
                { label: "📘 Ongoing", value: "active" },
                { label: "❌ Absent", value: "absent" },
            ]
        }
    ];

    const handleActionSelect = (action: string) => {
        switch (action) {
            case "sync":
               toast("Syncing logs for assessment ");
                break;
            case "download":
                toast("Downloading logs for assessment ");
                break;
            default:
                toast("Performing action: " + action);
        }
    };

    if (isLoading)
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
            </div>
        );

    if (error) return <div className="text-red-600">Error: {error.message}</div>;
    if (!assessments || assessments.length === 0) return <div>No assessments found.</div>;

    return (
        <div className=" mx-auto px-4 py-6 bg-gray-50">
            <h1 className="mb-4 text-2xl font-semibold">Assessments</h1>
            <DataTable
                columns={columns}
                data={assessments}
                filters={fields.map(f => ({
                    key: f.field,
                    label: f.label,
                    options: (f.options || []).map(opt => (typeof opt === "string" ? opt : opt?.value))
                }))}
                actionOptions={rowActions({})} 
                onActionSelect={handleActionSelect}
                getRowActions={rowActions}
                pageSize={10}
            />

            {selectedAssessment && (
                <SubmissionsDialog
                    open={!!selectedAssessment}
                    onClose={() => setSelectedAssessment(null)}
                    assessmentId={selectedAssessment.id}
                
                    assessmentName={selectedAssessment.name}
                    submissionIds={selectedAssessment.submissionIds}
                />
            )}

        </div>
    );
}

export default AssessmentList;
