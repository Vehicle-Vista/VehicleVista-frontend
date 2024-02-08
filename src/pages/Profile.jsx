import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // Firebase Storage Rules
  // allow read;
  // allow write: if
  // request.resource.size < 2*1024*1024 && request.resource.contentType.matches('image/.*')

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const upload = uploadBytesResumable(storageRef, file);
    upload.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || user.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile-picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-700">
              Error Image Upload (Image must be less than 2mb)
            </span>
          ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
            <span className="text-slate-700">{`Uploading file ${uploadPercentage}`}</span>
          ) : uploadPercentage === 100 ? (
            <span className="text-green-700">
              Image Successfully Uploaded!{" "}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
