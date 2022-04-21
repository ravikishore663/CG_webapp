import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import configureStore from './configure-store';

import Games from './containers/Games';
import CreateGame from './containers/CreateGame';
import GameForm from './containers/GameForm';
import Videos from './containers/Videos';
import CreateVideo from './containers/CreateVideo';
import Login from './containers/Login';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import './App.css';
import LibraryZone from './containers/LibraryZone';

const store = configureStore({});

// only for dev
// TODO: delete when auth is available
localStorage.setItem('token', 'UBDZTJHknAyyTNYNhxf3QTplBairON0yvzvWcC2E');
localStorage.setItem('adminToken', 'pjzg3V5ksFzkREb2VRJ7');

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Fragment>
          {/*
           * TODO: routes in the future should load from a route file
           * Figure out how to set protected routes 
          */}
          <Layout>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/' element={<PrivateRoute />}>
                <Route path='/' element={<Games />} />
                <Route path='/games' element={<Games />} />
                <Route path='/videos' element={<Videos />} />
                <Route path='/libraries' element={<LibraryZone />} />
                <Route path='/videos/create' element={<CreateVideo />} />
                <Route path='/games/:id' element={<Games />} />
                <Route path='/games/create' element={<CreateGame />} />
                <Route path='/games/test' element={<GameForm />} />
              </Route>
            </Routes>
          </Layout>
        </React.Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
