import { applyMiddleware, compose, createStore } from 'redux';
import { reducers } from './reducers'

export default function configureStore(preloadedState: any) {
  // const middlewares = [loggerMiddleware, thunkMiddleware]
  // const middlewareEnhancer = applyMiddleware(...middlewares)

  // const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  // const composedEnhancers = compose(...enhancers)

  // const store = createStore(reducers, preloadedState, composedEnhancers)
  const store = createStore(reducers, preloadedState);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers));
  }

  return store
}
