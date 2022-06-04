# react-live-context

*React Context with value mutation tracking*

`useContext()` produces a re-render only if the entire Context object value has changed, which requires extra effort of mutating the object to convey a single nested property change;

`useLiveContext()` acts much like `useContext()` and also produces a re-render if any property of the Context object value changes, allowing for more straightforward code.

## Example

[[Demo](https://codepen.io/axtk/pen/RwQwRMq)]

```jsx
import {useContext} from 'react';
import {createLiveContext, useLiveContext} from 'react-live-context';
import {createRoot} from 'react-dom/client';

// Replacing `createContext(defaultValue)`
// with `createLiveContext(defaultValue)`.
const CounterContext = createLiveContext();
// Live contexts accept values of all sorts the same way as
// ordinary contexts do and convert them into 'live' values
// capable of tracking their updates and notifying subscribers.

const Display = () => {
    // The `useLiveContext` hook subscribes this component to
    // changes in the context value.
    const data = useLiveContext(CounterContext);

    // Whenever any part of the live context value is updated,
    // the component runs a re-render to update its content
    // accordingly.
    return <span>{data.counter}</span>;
    // The response to changes is asynchronous and occurs once
    // per a set of sync value updates so as not to overwhelm
    // components with redundant notifications.
};

const PlusButton = () => {
    // Since this component doesn't require a re-render when
    // the context value changes, using the `useContext` hook
    // rather than `useLiveContext` will also work just fine.
    // (This is also a way to communicate that this
    // component doesn't track context value changes.)
    const data = useContext(CounterContext);

    // Nested properties of a live context's object value being
    // mutated produce notifications for subscribed components
    // to re-render (which is not the case with an object value
    // from a context created via `createContext()`).
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
