import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.scss';
import Auth from './containers/Auth/Auth';
import Toolbar from './components/Toolbar/Toolbar';
import HumanResources from './containers/HumanResources/HumanResources';
import Employee from './containers/Employees/Employee';
import { checkAuthAfterRefresh } from './reduxStore/actions';

const App = () => {
  const userRole = useSelector(state => state.userData.role);
  const isAuth = useSelector(state => state.userData.token !== null);
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(checkAuthAfterRefresh())
  }, [])
  return (
    <div className="App">
      {isAuth 
      ? <React.Fragment> 
        <Toolbar/>
        {userRole === 'human_resources' ? <HumanResources/> : <Employee/>}
      </React.Fragment>
      : <Auth/>}
    </div>
  );
}

export default App;
