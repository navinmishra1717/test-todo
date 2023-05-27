import { useRoutes } from 'react-router-dom';
import TodoPage from '../components/Todo';

export default function Routes() {
    return useRoutes([
        {
            path: '/',
            element: <TodoPage />
        }
    ]);
}
