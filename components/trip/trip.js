'use client';
import { useState } from 'react';
import Head from 'next/head';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import './trip.css'


const data = {
    labels: ['Food (30%)', 'Transport (25%)', 'Activities (20%)', 'Accommodation (15%)', 'Other (10%)'],
    datasets: [
        {
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
                '#FF9E9E', // food
                '#FFD6A5', // transport
                '#B5EAD7', // activities
                '#A0C4FF', // accommodation
                '#D0AFFF'  // other
            ],
            borderWidth: 0,
            cutout: '50%' // makes it a donut chart
        }
    ]
};

export default function Trips() {
    const [activeTab, setActiveTab] = useState('expenses');
    const [tripName, setTripName] = useState('Goa 2024 Winter Trip');
    const [groupName, setGroupName] = useState('Goa 2024');
    const [paidStatus, setPaidStatus] = useState({
        'rahul-priya': false,
        'sneha-amit': false
    });

    const handleMarkAsPaid = (transactionId) => {
        setPaidStatus(prev => ({ ...prev, [transactionId]: true }));
    };

    return (
        <div className="trip-details-app">
            <Head>
                <title>{tripName} | Trip Details</title>
            </Head>

            <div className="trip-details-container">
                {/* Trip Header */}
                <div className="trip-header">
                    <h1 className="trip-name">{tripName}</h1>
                    <p className="trip-group-context">Part of: {groupName}</p>
                </div>

                {/* Tab Navigation */}
                <nav className="trip-tabs-nav" aria-label="Trip Sections">
                    <button
                        className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expenses')}
                        role="tab"
                        aria-selected={activeTab === 'expenses'}
                        aria-controls="expenses-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                        Expenses
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'settle-up' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settle-up')}
                        role="tab"
                        aria-selected={activeTab === 'settle-up'}
                        aria-controls="settle-up-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
                        </svg>
                        Settle Up
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                        role="tab"
                        aria-selected={activeTab === 'summary'}
                        aria-controls="summary-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                        </svg>
                        Summary
                    </button>
                </nav>

                {/* Tab Content */}
                <div className="trip-tab-content-container">
                    {/* Expenses Tab */}
                    <div
                        id="expenses-content"
                        className={`tab-pane ${activeTab === 'expenses' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="expenses-tab-button"
                    >
                        <div className="tab-pane-header">
                            <h2>Expenses</h2>
                            <button className="btn btn-primary add-expense-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                Add Expense
                            </button>
                        </div>
                        <ul className="content-list expense-list">
                            <li className="list-item expense-list-item" tabIndex={0} role="button">
                                <div className="expense-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="expense-details">
                                    <span className="expense-date">Apr 09, 2025</span>
                                    <span className="expense-description">Dinner at Beach Shack</span>
                                    <div className="expense-payer-info">
                                        <div className="payer-avatar" style={{ backgroundColor: '#FF9E9E' }}>P</div>
                                        Paid by: Priya Sharma
                                    </div>
                                </div>
                                <div className="amount_arrow">
                                    <span className="expense-amount">₹1,500.00</span>
                                    <div className="expense-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                            <li className="list-item expense-list-item" tabIndex={0} role="button">
                                <div className="expense-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                    </svg>
                                </div>
                                <div className="expense-details">
                                    <span className="expense-date">Apr 08, 2025</span>
                                    <span className="expense-description">Taxi Fare</span>
                                    <div className="expense-payer-info">
                                        <div className="payer-avatar" style={{ backgroundColor: '#9EC5FF' }}>A</div>
                                        Paid by: Amit Singh (You)
                                    </div>
                                </div>
                                <div className="amount_arrow">
                                    <span className="expense-amount">₹1,500.00</span>
                                    <div className="expense-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                            <li className="list-item expense-list-item" tabIndex={0} role="button">
                                <div className="expense-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="expense-details">
                                    <span className="expense-date">Apr 08, 2025</span>
                                    <span className="expense-description">Water Sports Activities for Group</span>
                                    <div className="expense-payer-info">
                                        <div className="payer-avatar" style={{ backgroundColor: '#CAFFBF' }}>R</div>
                                        Paid by: Rahul Verma
                                    </div>
                                </div>
                                <div className="amount_arrow">
                                    <span className="expense-amount">₹1,500.00</span>
                                    <div className="expense-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <p className="empty-state" style={{ display: 'none' }}>
                            No expenses added for this trip yet.
                        </p>
                    </div>

                    {/* Settle Up Tab */}
                    <div
                        id="settle-up-content"
                        className={`tab-pane ${activeTab === 'settle-up' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="settle-up-tab-button"
                    >
                        <h2>Settle Up Balances</h2>

                        <section className="settlement-section">
                            <h3>Who Owes Whom</h3>
                            <ul className="content-list balance-list">
                                <li className="balance-item">
                                    <div className="balance-avatar" style={{ backgroundColor: '#9EC5FF' }}>A</div>
                                    <div className="balance-details">
                                        <span className="balance-text">Amit Singh (You) owes Priya Sharma</span>
                                        <span className="amount negative-amount">₹250.00</span>
                                    </div>
                                </li>
                                <li className="balance-item">
                                    <div className="balance-avatar" style={{ backgroundColor: '#CAFFBF' }}>R</div>
                                    <div className="balance-details">
                                        <span className="balance-text">Rahul Verma owes Amit Singh (You)</span>
                                        <span className="amount positive-amount">₹450.00</span>
                                    </div>
                                </li>
                                <li className="balance-item">
                                    <div className="balance-avatar" style={{ backgroundColor: '#BDB2FF' }}>S</div>
                                    <div className="balance-details">
                                        <span className="balance-text">Sneha Patil owes Priya Sharma</span>
                                        <span className="amount negative-amount">₹120.00</span>
                                    </div>
                                </li>
                            </ul>
                            <p className="empty-state" style={{ display: 'none' }}>
                                Everyone is settled up!
                            </p>
                        </section>

                        <section className="settlement-section">
                            <h3>Suggested Payments</h3>
                            <ul className="content-list transaction-list">
                                {!paidStatus['rahul-priya'] && (
                                    <li className="list-item transaction-item">
                                        {/* <div className="transaction-avatar" style={{ backgroundColor: '#CAFFBF' }}>R</div> */}
                                        <div className="transaction-details">
                                            <div>Rahul Verma</div>
                                            <div className="transaction-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            {/* <div className="transaction-avatar" style={{ backgroundColor: '#FF9E9E' }}>P</div> */}
                                            <div>Priya Sharma</div>
                                            <div className="transaction-info">
                                                <span className="transaction-amount">₹200.00</span>
                                                <span className="transaction-note">Partial payment</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-secondary btn-small mark-paid-btn"
                                            onClick={() => handleMarkAsPaid('rahul-priya')}
                                        >
                                            Mark as Paid
                                        </button>
                                    </li>
                                )}
                                {!paidStatus['sneha-amit'] && (
                                    <li className="list-item transaction-item">
                                        <div className="transaction-details">
                                            <div>Sneha Patil</div>
                                            <div className="transaction-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>Amit Singh</div>
                                            <div className="transaction-info">
                                                <span className="transaction-amount">₹70.00</span>
                                                <span className="transaction-note">Full payment</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-secondary btn-small mark-paid-btn"
                                            onClick={() => handleMarkAsPaid('sneha-amit')}
                                        >
                                            Mark as Paid
                                        </button>
                                    </li>
                                )}
                                {paidStatus['rahul-priya'] && paidStatus['sneha-amit'] && (
                                    <p className="empty-state">No payments needed.</p>
                                )}
                            </ul>
                        </section>
                    </div>

                    {/* Summary Tab */}
                    <div
                        id="summary-content"
                        className={`tab-pane ${activeTab === 'summary' ? 'active' : ''}`}
                        role="tabpanel"
                        aria-labelledby="summary-tab-button"
                    >
                        <h2>Trip Summary</h2>

                        <section className="summary-stats-container">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM12 7.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5zM12 15a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Total Trip Spending</p>
                                    <p className="stat-value">₹4,800.00</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Your Total Share</p>
                                    <p className="stat-value">₹1,200.00</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Average Per Person</p>
                                    <p className="stat-value">₹1,200.00</p>
                                </div>
                            </div>
                        </section>


                        <section className="summary-chart-section">
                            <h3>Spending by Category</h3>
                            <div className="summary-chart-container">
                                <div className="chart-placeholder">
                                    <Doughnut className="circular-chart" data={data} options={{
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: { enabled: true }
                                        }
                                    }} />
                                    <div className="chart-legend">
                                        <div className="legend-item"><span className="legend-color food"></span><span>Food (30%)</span></div>
                                        <div className="legend-item"><span className="legend-color transport"></span><span>Transport (25%)</span></div>
                                        <div className="legend-item"><span className="legend-color activities"></span><span>Activities (20%)</span></div>
                                        <div className="legend-item"><span className="legend-color accommodation"></span><span>Accommodation (15%)</span></div>
                                        <div className="legend-item"><span className="legend-color other"></span><span>Other (10%)</span></div>
                                    </div>
                                </div>
                            </div>
                            <p className="empty-state" style={{ display: 'none' }}>
                                No categorized expenses to display.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};