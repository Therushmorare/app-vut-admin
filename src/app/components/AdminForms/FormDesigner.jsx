import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const addField = () => {
    setFields([
      ...fields,
      { name: "", label: "", type: "text", options: "", required: false },
    ]);
    setOpenIndex(fields.length);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const saveForm = () => {
    console.log("Form saved!", { title: formTitle, fields });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Form
          </h1>
          <p className="text-gray-500 mt-2">
            Build a dynamic form to track beneficiary progress and challenges.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-sm rounded-2xl p-8 border">

          {/* Form Title */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Monthly Training Check-In"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Fields Section */}
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-5 bg-gray-50"
              >
                {/* Field Header */}
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {field.label || `Field ${idx + 1}`}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === idx ? null : idx)
                      }
                      className="text-gray-500 hover:text-gray-800"
                    >
                      {openIndex === idx ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => removeField(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expandable Field Body */}
                {openIndex === idx && (
                  <div className="mt-5 space-y-4">

                    <div>
                      <label className="block text-sm mb-1">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateField(idx, "label", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(idx, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Dropdown</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    {field.type === "select" && (
                      <div>
                        <label className="block text-sm mb-1">
                          Options (comma separated)
                        </label>
                        <input
                          type="text"
                          value={field.options}
                          onChange={(e) =>
                            updateField(idx, "options", e.target.value)
                          }
                          placeholder="Easy, Medium, Hard"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(idx, "required", e.target.checked)
                        }
                      />
                      <span className="text-sm">Required Field</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Field Button */}
          <button
            onClick={addField}
            className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Plus size={18} />
            Add Field
          </button>

          {/* Save Button */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={saveForm}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              Save Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}