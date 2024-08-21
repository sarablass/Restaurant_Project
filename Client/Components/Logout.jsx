import  { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  useEffect(() => {
    setUser(null);
    localStorage.setItem('currentUser',null);
    navigate('/home');
  }, [setUser,navigate]);

}
export default Logout;