import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { COLORS, formatDate } from "../../utils/helpers";

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, { name: "", label: "", type: "text", options: [] }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const saveForm = () => {
    console.log("Form saved!", { title: formTitle, fields });
    // Replace with API call: POST /api/forms
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Form</h1>
      <div className="mb-4">
        <label className="block font-semibold">Form Title</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Fields</h2>
        {fields.map((field, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <input
              type="text"
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => updateField(idx, "label", e.target.value)}
              className="p-1 border rounded mr-2"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(idx, "type", e.target.value)}
              className="p-1 border rounded"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="textarea">Textarea</option>
              <option value="select">Dropdown</option>
            </select>
          </div>
        ))}
        <button
          onClick={addField}
          className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Field
        </button>
      </div>

      <button
        onClick={saveForm}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save Form
      </button>
    </div>
  );
}