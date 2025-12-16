import * as Yup from "yup";

export const fieldSchema = Yup.object().shape({
  diameter: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Head Pulley Diameter is required"),

  ratio: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Gear Ratio is required"),

  length: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Length is required"),

  height: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Conveyor Height is required"),

  width: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Width is required"),
  thickness: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Thickness is required"),
  capacity: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .required("Material Capacity is required"),
  density: Yup.string().required("Density must be selected"),
  friction: Yup.string().required("Friction Coefficient must be selected"),
});
