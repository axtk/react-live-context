import { createContext, createElement, useContext, useState } from 'react';
import { Observable } from 'object-observer';
const isObject = (value) => value !== null && typeof value === 'object';
const toLiveValue = (value) => (isObject(value) && !Observable.isObservable(value) ?
    Observable.from(value, { async: true }) :
    value);
export function createLiveContext(defaultValue) {
    const context = createContext(toLiveValue(defaultValue));
    const ContextProvider = context.Provider;
    context.Provider = Object.assign(({ value, ...otherProps }) => createElement(ContextProvider, { value: toLiveValue(value), ...otherProps }), ContextProvider);
    return context;
}
export function useLiveContext(context, observerOptions) {
    const value = useContext(context);
    const [revision, setRevision] = useState(0);
    if (isObject(value)) {
        Observable.observe(value, () => {
            setRevision(revision => revision === Number.MAX_SAFE_INTEGER ? 0 : revision + 1);
        }, typeof observerOptions === 'string' ? { pathsFrom: observerOptions } : observerOptions);
    }
    return value;
}
