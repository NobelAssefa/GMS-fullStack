import React from "react";
import "./newProduct.css";
import PublishIcon from "@mui/icons-material/Publish";

export default function NewProduct() {
  return (
    <div className="newProduct">
      <form className="productForm">
        <div className="productFormLeft">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Jbl Headset"
            className="productInput"
          />
          <label>InStock</label>
          <select name="stock" id="stock">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <label>InStock</label>
          <select name="active" id="active">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="productFormRight">
          <div className="productupload">
            <img
              src="https://images.pexels.com/photos/13650607/pexels-photo-13650607.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt=""
              className="ProductUploadimg"
            />
            <label for="upload">
              <PublishIcon />
            </label>
            <input
              type="file"
              id="upload"
              name="upload"
              style={{ display: "none" }}
            ></input>
          </div>
          <button className="productButton">Update</button>
        </div>
      </form>
    </div>
  );
}
