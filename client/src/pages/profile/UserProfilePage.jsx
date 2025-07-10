// pages/profilepage/UserProfilePage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/userService";
import translations from "../../../public/locales/en/translation.json";

// HELPER: Canvas preview function
function canvasPreview(image, canvas, crop) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();
  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );
  ctx.restore();
}

// Custom hook with correct dependencies
function useDebounceEffect(fn, waitTime, deps) {
  const callback = useCallback(fn, deps);

  useEffect(() => {
    const t = setTimeout(() => {
      callback();
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [callback, waitTime]);
}

// FormRow component
const FormRow = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-2 items-start w-full">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 md:pt-2">
      {label}
    </label>
    <div className="md:col-span-3 w-full">{children}</div>
  </div>
);

const UserProfilePage = () => {
  const { user, updateUserContext } = useAuth();

  // Translation helper function
  const t = (key) => {
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    socialLinks: { website: "", github: "", twitter: "" },
  });

  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        socialLinks: user.socialLinks || {
          website: "",
          github: "",
          twitter: "",
        },
      });
    }
  }, [user]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(String(reader.result) || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(newCrop);
  };

  useDebounceEffect(
    () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop, imgRef, previewCanvasRef]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("socialLinks", JSON.stringify(formData.socialLinks));

    if (completedCrop && previewCanvasRef.current) {
      previewCanvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            data.append("profilePicture", blob, "profile-picture.png");
          }
          sendData(data);
        },
        "image/png",
        0.95
      );
    } else {
      sendData(data);
    }
  };

  const sendData = async (data) => {
    try {
      const apiResponse = await userService.updateProfile(data);

      if (apiResponse.token) {
        localStorage.setItem("token", apiResponse.token);
      }

      updateUserContext(apiResponse);
      setSuccess("Profile updated successfully!");
      setImgSrc("");
      setCompletedCrop(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile.";
      setError(message);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg w-full"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("profilePage.title")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("profilePage.description")}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo Section */}
          <FormRow label="Photo">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  src={
                    user.profilePictureUrl
                      ? `${import.meta.env.VITE_APP_API_URL}${
                          user.profilePictureUrl
                        }`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=6366f1&color=fff&size=256`
                  }
                  alt="Current profile"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Choose Photo
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, or GIF up to 2MB. Recommended: 256x256px
                </p>
              </div>
            </div>
          </FormRow>

          {/* Image Cropper Section */}
          {imgSrc && (
            <FormRow label="Crop Photo">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                      className="max-w-full"
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="rounded-md max-w-full h-auto"
                      />
                    </ReactCrop>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preview
                    </p>
                    <div className="relative">
                      <canvas
                        ref={previewCanvasRef}
                        className="rounded-full shadow-md"
                        style={{
                          border: "2px solid #e5e7eb",
                          objectFit: "contain",
                          width: 100,
                          height: 100,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FormRow>
          )}

          {/* Full Name Field */}
          <FormRow label={t("profilePage.nameLabel")}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400"
              placeholder="Enter your full name"
            />
          </FormRow>

          {/* Email Address Field */}
          <FormRow label="Email Address">
            <div className="flex items-center">
              <p className="text-sm text-gray-800 dark:text-gray-300 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-1">
                {user.email}
              </p>
              {user.provider === "google" && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Google
                </span>
              )}
            </div>
          </FormRow>

          {/* Password Change Link */}
          {user.provider !== "google" && (
            <FormRow label="Password">
              <Link
                to="/settings/security"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2m0 0a2 2 0 012 2m-6 8h6"
                  />
                </svg>
                Change Password
              </Link>
            </FormRow>
          )}

          {/* Gender Selection */}
          <FormRow label="Gender (Optional)">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </FormRow>

          {/* Social Networks */}
          <FormRow label="Social Networks (Optional)">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  name="website"
                  placeholder="https://your-website.com"
                  value={formData.socialLinks.website}
                  onChange={handleSocialChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/your-username"
                  value={formData.socialLinks.github}
                  onChange={handleSocialChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="twitter"
                  placeholder="https://twitter.com/your-username"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>
          </FormRow>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 px-6 py-4 rounded-b-lg">
          <div className="flex-1">
            {error && (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t("buttons.cancel")}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("buttons.saving")}
                </>
              ) : (
                t("buttons.saveChanges")
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
