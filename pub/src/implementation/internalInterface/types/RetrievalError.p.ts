export type RetrievalError =
    | ["not found", null]
    | [
        "other",
        {
            readonly "description": string;
        }
    ];
