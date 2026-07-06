import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);       // item being edited
  const [editImage, setEditImage] = useState(false);    // new image for edit
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);       // id to confirm delete

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to load food list");
      }
    } catch (error) {
      toast.error("Cannot reach server");
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        setDeleteId(null);
        await fetchList();
      } else {
        toast.error(response.data.message || "Error removing item");
      }
    } catch (error) {
      toast.error("Cannot reach server");
    }
  }

  const openEdit = (item) => {
    setEditItem({ ...item });
    setEditImage(false);
  }

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({ ...prev, [name]: value }));
  }

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', editItem._id);
      formData.append('name', editItem.name);
      formData.append('description', editItem.description);
      formData.append('price', editItem.price);
      formData.append('category', editItem.category);
      if (editImage) {
        formData.append('image', editImage);
      }
      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setEditItem(null);
        setEditImage(false);
        await fetchList();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Cannot reach server");
    } finally {
      setEditLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div className='list-actions'>
              <button className='edit-btn' onClick={() => openEdit(item)}>✏️ Edit</button>
              <button className='delete-btn' onClick={() => setDeleteId(item._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit Modal ───────────────────────────────────── */}
      {editItem && (
        <div className='modal-overlay' onClick={() => setEditItem(null)}>
          <div className='modal-box' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Edit Food Item</h2>
              <button className='modal-close' onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form className='modal-form' onSubmit={submitEdit}>
              {/* Image */}
              <div className='modal-image-section'>
                <img
                  src={editImage ? URL.createObjectURL(editImage) : `${url}/images/${editItem.image}`}
                  alt={editItem.name}
                  className='modal-preview-img'
                />
                <label className='modal-img-label' htmlFor='edit-image'>
                  {editImage ? '✅ Image selected' : '📷 Change Image'}
                </label>
                <input
                  id='edit-image'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={e => setEditImage(e.target.files[0])}
                />
              </div>

              {/* Name */}
              <div className='modal-field'>
                <label>Name</label>
                <input name='name' value={editItem.name} onChange={onEditChange} required />
              </div>

              {/* Description */}
              <div className='modal-field'>
                <label>Description</label>
                <textarea name='description' value={editItem.description} onChange={onEditChange} rows={3} required />
              </div>

              {/* Category & Price row */}
              <div className='modal-row'>
                <div className='modal-field'>
                  <label>Category</label>
                  <select name='category' value={editItem.category} onChange={onEditChange}>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>
                <div className='modal-field'>
                  <label>Price ({currency})</label>
                  <input type='number' name='price' value={editItem.price} onChange={onEditChange} min='1' required />
                </div>
              </div>

              <div className='modal-actions'>
                <button type='button' className='modal-cancel-btn' onClick={() => setEditItem(null)}>Cancel</button>
                <button type='submit' className='modal-save-btn' disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Dialog ────────────────────────── */}
      {deleteId && (
        <div className='modal-overlay' onClick={() => setDeleteId(null)}>
          <div className='confirm-box' onClick={e => e.stopPropagation()}>
            <h3>Delete Item?</h3>
            <p>This action cannot be undone. Are you sure you want to remove this food item?</p>
            <div className='confirm-actions'>
              <button className='modal-cancel-btn' onClick={() => setDeleteId(null)}>Cancel</button>
              <button className='delete-confirm-btn' onClick={() => removeFood(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
