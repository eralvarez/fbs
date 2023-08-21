import * as Yup from "yup";
const dateSchema = Yup.object().shape({
    createdAt: Yup.date().nullable(),
    updatedAt: Yup.date().nullable(),
    deletedAt: Yup.date().nullable(),
});
export { dateSchema };
