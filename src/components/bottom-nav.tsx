import routes from '@/routes';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="border-border bg-background fixed bottom-0 z-50 w-full border-t py-2 md:hidden">
            <div className="ml-4 flex w-full items-center justify-between">
                {routes.map(({ path, title, icon: Icon, center, isHide }) => {
                    const isActive =
                        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path as string);

                    if (isHide) {
                        return null;
                    }

                    if (center) {
                        return (
                            <Link
                                key={path}
                                to={path as string}
                                className="relative -mt-6 flex items-center justify-center rounded-full bg-yellow-400 p-4 text-white shadow-xs transition-all hover:bg-yellow-500"
                            >
                                {Icon && <Icon className="h-8 w-8" />}
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={path}
                            to={path as string}
                            className={clsx(
                                'flex flex-col items-center text-xs',
                                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {Icon && <Icon className="mb-1 h-5 w-5" />}
                            {title}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
