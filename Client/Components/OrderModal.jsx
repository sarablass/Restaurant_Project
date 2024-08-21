import React from 'react';
import '../css/orderModal.css'; // ייבוא קובץ CSS עבור הסטיילינג של החלונית

const OrderModal = ({ onClose }) => {
  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <h2>הזמנתך בטיפול</h2>
        <button className="order-modal-close" onClick={onClose}>סגור</button>
      </div>
    </div>
  );
}

export default OrderModal;
