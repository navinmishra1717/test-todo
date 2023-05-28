import React from 'react';

type SubmitProps = {
    onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setInput: any;
    value: string;
};

const handleTaskInputChange = (event: React.ChangeEvent<HTMLInputElement>, setInput: any) => {
    setInput(event.target.value);
};

const Submitform = ({ setInput, onClick, value }: SubmitProps) => {
    return (
        <div className="form">
            <form onSubmit={(e: any) => onClick(e)}>
                <input
                    className="input"
                    type="text"
                    placeholder="What to do?"
                    value={value}
                    onChange={(e: any) => handleTaskInputChange(e, setInput)}
                />
                <button className="add-button" type="submit">
                    New List
                </button>
            </form>
        </div>
    );
};

export default Submitform;
