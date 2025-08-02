import React, { useState } from 'react';

const constructionTypes = [
  'Steel Frame',
  'Concrete Frame',
  'Wood Frame',
  'Hybrid'
];

const storiesOptions = ['1', '2', '3', '4', '5+'];

const houseTypes = ['Residential', 'Commercial', 'Industrial', 'Warehouse'];

const foundationTypes = [
  'Slab-on-Grade',
  'T-Shaped',
  'Basement',
  'Crawl Space',
  'Pile Foundation'
];

const roofTypes = [
  'Gable',
  'Hip',
  'Shed',
  'Gambrel',
  'Flat',
  'Truss System'
];

export default function ProjectForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    plotSize: '',
    constructionType: '',
    stories: '',
    houseType: '',
    foundationType: '',
    roofType: '',
    specialRequirements: '',
    firstQuery: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.plotSize) newErrors.plotSize = 'Plot Size is required';
    if (!formData.constructionType) newErrors.constructionType = 'Construction Type is required';
    if (!formData.stories) newErrors.stories = 'Number of Stories is required';
    if (!formData.houseType) newErrors.houseType = 'Building Type is required';
    if (!formData.foundationType) newErrors.foundationType = 'Foundation Type is required';
    if (!formData.roofType) newErrors.roofType = 'Roof Type is required';
    if (!formData.firstQuery) newErrors.firstQuery = 'First Question is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Pass formData to onSubmit callback
    onSubmit(formData);
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <h2>Welcome to Your Steel Construction Consultant</h2>
          <p>Please provide your project details to get started with personalized consultation</p>
        </div>
        <form className="project-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="plotSize" className="form-label">Plot Size (sq. ft.)</label>
              <input
                type="number"
                id="plotSize"
                name="plotSize"
                className="form-control"
                min="100"
                step="100"
                value={formData.plotSize}
                onChange={handleChange}
                placeholder='Enter plot size'
                required
              />
              {errors.plotSize && <p className="error-text">{errors.plotSize}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="constructionType" className="form-label">Construction Type</label>
              <select
                id="constructionType"
                name="constructionType"
                className="form-control"
                value={formData.constructionType}
                onChange={handleChange}
                required
              >
                <option value="">Select construction type</option>
                {constructionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.constructionType && <p className="error-text">{errors.constructionType}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="stories" className="form-label">Number of Stories</label>
              <select
                id="stories"
                name="stories"
                className="form-control"
                value={formData.stories}
                onChange={handleChange}
                required
              >
                <option value="">Select stories</option>
                {storiesOptions.map((story) => (
                  <option key={story} value={story}>{story}</option>
                ))}
              </select>
              {errors.stories && <p className="error-text">{errors.stories}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="houseType" className="form-label">Building Type</label>
              <select
                id="houseType"
                name="houseType"
                className="form-control"
                value={formData.houseType}
                onChange={handleChange}
                required
              >
                <option value="">Select building type</option>
                {houseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.houseType && <p className="error-text">{errors.houseType}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="foundationType" className="form-label">Foundation Type</label>
              <select
                id="foundationType"
                name="foundationType"
                className="form-control"
                value={formData.foundationType}
                onChange={handleChange}
                required
              >
                <option value="">Select foundation type</option>
                {foundationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.foundationType && <p className="error-text">{errors.foundationType}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="roofType" className="form-label">Roof Type</label>
              <select
                id="roofType"
                name="roofType"
                className="form-control"
                value={formData.roofType}
                onChange={handleChange}
                required
              >
                <option value="">Select roof type</option>
                {roofTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.roofType && <p className="error-text">{errors.roofType}</p>}
            </div>

            <div className="form-group form-group-wide">
              <label htmlFor="specialRequirements" className="form-label">Other Requirements (Optional)</label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                className="form-control"
                rows="3"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any special requirements or considerations for your project..."
              />
            </div>

            <div className="form-group form-group-wide">
              <label htmlFor="firstQuery" className="form-label">Your First Question</label>
              <textarea
                id="firstQuery"
                name="firstQuery"
                className="form-control"
                rows="3"
                value={formData.firstQuery}
                onChange={handleChange}
                placeholder="Ask me anything about your steel construction project..."
                required
              />
              {errors.firstQuery && <p className="error-text">{errors.firstQuery}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--lg">Start Consultation</button>
        </form>
      </div>
    </div>
  );
}
