"use client"

import React, { useState, useEffect } from 'react';
import { Search, Book, MessageCircle, Mail, Phone, FileText, Video, Users, ChevronRight, ExternalLink, Send, HelpCircle, X } from 'lucide-react';

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

  // SETA-specific categories
  const helpCategories = [
    { key: 'all', label: 'All Topics', icon: Book },
    { key: 'learnerships', label: 'Learnerships Management', icon: Users },
    { key: 'funding', label: 'Grant & Funding', icon: FileText },
    { key: 'reporting', label: 'Reporting & Compliance', icon: FileText },
    { key: 'assessments', label: 'Assessments & Certification', icon: MessageCircle },
    { key: 'technical', label: 'Technical Issues', icon: FileText }
  ];

  // SETA-focused help articles
  const helpArticles = [
    {
      id: 1,
      title: 'Managing learner applications for SETA programs',
      category: 'learnerships',
      views: 1543,
      helpful: 92,
      lastUpdated: '2025-01-15',
      description: 'Learn how to process learner applications, assign mentors, and track learner progress for SETA programs.'
    },
    {
      id: 2,
      title: 'Submitting and tracking SETA grant applications',
      category: 'funding',
      views: 1024,
      helpful: 85,
      lastUpdated: '2025-01-12',
      description: 'Step-by-step guidance on submitting funding applications and monitoring approval status.'
    },
    {
      id: 3,
      title: 'Generating compliance reports for SETA audits',
      category: 'reporting',
      views: 789,
      helpful: 88,
      lastUpdated: '2025-01-10',
      description: 'Understand how to generate and submit accurate reports for SETA compliance and auditing purposes.'
    },
    {
      id: 4,
      title: 'Scheduling assessments and issuing certificates',
      category: 'assessments',
      views: 632,
      helpful: 90,
      lastUpdated: '2025-01-08',
      description: 'Learn how to schedule learner assessments, record results, and issue SETA certificates.'
    },
    {
      id: 5,
      title: 'Troubleshooting system login and access issues',
      category: 'technical',
      views: 431,
      helpful: 70,
      lastUpdated: '2025-01-05',
      description: 'Common solutions for login problems, password resets, and access issues within the SETA portal.'
    },
    {
      id: 6,
      title: 'Monitoring learner progress and compliance',
      category: 'learnerships',
      views: 872,
      helpful: 87,
      lastUpdated: '2025-01-03',
      description: 'Track learner enrolment, progress, and completion to ensure compliance with SETA requirements.'
    }
  ];

  // Quick actions for SETA users
  const quickActions = [
    {
      title: 'Contact SETA Support',
      description: 'Reach out for help with your SETA system queries',
      icon: MessageCircle,
      action: () => setShowContactForm(true),
      color: 'green'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides on SETA processes',
      icon: Video,
      action: () => console.log('Open video tutorials'),
      color: 'blue'
    },
    {
      title: 'SETA User Guide',
      description: 'Download the complete SETA system manual',
      icon: FileText,
      action: () => console.log('Download user guide'),
      color: 'purple'
    },
  ];

  // Contact info for SETA support
  const contactInfo = [
    {
      method: 'Email',
      value: 'support@seta.org.za',
      icon: Mail,
      description: 'Response within 24 hours'
    },
    {
      method: 'Phone',
      value: '+27 11 555 1234',
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
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {!embedded && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}

      {showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact SETA Support</h3>
            
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
                    <option value="system">System Problem</option>
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
                <h1 className="text-2xl font-bold text-gray-800 mb-3">SETA Help & Support</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Access SETA documentation, guidelines, and support for managing learnerships, grants, reporting, and assessments.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    <p className="text-sm text-gray-600">Get help quickly with these common actions</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-left group"
                      >
                        <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                          <IconComponent className={`w-5 h-5 text-${action.color}-600`} />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Search Help Articles</h2>
                    <p className="text-sm text-gray-600">Find answers to your questions</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {helpCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              selectedCategory === category.key
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{category.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Articles */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Book className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Help Articles</h2>
                    <p className="text-sm text-gray-600">Browse our knowledge base</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{article.views} views</span>
                            <span>{article.helpful}% helpful</span>
                            <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-8">
                    <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-sm text-gray-600">
                      Try adjusting your search terms or selecting a different category.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
                    <p className="text-sm text-gray-600">Get in touch with our support team</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index} className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">{contact.method}</h3>
                        <p className="text-sm font-medium text-green-600 mb-2">{contact.value}</p>
                        <p className="text-xs text-gray-500">{contact.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSupport;