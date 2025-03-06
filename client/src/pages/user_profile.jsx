import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "@/store/slices/auth/auth_slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  const [previewCover, setPreviewCover] = useState(user.coverImage);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Handle file change
  const handleFileChange = (e, setFieldValue, field) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (field === "avatar") setPreviewAvatar(previewURL);
      if (field === "coverImage") setPreviewCover(previewURL);
      setFieldValue(field, file);
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
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <img
          src={previewAvatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg z-30"
        />
      </div>

      {/* User Info Form */}
      <Formik
        initialValues={{
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          avatar: null,
          coverImage: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("fullName", values.fullName);
          formData.append("username", values.username);
          formData.append("email", values.email);
          if (values.avatar) formData.append("avatar", values.avatar);
          if (values.coverImage)
            formData.append("coverImage", values.coverImage);

          dispatch(updateUserProfile(formData));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <Field name="fullName" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Username</label>
              <Field name="username" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* File Uploads */}
            <div>
              <label className="block text-gray-700">Change Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setFieldValue, "avatar")}
              />
            </div>
            <div>
              <label className="block text-gray-700">Change Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setFieldValue, "coverImage")
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Profile
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;
