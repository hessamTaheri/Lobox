import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";

// A custom hook to handle clicks outside of an element
function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {
    // Call the callback function if the click is outside of the element
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

// A custom hook to manage the state of the dropdown and items
function useDropdown(items: any[]) {
  // The state of the dropdown (open or closed)
  const [open, setOpen] = useState(false);
  // The state of the selected items
  const [selected, setSelected] = useState<any[]>([]);
  // The state of the input value
  const [value, setValue] = useState("");

  // A function to toggle the dropdown
  function toggleDropdown() {
    setOpen(!open);
  }

  // A function to handle the input change
  function handleChange(event: any) {
    setValue(event.target.value);
  }

  // A function to handle the input key press
  function handleKeyPress(event: any) {
    // If the enter key is pressed, add the input value to the items
    if (event.key === "Enter") {
      // Check if the input value is not empty and not already in the items
      if (value && !items.includes(value)) {
        // Add the input value to the items
        items.push(value);
        // Clear the input value
        setValue("");
        console.log(items)
      }
    }
  }

  // A function to handle the item click
  function handleItemClick(item: any) {
    // Check if the item is already selected
    if (selected.includes(item)) {
      // Remove the item from the selected items
      setSelected(selected.filter((i) => i !== item));
    } else {
      // Add the item to the selected items
      setSelected([...selected, item]);
    }
  }

  // A function to close the dropdown
  function closeDropdown() {
    setOpen(false);
  }

  // Return the state and functions of the hook
  return {
    open,
    selected,
    value,
    toggleDropdown,
    handleChange,
    handleKeyPress,
    handleItemClick,
    closeDropdown,
  };
}

// A component to render the dropdown
function Dropdown() {
  // The initial items of the dropdown
  const items = [
    { label: "Yeeeeah, science!", icon: "🔬" },
    { label: "Art", icon: "🎨" },
    { label: "Sport", icon: "⚽" },
    { label: "Games", icon: "🎮" },
    { label: "Health", icon: "🏥" },
  ];

  // Use the custom hook to manage the dropdown state
  const {
    open,
    selected,
    value,
    toggleDropdown,
    handleChange,
    handleKeyPress,
    handleItemClick,
    closeDropdown,
  } = useDropdown(items);

  // Use a ref to access the dropdown element
  const dropdownRef = useRef(null);

  // Use the custom hook to handle clicks outside of the dropdown element
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-label" onClick={toggleDropdown}>
        Education {open ? "▲" : "▼"}
      </div>
      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-input">
            <input
              type="text"
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Add new item..."
            />
          </div>
          <div className="dropdown-items">
            {items.map((item) => (
              <div
                className={`dropdown-item ${
                  selected.includes(item) ? "selected" : ""
                }`}
                onClick={() => handleItemClick(item)}
                key={item.label}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;