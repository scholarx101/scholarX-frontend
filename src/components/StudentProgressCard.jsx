// src/components/StudentProgressCard.jsx
import ProgressBar from "./ProgressBar";

export default function StudentProgressCard({ studentProgress, isMultiTeacher }) {
  const { student, enrollmentId, purchasedAt, completedLessons, totalLessons, progress, moduleProgress } = studentProgress;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition">
      {/* Student Info Header */}
      <div className="mb-4 pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">{student.name}</h3>
        <p className="text-sm text-slate-600">{student.email}</p>
        <p className="text-xs text-slate-500 mt-1">
          Enrolled: {new Date(purchasedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Progress Display */}
      {!isMultiTeacher ? (
        // Single Teacher - Overall Progress
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-900">Overall Progress</div>
            <div className="text-sm font-semibold text-emerald-600">{progress}%</div>
          </div>
          <ProgressBar
            completed={completedLessons}
            total={totalLessons}
            showPercentage={false}
            height="h-2"
          />
          <div className="text-xs text-slate-600 mt-2">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>
      ) : (
        // Multi Teacher - Module-based Progress
        <div className="space-y-4">
          {moduleProgress?.map((mod) => (
            <div key={mod.moduleNumber} className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-slate-900">{mod.moduleTitle}</div>
                  <div className="text-xs text-slate-600">
                    {mod.completedLessons} of {mod.totalLessons} lessons
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-600">{mod.progress}%</div>
              </div>
              <ProgressBar
                completed={mod.completedLessons}
                total={mod.totalLessons}
                showPercentage={false}
                height="h-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
