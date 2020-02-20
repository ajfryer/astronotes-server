BEGIN;

TRUNCATE
  folders,
  notes
  RESTART IDENTITY CASCADE;

INSERT INTO folders (name)
VALUES ('Classical Music');

INSERT INTO folders (name)
VALUES ('Test Folder 2');

INSERT INTO folders (name)
VALUES ('Test Folder 3');

INSERT INTO notes (name, content, date_created, date_modified, folder_id)
VALUES ('Bach''s greatest composition', 'We''re no strangers to love
You know the rules and so do I
A full commitment''s what I''m thinking of
You wouldn''t get this from any other guy
I just wanna tell you how I''m feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
We''ve known each other for so long
Your heart''s been aching but you''re too shy to say it
Inside we both know what''s been going on
We know the game and we''re gonna play it
And if you ask me how I''m feeling
Don''t tell me you''re too blind to see
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give, never gonna give
(Give you up)
(Ooh) Never gonna give, never gonna give
(Give you up)
We''ve known each other for so long
Your heart''s been aching but you''re too shy to say it
Inside we both know what''s been going on
We know the game and we''re gonna play it
I just wanna tell you how I''m feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry', now() - '150000 days'::INTERVAL, now() - '12000 days'::INTERVAL, 1);

INSERT INTO notes (name, content, date_created, date_modified, folder_id)
VALUES ('Test Note 2', 'Test Note Content 2', now() - '3 days'::INTERVAL, now() - '2days'::INTERVAL, 2);

INSERT INTO notes (name, content, date_created, date_modified, folder_id)
VALUES ('Test Note 3', 'Test Note Content 3', now() - '4 days'::INTERVAL, now() - '3 days'::INTERVAL, 3);

COMMIT;