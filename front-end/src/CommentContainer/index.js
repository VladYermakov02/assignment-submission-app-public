import React, { useEffect, useState } from 'react';
import myFetch from '../services/fetchService';
import { Button } from 'react-bootstrap';
import Comment from '../comment';
import { useUser } from '../userProvider';
import dayjs from 'dayjs';
import { useInterval } from '../util/useInterval';

const CommentContainer = (props) => {
    const { assignmentId } = props;
    const user = useUser();
    const emptyComment = {
        id: null,
        text: "",
        assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
        user: user.jwt,
        createdDate: null,
    }
    // the data of a message object
    const [comment, setComment] = useState(emptyComment);
    // for tracking comments
    // useState([]) - [] means that it is an array of comments
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log(comment);
        // [comment] means that useEffect depends on comment (on comment's change so to speak) so whenever comment changes useEffect is hit
        // if I type [] that means it depends on nothing so useEffect would be hit once per the page load
    }, [comment]);

    function formatComments(commentsCopy) {
        commentsCopy.forEach((comment) => {
            if (typeof comment.createDate === "string") {
                comment.createDate = dayjs(comment.createdDate);
            }
        });
        setComments(commentsCopy);
    }

    // onLoad useEffect
    useEffect(() => {
        myFetch(`/api/comments?assignmentId=${assignmentId}`, "GET", user.jwt, null)
            .then((commentsData) => {
                formatComments(commentsData);
                //console.log(comments);
            });
    }, []);

    function submitComment() {
        // if (typeof comment.createdDate === "object" && comment.createdDate != null) {
        //     comment.createdDate = comment.createDate.toDate();
        // }
        if (comment.id) {
            // comment.createdDate = comment.createdDate.toDate();
            myFetch(`/api/comments/${comment.id}`, "PUT", user.jwt, comment).then((data) => {
                const commentsCopy = [...comments];
                const i = commentsCopy.findIndex((comment) => comment.id === data.id);
                commentsCopy[i] = data;
                formatComments(commentsCopy);
                setComment(emptyComment);
            });
        } else {
            myFetch("/api/comments", "POST", user.jwt, comment).then((data) => {
                // added these lines so we don't need to reload the page for a comment to appear
                const commentsCopy = [...comments];
                commentsCopy.push(data);
                console.log("Creating a comment", data);
                formatComments(commentsCopy);
                setComment(emptyComment);
            });
        }
    }

    function updateComment(value) {
        const commentCopy = { ...comment } // destructure it here
        commentCopy.text = value;
        setComment(commentCopy);
    }

    // previously is was placed in Comment but it means that it would load EVERY 5 seconds we're on the page (or load the page?)
    // anyway it wasn't the good idea so better to do it here
    // (also, we used 'setInterval' which is not my func whereas useInterval is)
    useInterval(() => {
        updateCommentTimeDisplay();
    }, 1000 * 5); //every 5 seconds

    function updateCommentTimeDisplay() {
        const commentsCopy = [...comments];
        commentsCopy.forEach(
            (comment) => (comment.createdDate = dayjs(comment.createdDate))
        );
        formatComments(commentsCopy);
    }

    function handleEditComment(commentId) {
        const i = comments.findIndex((comment) => comment.id === commentId);
        console.log("Editing comment", comments[i]);
        //console.log("comment to update", comment);
        const commentCopy = {
            id: comments[i].id,
            text: comments[i].text,
            assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
            user: user.jwt,
            createdDate: comments[i].createdDate,
        }
        setComment(commentCopy);
    }

    // deleting (for git)
    function handleDeleteComment(commentId) {
        myFetch(`/api/comments/${commentId}`, "DELETE", user.jwt).then((msg) => {
            const commentsCopy = [...comments];
            const i = commentsCopy.findIndex((comment) => comment.id === commentId);
            commentsCopy.splice(i, 1);
            setComments(commentsCopy);
        });
    }

    return (
        <>
            <div className="mt-5">
                <textarea
                    style={{ width: "100%", borderRadius: "0.25em" }}
                    onChange={(event) => updateComment(event.target.value)}
                    // needed for updating the comment posting field with right text when a user clicks 'edit' button
                    value={comment.text}
                ></textarea>
                <Button onClick={() => submitComment()}>Post Comment</Button>
            </div>
            <div className="mt-5">
                {comments.map((comment) => (
                    <Comment
                        // key is for a warning to go away
                        key={comment.id}
                        commentData={comment}
                        emitDeleteComment={handleDeleteComment}
                        emitEditComment={handleEditComment}

                    // createdDate={comment.createdDate}
                    // createdBy={comment.createdBy}
                    // text={comment.text}
                    // // emitDeteleComment - a key, a parameter; handleDeleteComment - a function we are passing
                    // // the names are conventional
                    // // changing data should not be done inside Comment class because if changing was done in one place
                    // // it should continue in the same place so we just pass a func that was created here
                    // emitDeteleComment={handleDeleteComment}
                    // emitUpdateComment={handleEditComment}
                    // id={comment.id}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentContainer;



// import dayjs from "dayjs";
// import React, { useEffect, useState } from "react";
// import { Button } from "react-bootstrap";
// import Comment from "../comment";
// import myFetch from "../services/fetchService";
// import { useUser } from "../userProvider";
// import { useInterval } from "../util/useInterval";

// const CommentContainer = (props) => {
//   const { assignmentId } = props;
//   const user = useUser();

//   const emptyComment = {
//     id: null,
//     text: "",
//     assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
//     user: user.jwt,
//     createdDate: null,
//   };

//   const [comment, setComment] = useState(emptyComment);
//   const [comments, setComments] = useState([]);

//   useInterval(() => {
//     updateCommentTimeDisplay();
//   }, 1000 * 5);
//   function updateCommentTimeDisplay() {
//     const commentsCopy = [...comments];
//     commentsCopy.forEach(
//       (comment) => (comment.createdDate = dayjs(comment.createdDate))
//     );
//     formatComments(commentsCopy);
//   }

//   function handleEditComment(commentId) {
//     const i = comments.findIndex((comment) => comment.id === commentId);
//     const commentCopy = {
//       id: comments[i].id,
//       text: comments[i].text,
//       assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
//       user: user.jwt,
//       createdDate: comments[i].createdDate,
//     };
//     setComment(commentCopy);
//   }

//   useEffect(() => {
//     console.log(comment);
//   }, [comment]);

//   function handleDeleteComment(commentId) {
//     // TODO: send DELETE request to server
//     myFetch(`/api/comments/${commentId}`, "delete", user.jwt).then((msg) => {
//       const commentsCopy = [...comments];
//       const i = commentsCopy.findIndex((comment) => comment.id === commentId);
//       commentsCopy.splice(i, 1);
//       formatComments(commentsCopy);
//     });
//   }
//   function formatComments(commentsCopy) {
//     commentsCopy.forEach((comment) => {
//       if (typeof comment.createDate === "string") {
//         console.log(
//           "BEFORE Converting string date to dayjs date",
//           comment.createdDate
//         );
//         comment.createDate = dayjs(comment.createDate);
//         console.log(
//           "AFTER Converting string date to dayjs date",
//           comment.createdDate
//         );
//       }
//     });
//     setComments(commentsCopy);
//   }

//   useEffect(() => {
//     myFetch(
//       `/api/comments?assignmentId=${assignmentId}`,
//       "get",
//       user.jwt,
//       null
//     ).then((commentsData) => {
//       formatComments(commentsData);
//     });
//   }, []);

//   function updateComment(value) {
//     const commentCopy = { ...comment };
//     commentCopy.text = value;
//     setComment(commentCopy);
//   }
//   function submitComment() {
//     // if (
//     //   typeof comment.createdDate === "object" &&
//     //   comment.createdDate != null
//     // ) {
//     //   comment.createdDate = comment.createdDate.toDate();
//     // }
//     if (comment.id) {
//         myFetch(`/api/comments/${comment.id}`, "put", user.jwt, comment).then(
//         (d) => {
//           const commentsCopy = [...comments];
//           const i = commentsCopy.findIndex((comment) => comment.id === d.id);
//           commentsCopy[i] = d;
//           formatComments(commentsCopy);

//           setComment(emptyComment);
//         }
//       );
//     } else {
//         myFetch("/api/comments", "post", user.jwt, comment).then((d) => {
//         const commentsCopy = [...comments];
//         commentsCopy.push(d);
//         formatComments(commentsCopy);
//         setComment(emptyComment);
//       });
//     }
//   }
//   return (
//     <>
//       <div className="mt-5">
//         <textarea
//           style={{ width: "100%", borderRadius: "0.25em" }}
//           onChange={(e) => updateComment(e.target.value)}
//           value={comment.text}
//         ></textarea>
//         <Button onClick={() => submitComment()}>Post Comment</Button>
//       </div>
//       <div className="mt-5">
//         {comments.map((comment) => (
//           <Comment
//             key={comment.id}
//             commentData={comment}
//             emitDeleteComment={handleDeleteComment}
//             emitEditComment={handleEditComment}
//           />
//         ))}
//       </div>
//     </>
//   );
// };

// export default CommentContainer;