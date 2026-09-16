import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUserWithSession } from '../utils/session';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [shifts, setShifts] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const user = getCurrentUserWithSession();
        if (!user) {
            alert('Session expired or not logged in. Please log in again.');
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        const storedShifts = JSON.parse(localStorage.getItem(`shifts_${user.username}`)) || [];
        setShifts(storedShifts);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const filteredShifts = useMemo(() => {
        return shifts.filter((shift) => {
            const matchesKeyword =
                !searchKeyword ||
                shift.slug.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                shift.workplace.toLowerCase().includes(searchKeyword.toLowerCase());

            const matchesFrom = !fromDate || shift.date >= fromDate;
            const matchesTo = !toDate || shift.date <= toDate;

            return matchesKeyword && matchesFrom && matchesTo;
        });
    }, [shifts, searchKeyword, fromDate, toDate]);

    const highestEarningMonth = useMemo(() => {
        if (shifts.length === 0) return 'No data';

        const monthlyEarnings = shifts.reduce((acc, shift) => {
            const monthKey = shift.date.substring(0, 7); // "YYYY-MM"
            const profit = Number(shift.totalProfit) || 0;
            acc[monthKey] = (acc[monthKey] || 0) + profit;
            return acc;
        }, {});

        let bestMonth = '';
        let maxProfit = -1;

        Object.entries(monthlyEarnings).forEach(([month, profit]) => {
            if (profit > maxProfit) {
                maxProfit = profit;
                bestMonth = month;
            }
        });

        return maxProfit > 0 ? `${bestMonth} ($${maxProfit.toFixed(2)})` : 'No earnings yet';
    }, [shifts]);

    if (!currentUser) return null;

    return (
        <div className="home-wrapper">
            <header className="main-header">
                <div className="header-left">
                    <div className="logo">💼 MMS</div>
                    <nav className="top-nav">
                        <Link to="/" className="nav-link active">My Shifts</Link>
                        <Link to="/edit-profile" className="nav-link">Editing a profile</Link>
                    </nav>
                </div>

                <div className="header-right">
                    <span className="user-greeting">Hello, <strong>{currentUser.username}</strong></span>
                    <button onClick={handleLogout} className="btn-logout">Log out</button>
                </div>
            </header>

            <main className="main-content">
                <div className="content-toolbar">
                    <h2>My Shifts</h2>
                    <button onClick={() => navigate('/add-shift')} className="btn-add">
                        + Add Shift
                    </button>
                </div>

                <div className="filter-card">
                    <div className="filter-group">
                        <label>Search Shift</label>
                        <input
                            type="text"
                            placeholder="Search by name or place..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    {(searchKeyword || fromDate || toDate) && (
                        <button
                            className="btn-clear"
                            onClick={() => {
                                setSearchKeyword('');
                                setFromDate('');
                                setToDate('');
                            }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                <div className="table-responsive">
                    <table className="shifts-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Hourly Wage</th>
                            <th>Shift Place</th>
                            <th>Total Profit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredShifts.length > 0 ? (
                            filteredShifts.map((shift) => (
                                <tr
                                    key={shift.slug}
                                    onClick={() => navigate(`/edit-shift/${shift.slug}`)}
                                    className="clickable-row"
                                    title="Click to edit shift"
                                >
                                    <td>{shift.date}</td>
                                    <td>{shift.startTime}</td>
                                    <td>{shift.endTime}</td>
                                    <td>${Number(shift.hourlyWage).toFixed(2)}</td>
                                    <td>{shift.workplace}</td>
                                    <td className="profit-cell">
                                        ${Number(shift.totalProfit).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    No shifts found matching your criteria.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="stats-card">
                    <span className="stats-label">Highest Earning Month:</span>
                    <span className="stats-value">{highestEarningMonth}</span>
                </div>
            </main>

            <footer className="main-footer">
                <div className="footer-menu">
                    <Link to="/">Dashboard</Link>
                    <span>•</span>
                    <Link to="/add-shift">Add Shift</Link>
                    <span>•</span>
                    <Link to="/edit-profile">My Profile</Link>
                </div>
                <p className="copyright">© Manage My Shifts. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;