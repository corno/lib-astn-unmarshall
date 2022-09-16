
export type InternalSchemaSpecification =
| ["embedded", null]
| ["reference", { name: string }]
| ["none", null]