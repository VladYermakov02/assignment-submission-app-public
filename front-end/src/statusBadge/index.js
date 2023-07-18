import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = (props) => {
    const { text } = props;

    function getBadgeColor() {
        if (text === "Completed") return "success";
        else if (text === "Needs Update") return "danger";
        else if (text === "Pending Submission") return "warning";
        else if (text === "Resubmitted") return "primary";
        else return "info"
    }

    return (
        <Badge
            pill
            bg={getBadgeColor()}
            style={{
                fontSize: "1em",
            }}>
            {text}
        </Badge>
    );
};

export default StatusBadge;