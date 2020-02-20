CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    content TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP DEFAULT now() NOT NULL,
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE NOT NULL
);