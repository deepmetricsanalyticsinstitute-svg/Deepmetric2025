
import React, { useState, useEffect, useRef } from 'react';
import { Course, CourseLevel } from '../types';
import { Button } from './Button';
import { generateTagsForCourse } from '../services/geminiService';

interface CourseEditorProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

const EditorToolbarButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
        title={label}
    >
        {icon}
    </button>
);

export const CourseEditor: React.FC<CourseEditorProps> = ({ course, onSave, onCancel, isCreating = false }) => {
  const [formData, setFormData] = useState<Course>(course);
  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    setFormData(course);
    if (editorRef.current && course.description) {
        editorRef.current.innerHTML = course.description;
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleDescriptionChange = () => {
      if (editorRef.current) {
          setFormData(prev => ({ ...prev, description: editorRef.current?.innerHTML || '' }));
      }
  };

  const execCmd = (command: string) => {
      document.execCommand(command, false, undefined);
      handleDescriptionChange();
  };

  const handleGenerateTags = async () => {
      if (!formData.title && !formData.description) return;
      
      setIsGeneratingTags(true);
      try {
          const cleanDesc = formData.description.replace(/<[^>]*>?/gm, '');
          const tags = await generateTagsForCourse(formData.title, cleanDesc);
          
          const currentTagsLower = new Set(formData.tags.map(t => t.toLowerCase().trim()));
          const newSuggestions = tags.filter(t => !currentTagsLower.has(t.toLowerCase().trim()));
          
          setSuggestedTags(newSuggestions);
      } catch (error) {
          console.error("Failed to generate tags");
      } finally {
          setIsGeneratingTags(false);
      }
  };

  const addTag = (tag: string) => {
      const newTags = [...formData.tags, tag];
      setFormData(prev => ({ ...prev, tags: newTags }));
      setSuggestedTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddRequirement = () => {
      if (!newRequirement.trim()) return;
      setFormData(prev => ({
          ...prev,
          requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
      setFormData(prev => ({
          ...prev,
          requirements: (prev.requirements || []).filter((_, i) => i !== index)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-900 px-6 py-4 border-b border-indigo-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{isCreating ? 'Create New Course' : 'Edit Course'}</h2>
          {isCreating ? (
             <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold uppercase tracking-wider">New</span>
          ) : (
             <span className="px-2 py-1 bg-indigo-800 text-indigo-200 text-xs rounded font-mono">ID: {formData.id}</span>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Advanced Data Visualization"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow">
                  <div className="bg-gray-50 border-b border-gray-200 p-1 flex gap-1">
                      <EditorToolbarButton 
                          onClick={() => execCmd('bold')} 
                          label="Bold"
                          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" /></svg>} 
                      />
                      <EditorToolbarButton 
                          onClick={() => execCmd('italic')} 
                          label="Italic"
                          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5h4M8 19h4M12 5l-2 14" /></svg>} 
                      />
                      <EditorToolbarButton 
                          onClick={() => execCmd('insertUnorderedList')} 
                          label="Bullet List"
                          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>} 
                      />
                      <EditorToolbarButton 
                          onClick={() => execCmd('insertOrderedList')} 
                          label="Numbered List"
                          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01" /></svg>} 
                      />
                  </div>
                  <div
                      ref={editorRef}
                      contentEditable
                      className="p-3 min-h-[150px] outline-none text-sm text-gray-900 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                      onInput={handleDescriptionChange}
                      suppressContentEditableWarning
                  />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use the toolbar to format text. Lists and bold text are supported.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 8 Weeks"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.values(CourseLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHC)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">GHC</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-md border border-gray-300 pl-12 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                  <button 
                      type="button" 
                      onClick={handleGenerateTags}
                      disabled={isGeneratingTags || (!formData.title && !formData.description)}
                      className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      {isGeneratingTags ? (
                          <>
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating AI Tags...
                          </>
                      ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Auto-Suggest Tags
                          </>
                      )}
                  </button>
              </div>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="Python, AI, Business"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {suggestedTags.length > 0 && (
                  <div className="mt-3 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">AI Suggestions</span>
                         <div className="h-px bg-indigo-100 flex-1"></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {suggestedTags.map(tag => (
                              <button
                                  key={tag}
                                  type="button"
                                  onClick={() => addTag(tag)}
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all hover:shadow-sm"
                              >
                                  {tag}
                                  <svg className="ml-1.5 w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                              </button>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {/* Completion Requirements Section */}
            <div className="col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Completion Requirements</label>
                <p className="text-xs text-gray-500 mb-3">
                    Define specific criteria students must meet to request course completion (e.g., "Score > 80% on final quiz", "Watch all 10 video modules").
                </p>
                
                <div className="space-y-2 mb-3">
                    {formData.requirements && formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200 shadow-sm animate-fade-in">
                            <span className="text-sm text-gray-700 flex-1">{req}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveRequirement(index)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    {(!formData.requirements || formData.requirements.length === 0) && (
                        <div className="text-sm text-gray-400 italic">No specific requirements added.</div>
                    )}
                </div>

                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add a new requirement..."
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddRequirement(); }}}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddRequirement}>Add</Button>
                </div>
            </div>
            
             <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary">{isCreating ? 'Create Course' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};