import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(imageUploadError);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7) {
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
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
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
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create A Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg"
            id="location"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex-gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="sedan" className="w-5" />
              <span>Sedan</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="hatchback" className="w-5" />
              <span>Hatchback</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="suv" className="w-5" />
              <span>SUV</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="others" className="w-5" />
              <span>Others</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <p>Model Year</p>
              <input
                type="number"
                min="1900"
                max="2022"
                step="1"
                value="2022"
                id="modelYear"
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
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center">
                <img
                  src={url}
                  alt="Listing Image"
                  className="w-40 h-20 object-cover rounded-lg"
                />
                ;
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-80">
                  Delete
                </button>
                ;
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
