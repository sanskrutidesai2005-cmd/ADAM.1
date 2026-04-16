import React, { useState, useEffect } from 'react';
import { Droplet, User, Calendar, GitMerge, Thermometer, Wind, Scale, FileText } from 'lucide-react';

const PersonalDetailsForm = ({ onComplete, formData, onInputChange }) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { dob, height, weight, blood_group, gender } = formData;
    setIsFormValid(dob && height && weight && blood_group && gender);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Personal Details</h2>
      <p className="text-slate-500 mt-1 mb-6">Help us get to know you better.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={onInputChange} icon={Calendar} />
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={onInputChange} icon={User} options={['Male', 'Female', 'Other']} />
          <InputField label="Height (cm)" name="height" type="number" value={formData.height} onChange={onInputChange} icon={Scale} placeholder="165" />
          <InputField label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={onInputChange} icon={Scale} placeholder="65" />
          <SelectField label="Blood Group" name="blood_group" value={formData.blood_group} onChange={onInputChange} icon={Droplet} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, placeholder, icon: Icon }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
    </div>
  );

  const SelectField = ({ label, name, value, onChange, icon: Icon, options }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none"
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

export default PersonalDetailsForm;
