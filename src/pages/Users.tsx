import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import '../css/Users.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: ''
  });

  const API_URL = 'http://localhost:8080/api/green_earth/user';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) {
          if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? resData.data : u)));
          } else {
            setUsers([...users, resData.data]);
          }
          closeModal();
        } else {
          alert(resData.message || 'Server error occurred!');
        }
      })
      .catch((err) => console.error('Processing error:', err));
  };

  const handleDeleteUser = (id) => {
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

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
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
      <div className="users-header">
        <div>
          <h1 className="users-title">User Management</h1>
          <p className="users-subtitle">List of administrators and system users</p>
        </div>
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
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="users-table-body">
              {loading ? (
                <tr>
                  <td colSpan="4" className="users-empty">
                    Loading data...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="users-row">
                    <td className="users-cell">
                      <div className="users-user-info">
                        <img
                          src={user.avatar || 'https://via.placeholder.com/40'}
                          alt="avatar"
                          className="users-avatar"
                        />
                        <span className="users-name">{user.name}</span>
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
                      <span
                        className={`users-role-badge ${
                          user.role === 'admin' ? 'role-admin' : 'role-user'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="users-cell users-actions-cell">
                      <div className="users-actions">
                        <button
                          onClick={() => openModal(user)}
                          className="users-action-btn edit-btn"
                        >
                          <Edit2 className="users-action-icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="users-action-btn delete-btn"
                        >
                          <Trash2 className="users-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="users-empty">
                    No users found
                  </td>
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
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={closeModal} className="users-close-btn">
                <X className="users-close-icon" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="users-form">
              <div className="users-form-group">
                <label className="users-label">Full name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="users-input"
                  placeholder="Enter your name"
                />
              </div>

              <div className="users-form-group">
                <label className="users-label">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="users-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="users-form-grid">
                <div className="users-form-group">
                  <label className="users-label">Phone number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="users-input"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="users-form-group">
                  <label className="users-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="users-input"
                  >
                    <option value="">Select role</option>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                  </select>
                </div>
              </div>

              <div className="users-form-group">
                <label className="users-label">URL Avatar</label>
                <input
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="users-input"
                  placeholder="https://..."
                />
              </div>

              <div className="users-form-actions">
                <button type="button" onClick={closeModal} className="users-cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="users-save-btn">
                  Save
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