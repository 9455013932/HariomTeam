import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TelecallerUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file", file);
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/addemployeeData", {
        method: "POST",
        body: formData,
        enctype: "multipart/form-data",
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const result = await response.json();
      console.log("File upload result:", result);
      toast.success("File Uploaded Successfully");
      setSelectedFile(null);
      fileInputRef.current.value = null; 
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <main>
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Telecaller Upload Data</h1>
        <form className="upload-form">
          <div className="col-md-3 mb-3" style={{ zIndex: 10 }}>
            <Form.Group>
              <Form.Label>
                <h5>
                  Upload File<sup className="text-red-600">*</sup>
                </h5>
              </Form.Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Form.Group>
          </div>
        </form>
        <br />
        {selectedFile && (
          <div className="col-md-3 mb-3" style={{ zIndex: 10 }}>
            <Button variant="success" type="button" onClick={handleFileUpload}>
              Upload Selected File
            </Button>
          </div>
        )}
        {!selectedFile && (
          <Button
            variant="primary"
            type="button"
            onClick={() => fileInputRef.current.click()}
          >
            Add CSV
          </Button>
        )}
      </div>
    </main>
  );
};

export default TelecallerUpload;
