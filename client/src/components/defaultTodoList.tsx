const defaultTodoList: any = [
    {
        id: 1,
        title: 'task 1',
        status: 'completed',
        subtasks: [
            {
                id: 1,
                title: 'subtask 1',
                status: 'pending'
            },
            {
                id: 2,
                title: 'subtask 2',
                status: 'completed'
            }
        ]
    },
    {
        id: 2,
        title: 'task 2',
        status: 'pending',
        subtasks: [
            {
                id: 3,
                title: 'subtask3 1',
                status: 'pending'
            },
            {
                id: 4,
                title: 'subtasks 4',
                status: 'completed'
            }
        ]
    },
    {
        id: 3,
        title: 'task 3',
        status: 'pending'
    }
];

export default defaultTodoList;
