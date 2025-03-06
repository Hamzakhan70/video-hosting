import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerUser } from "@/store/slices/auth/auth_slice";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
      coverImage: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      username: Yup.string().required("Username is required").lowercase(),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      avatar: Yup.mixed().required("Avatar is required"),
      coverImage: Yup.mixed(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });
      try {
        dispatch(registerUser(formData))
          .unwrap()
          .then(() => {
            navigate("/login");
          });
      } catch (error) {
        toast.error(error.message || "Registration failed");
      }
    },
  });

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    formik.setFieldValue(name, files[0]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
          >
            {[
              "fullName",
              "username",
              "email",
              "password",
              "confirmPassword",
            ].map((field) => (
              <div key={field}>
                <label className="block font-medium capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <Input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  placeholder={field}
                  {...formik.getFieldProps(field)}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-red-500 text-sm">{formik.errors[field]}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block font-medium">Avatar</label>
              <input
                type="file"
                name="avatar"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
              {formik.touched.avatar && formik.errors.avatar && (
                <p className="text-red-500 text-sm">{formik.errors.avatar}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Cover Image</label>
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Register
            </Button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
