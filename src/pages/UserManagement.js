import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="user-management">
      <div className="page-topbar">
        <div className="top-icons">
          <img src="/pictures/lang-en.png" alt="Language" />
          <img src="/pictures/notifications.png" alt="Notifications" />
          <img src="/pictures/settings.png" alt="Settings" />
        </div>
      </div>

      <h1 className="page-title">USER MANAGEMENT</h1>

      <div className="stats-container">
        <div className="stat-card">
          <div className="icon blue">
            <img src="/pictures/monitor.png" alt="Total user" />
          </div>
          <div className="stat-text">
            <p>TOTAL USER</p>
            <span>{users.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon green">
            <img src="/pictures/checked.png" alt="Active user" />
          </div>
          <div className="stat-text">
            <p>ACTIVE USER</p>
            <span>{users.filter((u) => u.active).length}</span>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div className="search-inline">
            <span className="search-ico">
              <img src="/pictures/find.png" alt="Search" />
            </span>
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              aria-label="Search by name"
            />
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>UNIQUE ID</th>
              <th>NAME</th>
              <th>ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  <Link
                    to={`/setting/${u.id}`}
                    className="name-link"
                    aria-label={`Edit ${u.name}`}
                    title={`Edit ${u.name}`}
                  >
                    {u.name}
                  </Link>
                </td>
                <td>
                  <span className={`status ${u.active ? "active" : "inactive"}`}>
                    {u.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="empty-row">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span className="muted">Row per page:&nbsp;</span>
          <div className="rp-select">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span className="rp-caret">▾</span>
          </div>

          <span className="muted range">
            {filteredUsers.length === 0 ? "0–0" : `${startIndex + 1}–${endIndex}`} of {filteredUsers.length}
          </span>

          <button
            className="pager-plain"
            onClick={prev}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            className="pager-plain"
            onClick={next}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
