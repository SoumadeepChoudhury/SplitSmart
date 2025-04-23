// ExpenseDetail.jsx
import React from 'react';
import styles from './expense.module.css';

function ExpenseDetail({ expenseData, goBack }) {
    const [{
        title = "N/A",
        category = "Other",
        amount = { value: 0, isWithGST: false, gstPercentage: 0 },
        paidBy = { uid: 'N/A', name: 'N/A' },
        date = "N/A",
        exceptions = []
    }, members] = expenseData;

    return (
        <div className={styles.expenseDetailWrapper}>
            <button className={styles.backButton} onClick={goBack} aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
            </button>

            <div className={styles.expenseDetailContainer}>
                <div className={styles.expenseHeader}>
                    <div className={styles.categoryPill} data-category={category.toLowerCase()}>
                        {category}
                    </div>
                    <h1 className={styles.expenseTitle}>{title}</h1>
                </div>

                <div className={styles.amountCard}>
                    <p className={styles.totalAmountLabel}>Total Amount</p>
                    <p className={styles.totalAmountValue}>
                        ₹{amount.value}
                    </p>
                    {amount.isWithGST && (
                        <p className={styles.gstInfo}>
                            (Includes {amount.gstPercentage}% GST)
                        </p>
                    )}
                </div>

                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Paid by</span>
                        <span className={styles.metaValue}>{paidBy.name}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Date</span>
                        <span className={styles.metaValue}>{date}</span>
                    </div>
                </div>

                {exceptions?.length > 0 ? (
                    <div className={styles.splitSection}>
                        <h3 className={styles.sectionTitle}>Split Details</h3>
                        <ul className={styles.splitList}>
                            {exceptions.map((exception, index) => (
                                <li key={index} className={styles.splitItem}>
                                    {(members.find(m=>m.uid === exception.member)).photoURL === '' ? <div className={styles.userAvatar}>
                                        {exception.name?.charAt(0).toUpperCase()}
                                    </div> : (<img src={(members.find(m => m.uid === exception.member)).photoURL} alt="User Avatar" className={styles.userAvatar} referrerPolicy='no-referrer' />) }
                                    <span className={styles.splitUsername}>{exception.name}</span>
                                    <span className={styles.splitAmount}>
                                        ₹{exception.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className={styles.emptyState}>Split with all equally</p>
                )}
            </div>
        </div>
    );
}

export default ExpenseDetail;