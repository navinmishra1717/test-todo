import React from 'react';

type SubmitProps = {
    onClick: (event: React.ChangeEvent<HTMLInputElement>, taskId: number) => void;
    handleInput: (value: string, taskId: number) => void;
    value: string;
    taskId: number;
};

const SubtaskSubmitform = ({ handleInput, onClick, value, taskId }: SubmitProps) => {
    return (
        <div className="subtask-form">
            <form onSubmit={(e: any) => onClick(e, taskId)}>
                <input
                    className="subtask-input"
                    type="text"
                    placeholder="What are the steps?"
                    value={value}
                    onChange={(e: any) => handleInput(e.target.value, taskId)}
                />
                <button className="add-button" type="submit" style={{ borderRadius: '5px' }}>
                    New Step
                </button>
            </form>
        </div>
    );
};

export default SubtaskSubmitform;
