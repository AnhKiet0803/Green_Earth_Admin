import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Mail, Phone, X, Loader2, UserPlus } from 'lucide-react';
import '../css/Users.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: ''
  });

  const API_URL = 'http://localhost:8081/api/green_earth/user';

  const fetchUsers = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) {
          setUsers(resData.data);
        }
      })
      .catch((err) => console.error('API connection error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Server error ${res.status}`);
        }
        // Xử lý trường hợp API trả về thành công nhưng body rỗng (tránh lỗi Uncaught Promise)
        if (res.status === 204 || res.headers.get('content-length') === '0') {
          return {};
        }
        return res.json();
      })
      .then((resData) => {
        alert("Update Successful!");
        fetchUsers(); // Gọi lại hàm fetch để làm mới data, đảm bảo Avatar Link hiện lên ngay lập tức
        closeModal();
      })
      .catch((err) => {
        console.error('Promise Error:', err);
        alert("System error: Could not save changes. " + err.message);
      });
  };

  const handleDeleteUser = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setUsers(users.filter((u) => u.id !== id));
        } else {
          alert('Cannot delete this user!');
        }
      })
      .catch((err) => console.error('Delete error:', err));
  };

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        avatar: user.avatar || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        avatar: ''
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="users-page">
      <div className="users-header flex justify-between items-center">
        <div>
          <h1 className="users-title">User Management</h1>
          <p className="users-subtitle">Manage system administrators and members</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md">
           <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="users-card">
        <div className="users-card-top">
          <div className="users-search-wrap">
            <Search className="users-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="users-search-input"
            />
          </div>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr className="users-table-head-row">
                <th>User Identity</th>
                <th>Contact Information</th>
                <th>Access Level</th>
                <th className="text-right">Management</th>
              </tr>
            </thead>

            <tbody className="users-table-body">
              {loading ? (
                <tr>
                  <td colSpan={4} className="users-empty">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                    <p className="mt-2 text-slate-500">Syncing data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="users-row">
                    <td className="users-cell">
                      <div className="users-user-info">
                        <img
                          src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
                          alt="avatar"
                          className="users-avatar object-cover"
                        />
                        <span className="users-name font-bold">{user.name}</span>
                      </div>
                    </td>

                    <td className="users-cell">
                      <div className="users-contact">
                        <div className="users-contact-item">
                          <Mail className="users-contact-icon" />
                          {user.email}
                        </div>
                        <div className="users-contact-item">
                          <Phone className="users-contact-icon" />
                          {user.phone}
                        </div>
                      </div>
                    </td>

                    <td className="users-cell">
                      <span className={`users-role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>

                    <td className="users-cell users-actions-cell">
                      <div className="users-actions">
                        <button onClick={() => openModal(user)} className="users-action-btn edit-btn" title="Edit User">
                          <Edit2 className="users-action-icon" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="users-action-btn delete-btn" title="Delete User">
                          <Trash2 className="users-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="users-empty">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <h2 className="users-modal-title">
                {editingUser ? 'Update Profile' : 'Register New User'}
              </h2>
              <button onClick={closeModal} className="users-close-btn">
                <X className="users-close-icon" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="users-form">
              <div className="users-form-group">
                <label className="users-label">Full Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="users-input"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="users-form-group">
                <label className="users-label">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="users-input"
                  placeholder="example@domain.com"
                />
              </div>

              <div className="users-form-grid grid grid-cols-2 gap-4">
                <div className="users-form-group">
                  <label className="users-label">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="users-input"
                    placeholder="+84..."
                  />
                </div>

                <div className="users-form-group">
                  <label className="users-label">System Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="users-input"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="user">Standard User</option>
                  </select>
                </div>
              </div>

              <div className="users-form-group">
                <label className="users-label">Avatar Link (URL)</label>
                <div className="flex gap-3 items-center">
                  <input
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="users-input flex-1"
                    placeholder="https://images.com/photo.jpg"
                  />
                  {formData.avatar && (
                    <img src={formData.avatar} className="w-10 h-10 rounded-full border object-cover" alt="Preview" />
                  )}
                </div>
              </div>

              <div className="users-form-actions mt-6">
                <button type="button" onClick={closeModal} className="users-cancel-btn">
                  Discard
                </button>
                <button type="submit" className="users-save-btn bg-emerald-600 text-white font-bold">
                  {editingUser ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;