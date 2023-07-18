use assignmnet_submission_db;

SELECT * FROM assignment_submission_db.assignment;
SELECT * FROM assignment_submission_db.users;
SELECT * FROM assignment_submission_db.authority;

INSERT INTO `assignment_submission_db`.`authority` (`authority`, `user_id`) VALUES ('ROLE_STUDENT', '1');
INSERT INTO `assignment_submission_db`.`authority` (`authority`, `user_id`) VALUES ('ROLE_CODE_REVIEWER', '2');
INSERT INTO `assignment_submission_db`.`authority` (`authority`, `user_id`) VALUES ('ROLE_CODE_REVIEWER', '3');

UPDATE `assignment_submission_db`.`users` SET `username` = 'vlad' WHERE (`id` = '1');
UPDATE `assignment_submission_db`.`users` SET `username` = 'reviewer' WHERE (`id` = '2');
UPDATE `assignment_submission_db`.`users` SET `username` = 'reviewer2' WHERE (`id` = '3');

SELECT * FROM assignment_submission_db.comments;