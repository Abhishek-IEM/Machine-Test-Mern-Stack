import React, { useState } from "react";
import API from "../utils/api";
import styles from "../styles/UploadTasks.module.css";
import { toast } from "react-toastify";

const UploadTasks = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  //Handle File Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //Handle File Upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const { data } = await API.post("/tasks/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message || "Tasks uploaded successfully!");
      setFile(null);

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadBox}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        {file && <p>Selected file: {file.name}</p>}
        <button type="submit" disabled={loading} className={styles.uploadBtn}>
          {loading ? "Uploading..." : "Upload Tasks"}
        </button>
      </form>
    </div>
  );
};

export default UploadTasks;
