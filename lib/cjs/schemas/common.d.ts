import * as Yup from "yup";
declare const commonSchema: Yup.ObjectSchema<{
    createdAt: Date | null | undefined;
    updatedAt: Date | null | undefined;
    deletedAt: Date | null | undefined;
    id: string | undefined;
}, Yup.AnyObject, {
    createdAt: undefined;
    updatedAt: undefined;
    deletedAt: undefined;
    id: undefined;
}, "">;
export { commonSchema };
