import React from 'react';

type SubmitProps = {
    onClick: (event: React.ChangeEvent<HTMLInputElement>, taskId: number) => void;
    handleInput: (value: string, taskId: number) => void;
    value: string;
    taskId: number;
};

const SubtaskSubmitform = ({ handleInput, onClick, value, taskId }: SubmitProps) => {
    return (
        <form onSubmit={(e: any) => onClick(e, taskId)}>
            <input
                className="subtask-input"
                type="text"
                placeholder="What are the steps?"
                value={value}
                onChange={(e: any) => handleInput(e.target.value, taskId)}
            />
            <button className="subtask-button" type="submit">
                New Step
            </button>
        </form>
    );
};

export default SubtaskSubmitform;
