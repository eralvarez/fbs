import * as Yup from "yup";
import { dateSchema } from "./dates";
const commonSchema = dateSchema.shape({
    id: Yup.string(),
});
export { commonSchema };
