// src/components/EnrollmentSummary.jsx
import ProgressBar from "./ProgressBar";

export default function EnrollmentSummary({ enrollment }) {
  const course = enrollment.course;
  const totalLessons = course.lessons?.length || 0;
  const completedLessons = enrollment.completedLessons?.length || 0;
  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">{course.title}</h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          completed={completedLessons}
          total={totalLessons}
          showPercentage={false}
          height="h-3"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-slate-600">Lessons Completed</div>
          <div className="text-lg font-semibold text-emerald-600">
            {completedLessons}/{totalLessons}
          </div>
        </div>
        <div>
          <div className="text-slate-600">Progress</div>
          <div className="text-lg font-semibold text-slate-900">{progress}%</div>
        </div>
      </div>

      {/* Payment Plan */}
      <div className="mt-4 pt-4 border-t border-slate-300 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-600">Payment Plan:</span>
          <span className="font-medium text-slate-900">
            {enrollment.paymentPlan?.toUpperCase() || "N/A"}
          </span>
        </div>
        {enrollment.paymentPlan === "monthly" && (
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Months Paid:</span>
            <span className="font-medium text-slate-900">{enrollment.monthsPaid}</span>
          </div>
        )}
        {enrollment.paymentPlan === "semester" && (
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Semesters Paid:</span>
            <span className="font-medium text-slate-900">{enrollment.semestersPaid}</span>
          </div>
        )}
      </div>

      {/* Status */}
      {!enrollment.isFullyPaid && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs font-medium">
          💡 Upgrade to unlock more lessons
        </div>
      )}
    </div>
  );
}
