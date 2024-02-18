import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    location: "",
    type: "sale",
    modelYear: 2024,
    mileage: 0,
    price: 0,
    bodyType: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const params = useParams();
  // eslint-disable-next-line no-unused-vars
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7 + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          setImageUploadError("Image should not be greater than 2mb");
          setUploading(false);
        });
    } else {
      setImageUploadError("Only 6 images can be selected");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "sedan" ||
      e.target.id === "suv" ||
      e.target.id === "hatchback" ||
      e.target.id === "others"
    ) {
      setFormData({ ...formData, bodyType: e.target.id });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update A Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            onChange={handleChange}
            value={formData.name}
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg"
            id="location"
            onChange={handleChange}
            value={formData.location}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="sedan"
                className="w-5"
                onChange={handleChange}
                checked={formData.bodyType === "sedan"}
              />
              <span>Sedan</span>
            </div>
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="hatchback"
                className="w-5"
                onChange={handleChange}
                checked={formData.bodyType === "hatchback"}
              />
              <span>Hatchback</span>
            </div>
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="suv"
                className="w-5"
                onChange={handleChange}
                checked={formData.bodyType === "suv"}
              />
              <span>SUV</span>
            </div>
            <div className="flex-gap-2">
              <input
                type="checkbox"
                id="others"
                className="w-5"
                onChange={handleChange}
                checked={formData.bodyType === "others"}
              />
              <span>Others</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <p>Model Year</p>
              <input
                type="number"
                min="1900"
                step="1"
                id="modelYear"
                onChange={handleChange}
                value={formData.modelYear}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p>Mileage</p>
                <input
                  type="number"
                  step="1"
                  id="mileage"
                  onChange={handleChange}
                  value={formData.mileage}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <p>Price</p>
                <span className="text-xs">(PKR)</span>
              </div>
              <input
                type="number"
                step="1"
                id="price"
                onChange={handleChange}
                value={formData.price}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (maximum 6 allowed)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-600 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs &&
            formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center">
                <img
                  src={url}
                  alt="Listing Image"
                  className="w-40 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-80">
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating Listing...." : "Update Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
