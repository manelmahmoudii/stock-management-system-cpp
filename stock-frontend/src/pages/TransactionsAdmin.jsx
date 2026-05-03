import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";

const ITEMS_PER_PAGE = 10;

export default function Transactions() {
  const { transactions, loading, error, fetchTransactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // Filtrage
  let filteredTransactions = (transactions || []).filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (searchTerm) {
      return (tx.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
             (tx.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
             (tx.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
             (tx.id || "").toString().includes(searchTerm);
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedTransactions.length && paginatedTransactions.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedTransactions.map((tx) => tx.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "User", "Product", "Quantity", "Amount", "Date", "Status"];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type,
      tx.userEmail || 'System',
      tx.productName,
      tx.quantity,
      `$${tx.amount?.toFixed(2) || '0'}`,
      tx.date,
      tx.status,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  const getTypeBadge = (type) => {
    const base = "text-theme-xs rounded-full px-2 py-0.5 font-medium";
    if (type === "SALE") {
      return `${base} bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500`;
    }
    return `${base} bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500`;
  };

  const getStatusBadge = (status) => {
    const base = "text-theme-xs rounded-full px-2 py-0.5 font-medium";
    if (status === "COMPLETED") {
      return `${base} bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500`;
    }
    return `${base} bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-10">
        <p>{error}</p>
        <button 
          onClick={() => fetchTransactions()}
          className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Aucune transaction trouvée</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Les transactions apparaîtront ici après des ventes ou livraisons
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Transactions History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track all sales and delivery operations
          </p>
        </div>
        <div className="flex gap-3.5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by product, user or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-11 pr-4 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 xl:w-[300px]"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Types</option>
            <option value="SALE">Sales Only</option>
            <option value="DELIVERY">Deliveries Only</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6661 13.3333V15.4166C16.6661 16.1069 16.1064 16.6666 15.4161 16.6666H4.58203C3.89168 16.6666 3.33203 16.1069 3.33203 15.4166V13.3333M10.0004 3.33325L10.0004 13.3333M6.14456 7.18708L9.9986 3.33549L13.8529 7.18708" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500 dark:bg-gray-700"
                  checked={selectedRows.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">ID</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">User</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Product</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedTransactions.map((tx) => (
              <tr key={tx.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500 dark:bg-gray-700"
                    checked={selectedRows.includes(tx.id)}
                    onChange={() => toggleSelectRow(tx.id)}
                  />
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">#{tx.id}</span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className={getTypeBadge(tx.type)}>{tx.type}</span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tx.userEmail || 'System'}
                    </span>
                    {tx.userId && tx.userId > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ID: {tx.userId}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tx.productName}</span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{tx.quantity}</span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ${tx.amount?.toFixed(2) || '0.00'}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                </td>
              </tr>
            ))}
            {paginatedTransactions.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}