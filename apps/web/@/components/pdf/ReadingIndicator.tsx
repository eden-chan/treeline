import * as React from 'react';
import { createStore, Plugin, PluginFunctions } from '@react-pdf-viewer/core';

interface StoreProps {
    getPagesContainer?(): HTMLElement;
}

interface ReadingIndicatorPlugin extends Plugin {
    ReadingIndicator: () => React.ReactElement;
}

const readingIndicatorPlugin = (): ReadingIndicatorPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const ReadingIndicatorDecorator = () => <ReadingIndicator store={store} />;

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
        },
        ReadingIndicator: ReadingIndicatorDecorator,
    };
};
const ReadingIndicator: React.FC<{ store: any }> = ({ store }) => {
    const [percentages, setPercentages] = React.useState(0);

    const handleScroll = (e: Event) => {
        const target = e.target;
        if (target instanceof HTMLDivElement) {
            const p = Math.floor((100 * target.scrollTop) / (target.scrollHeight - target.clientHeight));
            setPercentages(Math.min(100, p));
        }
    };


    const handlePagesContainer = () => {
        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }

        const pagesEle = getPagesContainer();
        pagesEle.addEventListener('scroll', handleScroll);
    };

    React.useLayoutEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);
        return () => store.unsubscribe('getPagesContainer', handlePagesContainer);
    }, []);


    return (
        <div
            style={{
                height: '4px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgb(53, 126, 221)',
                    height: '100%',
                    width: `${percentages}%`,
                }}
            />
        </div>
    );
};


export default readingIndicatorPlugin;