import "@fontsource-variable/inter";
import "../css/app.css";
import "./bootstrap";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        let page: any = pages[`./Pages/${name}.tsx`];

        // if layout is not define then use authenticate layout
        page.default.layout = page.default.layout || ((page: any) => <AuthenticatedLayout>{page}</AuthenticatedLayout>);

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
        showSpinner: true,
    },
});
