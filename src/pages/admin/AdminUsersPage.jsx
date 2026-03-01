// src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "student",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    loadUsers();
  }, [user]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading users:", err);
      // Check if it's a 401 (backend endpoint not implemented)
      if (err.status === 401) {
        setError("Backend endpoint not implemented. The /api/users endpoint needs to be added to the backend server.");
      } else {
        setError(err.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  }

  function startEditing(user) {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role || "student",
    });
  }

  function cancelEditing() {
    setEditingUser(null);
    setEditForm({ name: "", email: "", role: "student" });
  }

  async function saveUser() {
    try {
      await updateUser(editingUser, editForm);
      setEditingUser(null);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteUser(userId);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-600">Manage student accounts and user information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2 py-1"
                        />
                      ) : (
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2 py-1"
                        />
                      ) : (
                        <div className="text-sm text-slate-600">{user.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="border border-slate-300 rounded px-2 py-1"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : user.role === "teacher"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role || "student"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {editingUser === user._id ? (
                          <>
                            <button
                              onClick={saveUser}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-slate-600 hover:underline text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(user)}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:underline text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Users Found</h3>
              <p className="text-slate-600">Users will appear here once they register</p>
            </div>
          )}

          {error && error.includes("Backend endpoint not implemented") && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Backend Endpoint Required</h3>
              <p className="text-slate-600 mb-4">
                The <code className="bg-slate-100 px-2 py-1 rounded text-sm">/api/users</code> endpoint needs to be implemented in your backend server.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-sm text-slate-700 mb-2"><strong>Required Backend Implementation:</strong></p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• GET /api/users (admin only)</li>
                  <li>• PATCH /api/users/:id (admin only)</li>
                  <li>• DELETE /api/users/:id (admin only)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-2xl font-bold text-slate-900">{users.length}</div>
            <div className="text-sm text-slate-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => (u.role || "student") === "student").length}
            </div>
            <div className="text-sm text-slate-600">Students</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {users.filter((u) => u.role === "teacher").length}
            </div>
            <div className="text-sm text-slate-600">Teachers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
