
import React, { useState } from 'react';
import { Course, CourseLevel } from '../types';
import { Button } from './Button';

interface CourseCardProps {
  course: Course;
  onRegister: (courseId: string) => void;
  isRegistered: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
  progress?: number;
  onProgressChange?: (progress: number) => void;
  onRequestCompletion?: (courseId: string, evidence?: string) => void;
  onViewCertificate?: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  isAdmin?: boolean;
  averageRating?: number;
  reviewCount?: number;
  onRate?: (courseId: string) => void;
  hasRated?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onRegister, 
  isRegistered, 
  isCompleted, 
  isPending,
  progress = 0,
  onProgressChange,
  onRequestCompletion, 
  onViewCertificate,
  onEdit,
  onDelete,
  isAdmin,
  averageRating,
  reviewCount,
  onRate,
  hasRated
}) => {
  const [evidence, setEvidence] = useState('');
  const hasRequirements = course.requirements && course.requirements.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group">
      <div className="relative h-48">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-600">
          {course.level}
        </div>
        {isCompleted && (
             <div className="absolute top-4 left-4 bg-green-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-800 flex items-center gap-1 border border-green-200 shadow-sm animate-[pulse_3s_infinite]">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                 Completed
             </div>
        )}
        {isPending && (
             <div className="absolute top-4 left-4 bg-yellow-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-yellow-800 flex items-center gap-1 border border-yellow-200">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                 Pending Approval
             </div>
        )}
        {isAdmin && (
             <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
                        className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 focus:outline-none ring-1 ring-red-100 transition-colors"
                        title="Delete Course"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                )}
                {onEdit && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(course); }}
                        className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none ring-1 ring-gray-200 transition-colors"
                        title="Edit Course"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                )}
             </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    {course.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
                {averageRating !== undefined && reviewCount !== undefined && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100" title={`${reviewCount} reviews`}>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs font-bold text-gray-700">{averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({reviewCount})</span>
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
            <div 
                className="text-gray-600 text-sm mb-4 line-clamp-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:font-bold [&>h2]:font-bold [&>b]:font-bold [&>strong]:font-bold [&>i]:italic [&>em]:italic"
                dangerouslySetInnerHTML={{ __html: course.description }}
            />
            
            <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{course.duration}</span>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">GHC {course.price}</span>
                {isRegistered && !isCompleted && !isPending && (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        In Progress
                     </span>
                )}
            </div>
            
            {isRegistered ? (
                <div className="flex flex-col gap-3">
                    {/* Progress Tracker */}
                    {!isCompleted && (
                        <div className="w-full">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Course Progress</span>
                                <span>{progress}%</span>
                            </div>
                            {onProgressChange ? (
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={progress} 
                                    onChange={(e) => onProgressChange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ) : (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )}

                    {isCompleted && (
                        <div className="flex gap-2">
                            {onViewCertificate && (
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewCertificate(course.id)}>
                                    Certificate
                                </Button>
                            )}
                            {onRate && !hasRated && (
                                <Button variant="secondary" size="sm" className="flex-1 bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400" onClick={() => onRate(course.id)}>
                                    ★ Rate
                                </Button>
                            )}
                            {hasRated && (
                                <div className="flex-1 flex items-center justify-center text-xs text-green-600 font-medium bg-green-50 rounded-lg border border-green-200">
                                    ✓ Rated
                                </div>
                            )}
                        </div>
                    )}

                    {isPending ? (
                        <Button variant="outline" size="sm" className="w-full opacity-75 cursor-not-allowed bg-yellow-50 text-yellow-700 border-yellow-200" disabled>
                            <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Pending Admin Approval
                        </Button>
                    ) : !isCompleted && onRequestCompletion ? (
                        hasRequirements ? (
                           <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-3">
                               <div>
                                    <p className="text-xs font-bold text-gray-700 mb-1">Requirements for Completion:</p>
                                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                                        {course.requirements?.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                               </div>
                               <div>
                                   <textarea 
                                        className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" 
                                        rows={2} 
                                        placeholder="Add evidence (links, notes) here..."
                                        value={evidence}
                                        onChange={(e) => setEvidence(e.target.value)}
                                   />
                               </div>
                               <Button variant="secondary" size="sm" className="w-full" onClick={() => onRequestCompletion(course.id, evidence)}>
                                    Submit Evidence & Request
                                </Button>
                           </div>
                        ) : (
                            <Button variant="secondary" size="sm" className="w-full" onClick={() => onRequestCompletion(course.id)}>
                                Request Completion
                            </Button>
                        )
                    ) : null}
                </div>
            ) : (
                <Button onClick={() => onRegister(course.id)} className="w-full" disabled={isAdmin}>
                    {isAdmin ? 'Admin Mode' : 'Register Now'}
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};