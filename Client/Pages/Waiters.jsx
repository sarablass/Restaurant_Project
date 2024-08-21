import React, { useEffect, useState ,useContext} from 'react';
import '../css/waiters.css';
import { userContext } from '../Components/App';
import HomeHeader from '../Components/HomeHeader';
import { useNavigate } from 'react-router-dom';

const Waiters = () => {
    const [waiters, setWaiters] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(userContext);

    useEffect(() => {
        if (user?.idUserType !== 1) {
            console.error('Access denied: Only admins can view this page.');
            navigate('/home')
          }
        const fetchWaiters = async () => {
            try {
                const response = await fetch('http://localhost:3000/waiters', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Include credentials for cookies, authorization headers, etc.
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setWaiters(data);
            } catch (error) {
                console.error('Error fetching waiters:', error);
            }
        };

        fetchWaiters();
    }, []);

    return (
        <>
            <HomeHeader />
            <button className="add-waiter-button">הוסף מלצר</button>
            <div className="waiters-page-container">
              
                <div className="waiters-table-container">
                    <table className="waiters-table">
                        <thead>
                            <tr>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waiters.map(waiter => (
                                <tr key={waiter.id}>
                                    <td>{waiter.phone}</td>
                                    <td>{waiter.email}</td>
                                    <td>{waiter.username}</td>
                                    <td>{waiter.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Waiters;
