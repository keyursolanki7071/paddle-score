import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';

// @ts-expect-error - window.route needs to be globally defined
window.route = route;


const appName = import.meta.env.VITE_APP_NAME || 'PaddleScore';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        let page = pages[`./pages/${name}.tsx`] as any;
        return page.default;
    },

    setup({ el, App, props }) {
        // @ts-expect-error - ziggy is shared via middleware
        const { ziggy } = props.initialPage.props;
        
        // Enhance route to automatically use the shared configuration
        const routeWithConfig = (name?: any, params?: any, absolute?: any, config?: any) => 
            route(name, params, absolute, config || ziggy);

        window.route = routeWithConfig as any;

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#75FF9E',
    },
});

