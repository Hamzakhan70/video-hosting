import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/store/slices/auth/auth_slice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "", // Can be username or email
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Username or Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        // toast.success("Login successful! 🚀");
        navigate("/dashboard"); // Redirect after successful login
      } catch (error) {
        toast.error(error.message || "Login failed ❌");
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block font-medium">Username or Email</label>
              <Input
                type="text"
                name="email"
                placeholder="Enter your username or email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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

export default Login;
