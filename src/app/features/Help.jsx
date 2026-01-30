"use client"

import React, { useState, useEffect } from 'react';
import { Search, Book, MessageCircle, Mail, Phone, FileText, Video, Users, ChevronRight, Send, HelpCircle, X } from 'lucide-react';

const HelpSupport = ({ onClose, embedded = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const helpCategories = [
    { key: 'all', label: 'All Topics', icon: Book },
    { key: 'learners', label: 'Learner Management', icon: Users },
    { key: 'employers', label: 'Employer Management', icon: Users },
    { key: 'funding', label: 'Funding & Levy', icon: FileText },
    { key: 'compliance', label: 'Compliance & Reporting', icon: FileText },
    { key: 'technical', label: 'Technical Issues', icon: FileText }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'Registering new learners in the SETA system',
      category: 'learners',
      views: 1432,
      helpful: 91,
      lastUpdated: '2024-12-01',
      description: 'Step-by-step guide for adding new learners and updating their details in the SETA platform.'
    },
    {
      id: 2,
      title: 'Submitting employer levy reports',
      category: 'employers',
      views: 1087,
      helpful: 87,
      lastUpdated: '2024-11-28',
      description: 'Learn how employers can submit their levy contributions and reconcile payment reports.'
    },
    {
      id: 3,
      title: 'Accessing and managing funding grants',
      category: 'funding',
      views: 654,
      helpful: 79,
      lastUpdated: '2024-11-20',
      description: 'Guidance on how to apply for SETA funding, check approval status, and manage grant funds.'
    },
    {
      id: 4,
      title: 'Generating compliance and learner reports',
      category: 'compliance',
      views: 512,
      helpful: 84,
      lastUpdated: '2024-11-15',
      description: 'Learn how to generate reports for compliance audits and SETA submissions.'
    },
    {
      id: 5,
      title: 'Troubleshooting login or access issues',
      category: 'technical',
      views: 430,
      helpful: 68,
      lastUpdated: '2024-11-10',
      description: 'Common solutions for login failures, password resets, and account access problems.'
    },
    {
      id: 6,
      title: 'Scheduling learner assessments and workshops',
      category: 'learners',
      views: 798,
      helpful: 86,
      lastUpdated: '2024-11-08',
      description: 'Step-by-step instructions to schedule learner assessments, manage attendance, and update records.'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from SETA support',
      icon: MessageCircle,
      action: () => setShowContactForm(true),
      color: 'green'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step platform guides',
      icon: Video,
      action: () => console.log('Open video tutorials'),
      color: 'blue'
    },
    {
      title: 'User Manual',
      description: 'Download full SETA user guide',
      icon: FileText,
      action: () => console.log('Download user guide'),
      color: 'purple'
    }
  ];

  const contactInfo = [
    {
      method: 'Email',
      value: 'seta.support@domain.co.za',
      icon: Mail,
      description: 'Response within 24–48 hours'
    },
    {
      method: 'Phone',
      value: '+27 11 987 6543',
      icon: Phone,
      description: 'Mon-Fri, 8:00 AM - 5:00 PM SAST'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = () => {
    console.log('Submitting contact form:', contactForm);
    setShowContactForm(false);
    setContactForm({ subject: '', category: 'general', priority: 'medium', message: '' });
    // You can add a toast or modal success message here
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      {!embedded && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}
      
      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical Issue</option>
                    <option value="funding">Funding Issue</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200 resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowContactForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContactSubmit}
                disabled={!contactForm.subject || !contactForm.message}
                className="flex items-center space-x-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Panel */}
      <div className={embedded 
        ? "w-full h-full bg-white" 
        : `fixed top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}>
        
        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Help & Support</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Find answers to SETA-related questions, access documentation, or contact support for assistance.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Quick Actions, Search, Articles, Contact Info remain unchanged but now reflect SETA-specific data */}
            {/* ...keep all other JSX as in your original component... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSupport;
