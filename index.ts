import {createContext, createElement, useContext, Context, useState, ProviderProps} from 'react';
import {Observable, ObserverOptions} from 'object-observer';

export type LiveValue<T> = T extends object ?
    // should be something like `ReturnType<typeof Observable.from<T>>`,
    // but using the resolved type instead since generic functions can't
    // be used within `ReturnType` yet.
    Observable & T :
    T;

export type LiveContext<T> = Context<LiveValue<T>>;

const isObject = (value: unknown) => value !== null && typeof value === 'object';
const toLiveValue = <T>(value: T): LiveValue<T> => (
    isObject(value) && !Observable.isObservable(value) ?
        Observable.from(value, {async: true}) :
        value
) as LiveValue<T>;

export function createLiveContext<T>(defaultValue: T): LiveContext<T> {
    const context = createContext(toLiveValue(defaultValue));
    const ContextProvider = context.Provider;

    context.Provider = Object.assign(
        ({value, ...otherProps}: ProviderProps<LiveValue<T>>) => createElement(
            ContextProvider,
            {value: toLiveValue(value), ...otherProps},
        ),
        ContextProvider,
    );

    return context;
}

export function useLiveContext<T>(context: LiveContext<T>, observerOptions?: ObserverOptions | string): LiveValue<T> {
    const value = useContext(context);
    const [revision, setRevision] = useState(0);

    if (isObject(value)) {
        Observable.observe(value, () => {
            setRevision(revision => revision === Number.MAX_SAFE_INTEGER ? 0 : revision + 1);
        }, typeof observerOptions === 'string' ? {pathsFrom: observerOptions} : observerOptions);
    }

    return value;
}
