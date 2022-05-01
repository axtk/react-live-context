# react-live-context

*React Context with value mutation tracking*

React Context is the primary means to share data across components in a React app, but components will only respond to complete changes of its value, ignoring updates of nested properties. `createLiveContext()` and `useLiveContext()` are to address this issue and to streamline the shared data manipulation, with their APIs being fully compatible with the APIs of their native-React counterparts `createContext()` and `useContext()`.

With `createLiveContext()` and `useLiveContext()`, an update in the context value properties will notify the components to re-render in order to adjust to the updated context value.

## Example

[[Demo](https://codepen.io/axtk/pen/RwQwRMq)]

```jsx
import {useContext} from 'react';
import {createLiveContext, useLiveContext} from 'react-live-context';
import {createRoot} from 'react-dom/client';

// Replacing `createContext(defaultValue)`
// with `createLiveContext(defaultValue)`.
const CounterContext = createLiveContext();
// A value passed to `CounterContext` will be a 'live' object
// capable of tracking its updates and notifying its subscribers.

const Display = () => {
    // The `useLiveContext` hook subscribes this component to
    // changes in the context value.
    const data = useLiveContext(CounterContext);
    // Whenever the context value is updated, the component
    // runs a re-render to update its content accordingly.
    return <span>{data.counter}</span>;
};

const PlusButton = () => {
    // Since the content of this particular component doesn't
    // depend on the context value, obtaining its value with
    // `useContext` rather than `useLiveContext` will also work
    // just fine. (This is also a way to communicate that this
    // component doesn't track context value changes.)
    const data = useContext(CounterContext);
    return <button onClick={() => data.counter++}>+</button>;
};

const App = () => <div><PlusButton/> <Display/></div>;

createRoot(document.querySelector('#app')).render(
    // Much like an ordinary Context Provider.
    <CounterContext.Provider value={{counter: 42}}>
        <App/>
    </CounterContext.Provider>
);
```
