'use client';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import './trip.css'
import { useUserContext } from '@/context/UserContext';
import { ref, remove, update } from 'firebase/database';
import { db } from '@/firebase';
import Spinner from '@/utils/spinner/spinner';



export default function Trips({ details, goBack, onExpenseClick }) {
    let [group, tripId, tripDetailsObject, members] = details;
    const { user, myData } = useUserContext();
    const [activeTab, setActiveTab] = useState('expenses');
    const [tripName, setTripName] = useState();
    const [groupName, setGroupName] = useState();
    const [tripDetailsObj, setTripDetailsObj] = useState();
    const [editTripName, setEditTripName] = useState();
    const [isEditingName, setIsEditingName] = useState(false);

    const categoryList = ['Food', 'Travel', 'Accommodation', 'Shopping', 'Entertainment', 'Other']
    const [categoryWiseAmount, setCategoryWiseAmount] = useState({});
    const [totalTripSpending, setTotalTripSpending] = useState(0);
    const [myTotalShare, setMyTotalShare] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('Food');
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [gstIncluded, setGstIncluded] = useState(false);
    const [gstPercentage, setGstPercentage] = useState(5);
    const [paidBy, setPaidBy] = useState({ uid: user.uid, name: myData.name });
    const [exceptions, setExceptions] = useState([]);
    const [showExceptionForm, setShowExceptionForm] = useState(false);
    const [newException, setNewException] = useState({ member: '', amount: '', name: '' });
    const [_payments, set_Payments] = useState([]);
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState({});

    const [hasMounted, setHasMounted] = useState(false);



    useEffect(() => {
        if (!tripId || !tripDetailsObject) return () => { goBack() }
        setHasMounted(true);
        setTripName(tripDetailsObject?.name);
        setGroupName(group.name);
        setTripDetailsObj(tripDetailsObject);
        setEditTripName(tripDetailsObject?.name);
        calculateExpense();
    }, []);

    useEffect(() => {
        if (!tripId || !tripDetailsObject) return () => { goBack() }
    }, [tripId, tripDetailsObject]);





    useEffect(() => {
        //filter the trip and group
        group = myData.groups.filter((grp) => grp.id === group.id)[0];
        const _tripsKeys = Object.keys(group.trips);
        tripDetailsObject = group.trips[_tripsKeys.filter((x) => x === tripId)];
        if (tripDetailsObject === undefined) goBack()
        if (!tripId || !tripDetailsObject) return () => { goBack() }
        setTripDetailsObj(tripDetailsObject);
        setTripName(tripDetailsObject?.name);
        setEditTripName(tripDetailsObject?.name);
        setGroupName(group.name);
        calculateExpense();
        setCategoryWiseAmount({});
        setTotalTripSpending(0);
        categorizeAmount();
    }, [myData]);

    useEffect(() => {
        if (Object.keys(categoryWiseAmount).length > 0)
            createDataFromGraph();
    }, [categoryWiseAmount])

    const titleRef = useRef();
    const amountRef = useRef();


    function getDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function createExpenseId() {
        //user name
        const _unameArray = myData.name.split(' ');
        let _uname = '';
        for (let index = 0; index < _unameArray.length; index++) {
            const word = _unameArray[index];
            _uname += word.charAt(0).toLowerCase();
        }
        //group name
        const _grpNameArray = group.name.split(' ');
        let _grpName = '';
        for (let index = 0; index < _grpNameArray.length; index++) {
            const word = _grpNameArray[index];
            _grpName += word.charAt(0).toLowerCase();
        }
        //trip name
        const _tripNameArray = tripDetailsObject.name.split(' ');
        let _tripName = '';
        for (let index = 0; index < _tripNameArray.length; index++) {
            const word = _tripNameArray[index];
            _tripName += word.charAt(0).toLowerCase();
        }

        //expense title
        const _expenseTitleArray = titleRef.current.value.split(' ');
        let _expenseTitle = '';
        for (let index = 0; index < _expenseTitleArray.length; index++) {
            const word = _expenseTitleArray[index];
            _expenseTitle += word.charAt(0).toLowerCase();
        }

        return _uname + _grpName + _tripName + _expenseTitle + Date.now();

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const expenseId = createExpenseId();
        const expense = {
            title: titleRef.current.value,
            category: selectedCategory,
            amount: {
                value: parseFloat(amountRef.current.value),
                isWithGST: gstIncluded,
                gstPercentage: gstIncluded ? gstPercentage : 0,
            },
            paidBy: {
                uid: paidBy.uid,
                name: paidBy.name
            },
            date: getDate(new Date()),
            exceptions: exceptions,
        };
        update(ref(db, `users/${group.createdBy}/groups/${group.id}`), { recentActivity: `Expense: ${expense.title} is added by ${myData.name}.` })
        update(ref(db, `users/${group.createdBy}/groups/${group.id}/trips/${tripId}/expenses/${expenseId}`), expense).then(() => {
            setIsLoading(false);
            setShowExpenseForm(false);
            setExceptions([]);
            console.log("Expense added sucessfully.");
        })

    };

    const addException = () => {
        if (newException.member && newException.amount) {
            setExceptions([...exceptions, {
                member: newException.member,
                name: newException.name,
                amount: parseFloat(newException.amount)
            }]);
            setNewException({ member: '', amount: '', name: '' });
            setShowExceptionForm(false);
        }
    };

    const removeException = (index) => {
        setExceptions(exceptions.filter((_, i) => i !== index));
    };

    //Settle Up
    function removeGST(amount, gstPercent) {
        //Takes amount and gst value and returns the value without gst.
        return amount / (1 + (gstPercent / 100));
    }

    function addGST(amount, gstPercent) {
        //Takes amount and gst value and returns the value with gst.
        return amount + ((gstPercent / 100) * amount);
    }

    function calculateExpense() {
        let payments = [];

        //Iterate over each expense and calculate each one's payment.
        if (tripDetailsObject?.expenses) {
            const expenses = Object.values(tripDetailsObject.expenses);
            let mts = 0;
            for (let index = 0; index < expenses.length; index++) {
                const expense = expenses[index];
                const totalAmountOfExpense = expense.amount.value;
                const baseAmountWithoutGST = expense.amount.isWithGST ? removeGST(totalAmountOfExpense, expense.amount.gstPercentage) : totalAmountOfExpense;
                let remainingAmount = baseAmountWithoutGST;
                const paidBy = expense.paidBy.uid;
                let exceptionUsers = [];
                expense.exceptions?.map((exception) => {
                    if (exception.member !== paidBy) {
                        //Check for existance of the pair in the payments list.
                        let existedVal = payments.find(payment => payment.includes(paidBy) && payment.includes(exception.member));
                        const index = payments.indexOf(existedVal);
                        if (index > -1) {
                            payments.splice(index, 1);
                        }
                        if (existedVal) {
                            let value = parseFloat(existedVal.split(":")[1]);
                            existedVal = existedVal.replace(`:${value}`, '');
                            let [u1, u2] = existedVal.split("/");
                            let amt = addGST(exception.amount, expense.amount.gstPercentage);
                            if (u1 === exception.member && u2 === paidBy)
                                value += amt;
                            else
                                value -= amt;
                            if (value > 0)
                                payments.push(`${u1}/${u2}:${value}`);
                            else
                                payments.push(`${u2}/${u1}:${Math.abs(value)}`);
                        } else
                            payments.push(`${exception.member}/${paidBy}:${addGST(exception.amount, expense.amount.gstPercentage)}`);
                        exceptionUsers.push(exception.member);
                        remainingAmount -= exception.amount;
                    }
                    if (exception.member === user.uid) {
                        mts += addGST(exception.amount, expense.amount.gstPercentage);
                    }
                })
                const remainingUsersCount = (members.filter((member) =>
                    !exceptionUsers.includes(member.uid)
                )).length;

                let finalAmountWithOutExceptionWithGSTPerPerson = addGST(remainingAmount, expense.amount.gstPercentage) / remainingUsersCount;
                members.map(member => {
                    if (member.uid !== paidBy && !exceptionUsers.includes(member.uid)) {
                        let existedVal = payments.find(payment => payment.includes(paidBy) && payment.includes(member.uid));
                        const index = payments.indexOf(existedVal);
                        if (index > -1) {
                            payments.splice(index, 1);
                        }
                        if (existedVal) {
                            let value = parseFloat(existedVal.split(":")[1]);
                            existedVal = existedVal.replace(`:${value}`, '');
                            let [u1, u2] = existedVal.split("/");
                            let amt = finalAmountWithOutExceptionWithGSTPerPerson;
                            if (u1 === member.uid && u2 === paidBy)
                                value += amt;
                            else
                                value -= amt;
                            if (value > 0)
                                payments.push(`${u1}/${u2}:${value}`);
                            else
                                payments.push(`${u2}/${u1}:${Math.abs(value)}`);
                        } else
                            payments.push(`${member.uid}/${paidBy}:${finalAmountWithOutExceptionWithGSTPerPerson}`);
                    }
                    if (member.uid === user.uid && !exceptionUsers.includes(user.uid)) {
                        mts += finalAmountWithOutExceptionWithGSTPerPerson;
                    }
                })
            }
            setMyTotalShare(mts);
        }
        set_Payments(payments);

    }

    function getMember(uid) {
        return (members.find(m => m.uid === uid));
    }

    function categorizeAmount() {
        if (tripDetailsObj?.expenses) {
            Object.values(tripDetailsObj.expenses).map((expense) => {
                setTotalTripSpending(prev => (prev + expense.amount.value));
                setCategoryWiseAmount(prev => ({
                    ...prev,
                    [expense.category]: (prev[expense.category] || 0) + expense.amount.value
                }));
            })
        }
    }

    function createDataFromGraph() {
        let _labels = [];
        let vals = [];
        categoryList.forEach(element => {
            let val = categoryWiseAmount[element]
            val = ((val ? val : 0) / totalTripSpending * 100).toFixed(0);
            vals.push(val);
            _labels.push(`${element} (${val}%)`)
        });
        setData({
            labels: _labels,
            datasets: [
                {
                    data: vals,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    borderWidth: 0,
                    cutout: '50%'
                }
            ]
        });
        setLabels(_labels);
    }

    // Settings
    function handleEditNameSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        update(ref(db, `users/${group.createdBy}/groups/${group.id}/trips/${tripId}`), { name: editTripName }).then(() => {
            setIsLoading(false);
            setIsEditingName(false);
        }).catch((error) => console.log(error));
    }

    function handleDeleteTrip() {
        update(ref(db, `users/${group.createdBy}/groups/${group.id}`), { recentActivity: `Trip: ${tripDetailsObject.name} is deleted by ${myData.name}.` })
        remove(ref(db, `users/${group.createdBy}/groups/${group.id}/trips/${tripId}`)).then(() => {
            tripDetailsObject = null;
            tripId = null;
            goBack();
        })
    }

    return (
        <div className="trip-details-app">
            <Head>
                <title>{tripName} | Trip Details</title>
            </Head>

            {/* Add this back button */}
            <button
                className="elegant-back-button"
                onClick={goBack}
                aria-label="Go back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
            </button>

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
                        onClick={() => { setActiveTab('settle-up'); setShowExpenseForm(false); }}
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
                        onClick={() => { setActiveTab('summary'); setShowExpenseForm(false); }}
                        role="tab"
                        aria-selected={activeTab === 'summary'}
                        aria-controls="summary-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                        </svg>
                        Summary
                    </button>
                    {hasMounted && (tripDetailsObject.createdBy === user.uid || group.createdBy === user.uid) &&
                        (<button
                            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('settings'); setShowExpenseForm(false); }}
                            role="tab"
                            aria-selected={activeTab === 'settings'}
                            aria-controls="settings-content"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M11.983 2.25c-.45 0-.818.34-.876.786l-.186 1.426a7.478 7.478 0 00-1.565.648l-1.34-.774a.875.875 0 00-1.175.324l-1.125 1.95a.875.875 0 00.324 1.175l1.176.678a7.46 7.46 0 000 1.296l-1.176.678a.875.875 0 00-.324 1.175l1.125 1.95a.875.875 0 001.175.324l1.34-.774c.49.3 1.017.546 1.565.648l.186 1.426a.875.875 0 00.876.786h2.034c.45 0 .818-.34.876-.786l.186-1.426c.548-.102 1.075-.348 1.565-.648l1.34.774a.875.875 0 001.175-.324l1.125-1.95a.875.875 0 00-.324-1.175l-1.176-.678a7.46 7.46 0 000-1.296l1.176-.678a.875.875 0 00.324-1.175l-1.125-1.95a.875.875 0 00-1.175-.324l-1.34.774a7.478 7.478 0 00-1.565-.648l-.186-1.426a.875.875 0 00-.876-.786h-2.034zm1.017 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                            </svg>
                            Settings
                        </button>)
                    }
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
                            <button className="btn btn-primary add-expense-btn" onClick={() => {
                                setShowExpenseForm(true);
                                setTimeout(() => {
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                }, 100);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                Add Expense
                            </button>
                        </div>
                        {
                            tripDetailsObj?.expenses && Object.keys(tripDetailsObj.expenses).length > 0 ? (
                                <ul className="content-list expense-list">
                                    {Object.entries(tripDetailsObj.expenses).map(([expenseId, expense]) => {
                                        return (<li key={expenseId} className="list-item expense-list-item" tabIndex={0} role="button" onClick={() => onExpenseClick([expense, members])}>
                                            <div className="expense-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                                    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="expense-details">
                                                <span className="expense-date">{expense.date}</span>
                                                <span className="expense-description">{expense.title}</span>
                                                <div className="expense-payer-info">
                                                    {(members.find(m => m.uid === expense.paidBy.uid)).photoURL === '' ? <div className="payer-avatar" style={{ backgroundColor: (members.find(m => m.uid === expense.paidBy.uid)).color }}>{expense.paidBy.name.charAt(0).toUpperCase()}</div> : (<img src={(members.find(m => m.uid === expense.paidBy.uid)).photoURL} alt="User Avatar" className="payer-avatar" referrerPolicy='no-referrer' />)}
                                                    Paid by: {expense.paidBy.name}
                                                </div>
                                            </div>
                                            <div className="amount_arrow">
                                                <span className="expense-amount">₹{expense.amount.value} ({expense.amount.isWithGST ? 'GST: ' + expense.amount.gstPercentage + '%' : 'Without GST'})</span>
                                                <div className="expense-arrow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </li>)
                                    })}
                                </ul>
                            ) : (
                                !showExpenseForm ? <div className="no-groups-message">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z" clipRule="evenodd" />
                                    </svg>
                                    <p>No expenses yet</p>
                                </div> : null
                            )
                        }

                    </div>


                    {/* Add expense section */}
                    {showExpenseForm ? <div className="expense-form-container">
                        <div className="form-header">
                            <h2>Add New Expense</h2>
                            <button onClick={() => setShowExpenseForm(false)} className="close-btn">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    ref={titleRef}
                                    placeholder="What was this expense for?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <div className="category-selector">
                                    {categoryList.map(category => (
                                        <div
                                            key={category}
                                            className={`category-option ${selectedCategory === category ? 'selected' : ''}`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Amount</label>
                                <div className="amount-input-group">
                                    <span className="currency-symbol">₹</span>
                                    <input
                                        type="number"
                                        ref={amountRef}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <div className="gst-toggle">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={gstIncluded}
                                                onChange={() => setGstIncluded(!gstIncluded)}
                                            />
                                            <span>GST Included</span>
                                        </label>
                                        {gstIncluded && (
                                            <div className="gst-percentage">
                                                <input
                                                    type="number"
                                                    value={gstPercentage}
                                                    onChange={(e) => setGstPercentage(parseInt(e.target.value))}
                                                    min="0"
                                                    max="100"
                                                />
                                                <span>%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Paid By</label>
                                <div className="member-selector">
                                    {members.map(member => (
                                        <div
                                            key={member.uid}
                                            className={`member-option ${paidBy?.uid === member.uid ? 'selected' : ''}`}
                                            onClick={() => setPaidBy(member)}
                                        >
                                            {member.photoURL === '' ?
                                                <div
                                                    className="member-avatar"
                                                    style={{ backgroundColor: member.color }}
                                                >
                                                    {member.name.charAt(0)}
                                                </div> : (<img src={member.photoURL} alt="User Avatar" className="member-avatar" referrerPolicy='no-referrer' />)}
                                            <span>{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    Exceptions
                                    <button
                                        type="button"
                                        className="add-exception-btn"
                                        onClick={() => setShowExceptionForm(true)}
                                    >
                                        + Add Exception
                                    </button>
                                </label>

                                {exceptions.length > 0 && (
                                    <div className="exceptions-list">
                                        {exceptions.map((exception, index) => (
                                            <div key={index} className="exception-item">
                                                <span>{exception.name} - ₹{exception.amount}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeException(index)}
                                                    className="remove-exception"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showExceptionForm && (
                                    <div className="exception-form">
                                        <select
                                            value={newException.member?.uid || ''}
                                            onChange={(e) => setNewException({
                                                ...newException,
                                                member: (members.find(m => m.uid === e.target.value)).uid,
                                                name: (members.find(m => m.uid === e.target.value)).name
                                            })}
                                        >
                                            <option value="">Select member</option>
                                            {members.map(member => (
                                                <option key={member.uid} value={member.uid}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="₹ Amount (Without GST)"
                                            value={newException.amount}
                                            onChange={(e) => setNewException({
                                                ...newException,
                                                amount: e.target.value
                                            })}
                                            step="0.01"
                                            min="0"
                                        />
                                        <button type="button" className='add-exception-btn add-btn' onClick={addException}>Add</button>
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setShowExceptionForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Add Expense
                                </button>
                                <button type="button" onClick={() => setShowExpenseForm(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div> : null
                    }

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
                            {_payments.length > 0 ? <ul className="content-list balance-list">
                                {_payments.map((payment, index) => {
                                    let [usrs, val] = payment.split(":");
                                    let [payerId, receiverId] = usrs.split("/");
                                    let payer = getMember(payerId);
                                    let receiver = getMember(receiverId);
                                    return <li key={index} className="balance-item">
                                        {payer.photoURL === '' ? <div className="balance-avatar" style={{ backgroundColor: payer.color || '#9EC5FF' }}>A</div> : <img src={payer.photoURL} alt='Payer Avatar' referrerPolicy='no-referrer' className='balance-avatar' />}
                                        <div className="balance-details">
                                            <span className="balance-text">{payer.name} {payerId === user.uid ? '(You)' : ''} owes {receiver.name} {receiverId === user.uid ? '(You)' : ''}</span>
                                            <span className={`amount ${receiverId === user.uid ? 'positive' : 'negative'}-amount`}>₹{parseFloat(val)}</span>
                                        </div>
                                    </li>
                                })}
                            </ul> : <p className="empty-state" >
                                Everyone is settled up!
                            </p>}


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
                                    <p className="stat-value">₹{totalTripSpending.toFixed(2)}</p>
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
                                    <p className="stat-value">₹{myTotalShare.toFixed(2)}</p>
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
                                    <p className="stat-value">₹{(parseFloat(totalTripSpending.toFixed(2)) / members.length).toFixed(2)}</p>
                                </div>
                            </div>
                        </section>


                        <section className="summary-chart-section">
                            <h3>Spending by Category</h3>
                            {data && data.datasets && data.datasets[0]?.data.length > 0 ?
                                <div className="summary-chart-container">
                                    <div className="chart-placeholder">
                                        <Doughnut className="circular-chart" data={data} options={{
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: { enabled: true }
                                            }
                                        }} />
                                        <div className="chart-legend">
                                            {labels.map(level =>
                                                <div key={level} className="legend-item"><span className={`legend-color ${(level.split("(")[0]).toLowerCase()}`}></span><span>{level}</span></div>
                                            )}
                                        </div>
                                    </div>
                                </div> :
                                <p className="empty-state">
                                    No categorized expenses to display.
                                </p>}
                        </section>
                    </div>

                    {/* Settings tab */}
                    {hasMounted && (tripDetailsObject.createdBy === user.uid || group.createdBy === user.uid) &&
                        (<div
                            id="settings-content"
                            className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}
                            role="tabpanel"
                            aria-labelledby="settings-tab-button"
                        >
                            <div className="settings-container">
                                <h2 className="settings-title">Trip Settings</h2>

                                {/* Trip Name Section */}
                                <div className="settings-section">
                                    <h3 className="section-title">Trip Name</h3>
                                    <div className="setting-card">
                                        {isEditingName ? (
                                            <form className="edit-form" onSubmit={handleEditNameSubmit}>
                                                <input
                                                    type="text"
                                                    className="settings-input"
                                                    value={editTripName}
                                                    onChange={(e) => setEditTripName(e.target.value)}
                                                    required
                                                />
                                                <div className="form-actions">
                                                    <button type="submit" className="save-btn">
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="cancel-btn"
                                                        onClick={() => setIsEditingName(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="display-setting">
                                                <span className="setting-value">{editTripName}</span>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => {
                                                        setEditTripName(editTripName);
                                                        setIsEditingName(true);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Danger Zone Section */}
                                <div className="settings-section danger-zone">
                                    <h3 className="section-title">Danger Zone</h3>
                                    <div className="setting-card danger-card">
                                        <div className="danger-content">
                                            <div className="warning-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="danger-text">
                                                <p>Deleting the trip will permanently remove all associated expenses for all members.</p>
                                                <small>Only group admins can perform this action</small>
                                            </div>
                                        </div>
                                        <button className="delete-btn" onClick={handleDeleteTrip}>
                                            Delete Trip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div >
            {isLoading && <Spinner size={40} />}
        </div >
    );
};