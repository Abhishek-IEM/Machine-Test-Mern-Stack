import React from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';


const MobileInput = ({ value, onChange }) => {
  return (
    <PhoneInput
      country={'in'}
      value={value}
      onChange={onChange}
      enableSearch={true}
      placeholder="Enter mobile number"
      inputStyle={{
        width: '100%',
        height: '44px',
        padding: '12px 50px',
        borderRadius: '8px',
        border: '2px solid #ddd',
        fontSize: '15px',
        boxSizing: 'border-box',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333',
      }}
      buttonStyle={{
        borderRadius: '8px 0 0 8px',
        border: '2px solid #ddd',
        borderRight: 'none',
        height: '44px',
      }}
      dropdownStyle={{
        borderRadius: '8px',
        maxHeight: '220px',
        overflowY: 'auto',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        backgroundColor: '#10101bff', 
      }}
      containerClass="phone-container"
    />
  );
};

export default MobileInput;
