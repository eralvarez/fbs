import * as Yup from "yup";
declare const dateSchema: Yup.ObjectSchema<{
    createdAt: Date | null | undefined;
    updatedAt: Date | null | undefined;
    deletedAt: Date | null | undefined;
}, Yup.AnyObject, {
    createdAt: undefined;
    updatedAt: undefined;
    deletedAt: undefined;
}, "">;
export { dateSchema };
