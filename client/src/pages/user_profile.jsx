import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
} from "@/store/slices/auth/auth_slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar);
  const [previewCover, setPreviewCover] = useState(user?.coverImage);

  // Validation Schema for Account Details
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Handle file change for Avatar and Cover Image
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      const formData = new FormData();

      if (field === "avatar") {
        formData.append("avatar", file); // Append avatar
        setPreviewAvatar(previewURL);
        dispatch(updateUserAvatar(formData));
      }

      if (field === "coverImage") {
        formData.append("coverImage", file); // Append coverImage
        setPreviewCover(previewURL);
        dispatch(updateUserCoverImage(formData));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={previewCover}
          alt="Cover"
          className="w-full h-40 object-cover rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => handleFileChange(e, "coverImage")}
        />
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <img
          src={previewAvatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg z-30"
        />
      </div>
      <div className="text-center">
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => handleFileChange(e, "avatar")}
        />
      </div>

      {/* User Info Form */}
      <Formik
        initialValues={{
          fullName: user.fullName,
          email: user.email,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(updateUserProfile(values));
        }}
      >
        {() => (
          <Form className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <Field name="fullName" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Details
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;
