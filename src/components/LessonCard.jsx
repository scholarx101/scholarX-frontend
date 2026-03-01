// src/components/LessonCard.jsx
export default function LessonCard({
  lesson,
  isCompleted,
  isAccessible,
  onMarkComplete,
  isCompleting,
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          {isCompleted ? (
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white">
              ✓
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-slate-300 rounded"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
            {lesson.order}. {lesson.title}
          </h4>

          {lesson.description && (
            <p className="text-sm text-slate-600 mt-1">{lesson.description}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
            {lesson.moduleNumber && <span>📌 Module {lesson.moduleNumber}</span>}
            {lesson.durationMinutes && <span>⏱️ {lesson.durationMinutes} min</span>}
            {lesson.lessonDate && (
              <span>📅 {new Date(lesson.lessonDate).toLocaleDateString()}</span>
            )}
          </div>

          {/* Resources */}
          {isAccessible && (
            <div className="mt-3 space-y-2">
              {lesson.videoUrl && (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-emerald-600 hover:underline text-sm"
                >
                  🎥 Watch Video
                </a>
              )}
              {lesson.pdfUrls?.length > 0 && (
                <div className="space-y-1">
                  {lesson.pdfUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-emerald-600 hover:underline text-sm"
                    >
                      📄 Lesson Notes {lesson.pdfUrls.length > 1 ? idx + 1 : ""}
                    </a>
                  ))}
                </div>
              )}
              {lesson.materialUrls?.length > 0 && (
                <div className="space-y-1">
                  {lesson.materialUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-emerald-600 hover:underline text-sm"
                    >
                      📎 Material {lesson.materialUrls.length > 1 ? idx + 1 : ""}
                    </a>
                  ))}
                </div>
              )}
              {lesson.liveBatchLinks?.length > 0 && (
                <div className="space-y-1">
                  {lesson.liveBatchLinks.map((link, idx) => (
                    <div key={idx}>
                      {link.meetingUrl && (
                        <a
                          href={link.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline text-sm"
                        >
                          🔗 Live Batch Session
                        </a>
                      )}
                      {link.recordingUrl && (
                        <a
                          href={link.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline text-sm"
                        >
                          📹 Batch Recording
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Locked Message */}
          {!isAccessible && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
              🔒 Upgrade your plan to access this lesson
            </div>
          )}
        </div>

        {/* Action Button */}
        {isAccessible && !isCompleted && (
          <button
            onClick={onMarkComplete}
            disabled={isCompleting}
            className="flex-shrink-0 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded font-medium disabled:opacity-60 transition"
          >
            {isCompleting ? "..." : "Mark Done"}
          </button>
        )}
      </div>
    </div>
  );
}
