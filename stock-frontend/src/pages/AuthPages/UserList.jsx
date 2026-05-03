import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";

const ITEMS_PER_PAGE = 10;

export default function UserList() {
  const { users, loading, error, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Filtrer les utilisateurs (exclure l'admin)
  const filteredUsers = users.filter((user) => {
    if (user.email === "admin@example.com") return false;
    return Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedUsers.map((u) => u.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setDeletingId(id);
      try {
        await deleteUser(id);
      } catch (err) {
        alert("Erreur lors de la suppression: " + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email"];
    const rows = filteredUsers.map((u) => [u.id, u.firstName, u.lastName, u.email]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header with search and export */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Client List
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage registered clients
          </p>
        </div>
        <div className="flex gap-3.5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="shadow-theme-xs flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.6661 13.3333V15.4166C16.6661 16.1069 16.1064 16.6666 15.4161 16.6666H4.58203C3.89168 16.6666 3.33203 16.1069 3.33203 15.4166V13.3333M10.0004 3.33325L10.0004 13.3333M6.14456 7.18708L9.9986 3.33549L13.8529 7.18708"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="p-4">
                <div className="flex w-full items-center gap-3">
                  <label className="flex cursor-pointer items-center select-none">
                    <span className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={
                          selectedRows.length === paginatedUsers.length &&
                          paginatedUsers.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                          selectedRows.length === paginatedUsers.length &&
                          paginatedUsers.length > 0
                            ? "bg-brand-500 border-brand-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <span
                          className={`opacity-0 ${
                            selectedRows.length === paginatedUsers.length &&
                            paginatedUsers.length > 0
                              ? "opacity-100"
                              : ""
                          }`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="1.6666"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </label>
                  <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    ID
                  </p>
                </div>
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                First Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Last Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-4 whitespace-nowrap">
                  <div className="group flex items-center gap-3">
                    <label className="flex cursor-pointer items-center select-none">
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedRows.includes(user.id)}
                          onChange={() => toggleSelectRow(user.id)}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                            selectedRows.includes(user.id)
                              ? "bg-brand-500 border-brand-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${
                              selectedRows.includes(user.id) ? "opacity-100" : ""
                            }`}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="1.6666"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </label>
                    <span className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                      {user.id}
                    </span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {user.firstName}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.lastName}</p>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">{user.email}</p>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete user"
                  >
                    {deletingId === user.id ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </div>
          <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:rounded-none sm:bg-transparent sm:p-0 dark:bg-gray-900">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
                  fill="currentColor"
                />
              </svg>
              Previous
            </button>
            <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <ul className="hidden items-center gap-0.5 sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 hover:bg-brand-500 hover:text-white dark:text-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              Next
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}