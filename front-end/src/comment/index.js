import React, { useEffect, useState } from 'react';
import { useUser } from '../userProvider';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const Comment = (props) => {
    const user = useUser();
    const decodedJwt = jwt_decode(user.jwt);
    const { id, createdDate, createdBy, text } = props.commentData;
    const { emitEditComment, emitDeleteComment } = props;

    const [commentRelativeTime, setCommentRelativeTime] = useState("");

    // do it once on load
    // without it, it reloads infinitely because time changes all the time so it creates a new object and rerenders the screen
    useEffect(() => {
        console.log(props.commentData);
        updateCommentRelativeTime();
    }, [createdDate]);

    function updateCommentRelativeTime() {
        if (createdDate) {
            dayjs.extend(relativeTime);
            // console.log("CreatedDate", createdDate);
            // console.log("CreatedDate converted to dayjs", dayjs(createdDate));
            if (typeof createdDate === "string")
                setCommentRelativeTime(dayjs(createdDate).fromNow());
            else
                setCommentRelativeTime(createdDate.fromNow());
        }
    }

    // setInterval(() => {
    //     updateCommentRelativeTime();
    // }, 1000 * 61); //every 60 seconds

    //console.log("decodedJwt", decodedJwt);
    //console.log("createdBy", createdBy);
    // [${createdDate}]
    return (
        <>
            <div className="comment-bubble">
                <div className="d-flex gap-5" style={{ fontWeight: "bold" }}>
                    <div>{`${createdBy.name}`}</div>
                    {
                        // sub means username (reserved word)
                        decodedJwt.sub === createdBy.username ?
                            (<>
                                {/* these onCLicks send back up to the parent to handle updating and deleting */}
                                <div onClick={() => emitEditComment(id)} style={{ cursor: "pointer", color: "blue" }}>edit</div>
                                <div onClick={() => emitDeleteComment(id)} style={{ cursor: "pointer", color: "red" }}>delete</div>
                            </>)
                            : (<></>)
                    }
                </div>
                {/* <div>{createdDate}</div> */}
                <div>{text}</div>
            </div>
            <div style={{ marginTop: "-1.25em", marginLeft: "1.4em", fontSize: "12px" }}>
                {commentRelativeTime ? `Posted ${commentRelativeTime}` : ""}
            </div>
        </>
    );
};

export default Comment;