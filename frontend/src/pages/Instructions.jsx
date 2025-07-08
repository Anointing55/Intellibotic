// frontend/src/pages/Instructions.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, FiPlay, FiGrid, FiMessageSquare, FiCode, 
  FiSettings, FiUser, FiArrowRight, FiArrowLeft, 
  FiCheck, FiZap, FiDownload, FiShare2
} from 'react-icons/fi';

const Instructions = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [currentStep, setCurrentStep] = useState(0);
  
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <FiZap />,
      steps: [
        {
          title: 'Create Your Account',
          content: 'Sign up for Intellibotic using your email or Google account. Once verified, you can access the dashboard.',
          visual: (
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl p-6 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                  <FiUser className="text-indigo-600" />
                </div>
                <div className="text-sm font-medium bg-indigo-600 text-white px-3 py-1 rounded-full">
                  Sign Up
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-white rounded-full w-full"></div>
                <div className="h-3 bg-white rounded-full w-3/4"></div>
                <div className="h-3 bg-white rounded-full w-1/2"></div>
                <div className="h-10 bg-indigo-600 rounded-lg mt-4 flex items-center justify-center text-white">
                  <FiArrowRight className="mr-2" /> Create Account
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Explore the Dashboard',
          content: 'The dashboard is your control center. From here you can create new bots, access existing ones, or import templates.',
          visual: (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 max-w-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">My Chatbots</h3>
                <div className="bg-indigo-600 text-white px-2 py-1 rounded text-sm flex items-center">
                  <FiPlus className="mr-1" /> New Bot
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between">
                      <div className="bg-indigo-100 w-8 h-8 rounded flex items-center justify-center">
                        <FiMessageSquare className="text-indigo-600" />
                      </div>
                      <div className="text-xs text-gray-500">Just now</div>
                    </div>
                    <div className="mt-2 text-sm font-medium">Bot {i}</div>
                    <div className="text-xs text-gray-500 truncate">Description of bot functionality</div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'building-bots',
      title: 'Building Bots',
      icon: <FiGrid />,
      steps: [
        {
          title: 'Using the Visual Builder',
          content: 'Drag and drop nodes to create conversation flows. Connect them to define how users will interact with your bot.',
          visual: (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 max-w-md relative">
              <div className="absolute top-4 left-4 w-32 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                Start
              </div>
              <div className="absolute top-20 left-20 w-32 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                Question
              </div>
              <div className="absolute top-20 right-20 w-32 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                Message
              </div>
              <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-32 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                End
              </div>
              
              {/* Connections */}
              <svg className="absolute inset-0" width="100%" height="100%">
                <line x1="80" y1="30" x2="120" y2="70" stroke="#6366f1" strokeWidth="2" />
                <line x1="120" y1="70" x2="180" y2="70" stroke="#6366f1" strokeWidth="2" />
                <line x1="120" y1="70" x2="120" y2="110" stroke="#6366f1" strokeWidth="2" />
                <line x1="180" y1="70" x2="200" y2="110" stroke="#6366f1" strokeWidth="2" />
                <line x1="120" y1="110" x2="200" y2="110" stroke="#6366f1" strokeWidth="2" />
              </svg>
            </div>
          )
        },
        {
          title: 'Adding Custom Logic',
          content: 'Use our AI nodes, conditional logic, and API integrations to create advanced conversation flows.',
          visual: (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 max-w-md">
              <div className="flex space-x-3 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="bg-indigo-100 w-8 h-8 rounded flex items-center justify-center mr-2">
                    <FiUser />
                  </div>
                  <span>User Input</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="bg-purple-100 w-8 h-8 rounded flex items-center justify-center mr-2">
                    <FiCode />
                  </div>
                  <span>Condition</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="bg-blue-100 w-8 h-8 rounded flex items-center justify-center mr-2">
                    <FiMessageSquare />
                  </div>
                  <span>Response</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Condition Logic</div>
                <pre className="bg-gray-800 text-gray-100 text-xs p-3 rounded overflow-x-auto">
{`if (userInput.includes("pricing")) {
  return "pricing_flow";
} else if (userInput.includes("support")) {
  return "support_flow";
} else {
  return "default_flow";
}`}</pre>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Deployment',
      icon: <FiPlay />,
      steps: [
        {
          title: 'Interactive Testing',
          content: 'Use the built-in chat simulator to test your bot in real-time. See how it responds to different user inputs.',
          visual: (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 max-w-md">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-800 text-white p-3 flex items-center">
                  <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    IB
                  </div>
                  <div>
                    <div className="font-medium">Customer Support Bot</div>
                    <div className="text-xs opacity-80">Online</div>
                  </div>
                </div>
                
                <div className="p-4 h-40 overflow-y-auto">
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-200 rounded-2xl px-4 py-2 max-w-xs">
                      <div className="text-sm">Hello! How can I help you today?</div>
                      <div className="text-xs text-gray-500 text-right mt-1">10:30 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mb-4">
                    <div className="bg-indigo-600 text-white rounded-2xl px-4 py-2 max-w-xs">
                      <div className="text-sm">Do you have pricing information?</div>
                      <div className="text-xs text-indigo-200 text-right mt-1">10:31 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Deploy Your Bot',
          content: 'Once tested, deploy your bot to your website, mobile app, or messaging platforms with just a few clicks.',
          visual: (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 max-w-md">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Website', 'Mobile App', 'WhatsApp', 'Slack', 'API', 'Export'].map((platform, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <FiShare2 className="text-indigo-600" />
                    </div>
                    <span className="text-sm">{platform}</span>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-600 text-white rounded-lg py-2 px-4 text-center">
                <FiDownload className="inline mr-2" /> Deploy Now
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];
  const currentStepData = currentSection.steps[currentStep];

  const nextStep = () => {
    if (currentStep < currentSection.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to next section
      const currentIndex = sections.findIndex(s => s.id === activeSection);
      if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
        setCurrentStep(0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Move to previous section
      const currentIndex = sections.findIndex(s => s.id === activeSection);
      if (currentIndex > 0) {
        setActiveSection(sections[currentIndex - 1].id);
        const prevSection = sections[currentIndex - 1];
        setCurrentStep(prevSection.steps.length - 1);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50"
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Intellibotic</h1>
              <h2 className="ml-8 text-xl text-gray-700 hidden md:block">Knowledge Base & Tutorials</h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                onClick={() => window.location.href = '/dashboard'}
              >
                Back to Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                <FiBookOpen className="mr-3 text-indigo-600" /> Guides
              </h2>
              
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ x: 5 }}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-xl ${
                      activeSection === section.id 
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveSection(section.id);
                      setCurrentStep(0);
                    }}
                  >
                    <div className="mr-3 text-indigo-600">
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </motion.button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resources</h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <FiDownload className="mr-3" /> Template Library
                  </a>
                  <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <FiCode className="mr-3" /> API Documentation
                  </a>
                  <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <FiSettings className="mr-3" /> Advanced Configuration
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{currentSection.title}</h2>
                    <p className="opacity-80">Step-by-step guide to mastering Intellibotic</p>
                  </div>
                  <div className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    Step {currentStep + 1} of {currentSection.steps.length}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-6"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {currentStep + 1}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{currentStepData.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-6">{currentStepData.content}</p>
                      
                      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg mb-6">
                        <div className="font-medium text-indigo-800 mb-2">Pro Tip</div>
                        <p className="text-indigo-700">Use keyboard shortcuts to work faster. Press 'S' to save, 'T' to test, and 'D' to deploy your bot.</p>
                      </div>
                    </motion.div>
                    
                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          currentStep === 0 && activeSection === 'getting-started' 
                            ? 'bg-gray-200 text-gray-500' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={prevStep}
                        disabled={currentStep === 0 && activeSection === 'getting-started'}
                      >
                        <FiArrowLeft className="mr-2" /> Previous
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={nextStep}
                      >
                        {currentStep === currentSection.steps.length - 1 
                          ? activeSection === 'testing' 
                            ? 'Finish Tutorial' 
                            : 'Next Section' 
                          : 'Next Step'}
                        <FiArrowRight className="ml-2" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <motion.div
                      key={`visual-${currentStep}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center"
                    >
                      {currentStepData.visual}
                    </motion.div>
                  </div>
                </div>
                
                {/* Progress Indicators */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Learning Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map((section) => (
                      <div 
                        key={section.id}
                        className={`border rounded-xl p-4 ${
                          activeSection === section.id 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`mr-2 ${
                            activeSection === section.id ? 'text-indigo-600' : 'text-gray-500'
                          }`}>
                            {section.icon}
                          </div>
                          <h4 className="font-medium">{section.title}</h4>
                        </div>
                        
                        <div className="space-y-2">
                          {section.steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                (activeSection === section.id && currentStep >= index) ||
                                sections.findIndex(s => s.id === activeSection) > 
                                sections.findIndex(s => s.id === section.id)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-200'
                              }`}>
                                {(activeSection === section.id && currentStep >= index) ||
                                sections.findIndex(s => s.id === activeSection) > 
                                sections.findIndex(s => s.id === section.id) ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </div>
                              <span className={`text-sm ${
                                (activeSection === section.id && currentStep >= index) ||
                                sections.findIndex(s => s.id === activeSection) > 
                                sections.findIndex(s => s.id === section.id)
                                  ? 'text-gray-700'
                                  : 'text-gray-500'
                              }`}>
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FiPlay className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">Watch step-by-step video guides covering all Intellibotic features.</p>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Browse Videos →
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FiCode className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">API Examples</h3>
                <p className="text-gray-600 mb-4">Explore code samples and integration guides for advanced implementations.</p>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Examples →
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FiGrid className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Template Library</h3>
                <p className="text-gray-600 mb-4">Jumpstart your projects with our collection of pre-built bot templates.</p>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Explore Templates →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IB</span>
                </div>
                <h3 className="ml-2 text-xl font-bold">Intellibotic</h3>
              </div>
              <p className="text-gray-600 text-sm mt-2">Professional Chatbot Builder Platform</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Features</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Pricing</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Templates</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">API</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Documentation</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Tutorials</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Blog</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">About</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Contact</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Legal</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 Intellibotic. All rights reserved. Crafted with AI and ❤️ for chatbot enthusiasts.
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Instructions;
