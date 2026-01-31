import React, { useState } from 'react';
import '../AdminDashboard.css';

function AccountManagement() {
    const [searchId, setSearchId] = useState('');
    const [accountData, setAccountData] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);

    // Form for updating totals (legacy support, mainly for setting PAYABLE)
    const [formData, setFormData] = useState({ payable: '', paid: '' });

    // Form for adding new payment record
    const [newPayment, setNewPayment] = useState({
        amount: '',
        payment_reason: 'Tuition Fee',
        payment_method: 'Cash',
        transaction_reference: '',
        remarks: ''
    });

    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('auth_token');
            // Fetch Account Summary
            const res = await fetch(`/api/admin/accounts?studentId=${searchId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            // Fetch Payment History
            const histRes = await fetch(`/api/admin/accounts/history/${searchId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const histData = await histRes.json();

            if (histData.success) {
                setPaymentHistory(histData.data);
            }

            if (data.success && data.data.length > 0) {
                const acc = data.data[0];
                setAccountData(acc);
                setFormData({ payable: acc.payable, paid: acc.paid });
                setMessage('Student records found.');
            } else {
                setAccountData(null);
                setFormData({ payable: '', paid: '' });
                setMessage('Student account not found (will be created on update).');
            }
        } catch (error) {
            console.error('Error searching account:', error);
            setMessage('Error searching records.');
        }
    };

    // Update Totals (Mainly for Payable)
    const handleUpdateTotals = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/admin/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    studentId: searchId,
                    payable: formData.payable,
                    paid: formData.paid // Direct override if needed
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Account totals updated successfully!');
                handleSearch(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    // Add New Single Payment
    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/admin/accounts/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    studentId: searchId,
                    ...newPayment
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Payment recorded successfully!');
                setNewPayment({
                    amount: '',
                    payment_reason: 'Tuition Fee',
                    payment_method: 'Cash',
                    transaction_reference: '',
                    remarks: ''
                });
                handleSearch(null); // Refresh data
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    };

    return (
        <div className="admin-page-container">
            <h2>Financial Accounts Management</h2>

            {/* Search Section */}
            <div className="admin-form-card">
                <h3>Search Student</h3>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text" placeholder="Enter Student ID"
                        value={searchId} onChange={e => setSearchId(e.target.value)} required
                    />
                    <button type="submit" className="admin-btn-secondary">Search</button>
                </form>
                {message && <p className="status-message">{message}</p>}
            </div>

            {(accountData || message.includes('Student records found') || message.includes('created')) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Left Col: Account Summary & Totals */}
                    <div>
                        <div className="admin-form-card">
                            <h3>Account Summary</h3>
                            {accountData ? (
                                <div className="account-summary">
                                    <p><strong>Name:</strong> {accountData.full_name}</p>
                                    <p><strong>Dept:</strong> {accountData.department}</p>
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '1.1rem' }}>Total Payable: <strong>{accountData.payable} BDT</strong></p>
                                        <p style={{ fontSize: '1.1rem', color: 'green' }}>Total Paid: <strong>{accountData.paid} BDT</strong></p>
                                        <p style={{ fontSize: '1.2rem', color: 'red', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                                            Due: <strong>{accountData.due} BDT</strong>
                                        </p>
                                    </div>
                                </div>
                            ) : <p>No existing account summary.</p>}

                            <h4 style={{ marginTop: '1.5rem' }}>Update Total Requirements</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Use this to set the Semester Fee or Total Payable amount.</p>
                            <form onSubmit={handleUpdateTotals} className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Total Payable amount (BDT)</label>
                                    <input
                                        type="number"
                                        value={formData.payable}
                                        onChange={e => setFormData({ ...formData, payable: e.target.value })}
                                        placeholder="e.g. 50000"
                                    />
                                </div>
                                <button type="submit" className="admin-btn-secondary">Update Payable Amount</button>
                            </form>
                        </div>
                    </div>

                    {/* Right Col: Add New Payment */}
                    <div>
                        <div className="admin-form-card">
                            <h3>Record New Payment</h3>
                            <form onSubmit={handleAddPayment} className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Amount (BDT)</label>
                                    <input
                                        type="number"
                                        value={newPayment.amount}
                                        onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                                        required
                                        placeholder="e.g. 15000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment For</label>
                                    <select
                                        value={newPayment.payment_reason}
                                        onChange={e => setNewPayment({ ...newPayment, payment_reason: e.target.value })}
                                    >
                                        <option>Tuition Fee</option>
                                        <option>Semester Fee</option>
                                        <option>Hostel Fee</option>
                                        <option>Exam Fee</option>
                                        <option>Library Fine</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select
                                        value={newPayment.payment_method}
                                        onChange={e => setNewPayment({ ...newPayment, payment_method: e.target.value })}
                                    >
                                        <option>Cash</option>
                                        <option>Bank Transfer</option>
                                        <option>Bkash/Nagad</option>
                                        <option>Cheque</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Trx ID / Ref (Optional)</label>
                                    <input
                                        type="text"
                                        value={newPayment.transaction_reference}
                                        onChange={e => setNewPayment({ ...newPayment, transaction_reference: e.target.value })}
                                        placeholder="e.g. TRX123456"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Remarks</label>
                                    <input
                                        type="text"
                                        value={newPayment.remarks}
                                        onChange={e => setNewPayment({ ...newPayment, remarks: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="admin-btn-primary">Record Payment</button>
                            </form>
                        </div>
                    </div>

                </div>
            )}

            {/* Payment History Table */}
            {paymentHistory.length > 0 && (
                <div className="admin-form-card" style={{ marginTop: '2rem' }}>
                    <h3>Transaction History</h3>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Reason</th>
                                    <th>Method</th>
                                    <th>Ref</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((pay) => (
                                    <tr key={pay.id}>
                                        <td>{new Date(pay.payment_date).toLocaleDateString()}</td>
                                        <td>{pay.payment_reason}</td>
                                        <td>{pay.payment_method}</td>
                                        <td><small>{pay.transaction_reference || '-'}</small></td>
                                        <td style={{ fontWeight: 'bold' }}>{pay.amount} ৳</td>
                                        <td>
                                            <span className={`status-badge status-${pay.status || 'completed'}`}>
                                                {pay.status || 'Completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountManagement;
