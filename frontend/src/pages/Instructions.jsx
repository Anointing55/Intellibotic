// frontend/src/pages/Instructions.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX, FiCheck, FiMessageSquare, FiGitBranch, FiCode, FiBox, FiSettings, FiPlus, FiPlay } from 'react-icons/fi';

const message = "Put your message here";  // or whatever is appropriate for your code
const Instructions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const steps = [
    {
      title: "Welcome to Intellibotic!",
      description: "Build advanced chatbots with our visual builder. This quick tour will show you how to create your first bot.",
      icon: <FiMessageSquare className="text-primary" />,
      image: null,
      tips: [
        "Drag and drop nodes to create conversation flows",
        "Connect nodes to define your bot's logic",
        "Test your bot in real-time"
      ]
    },
    {
      title: "Create Your First Bot",
      description: "Start by creating a new bot from your dashboard. Give it a name and description to get started.",
      icon: <FiPlus className="text-secondary" />,
      image: null,
      action: {
        text: "Try it now:",
        element: (
          <div className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg mt-3">
            <div className="bg-gray-700 p-2 rounded mr-3">
              <FiPlus />
            </div>
            <span>Create New Bot</span>
          </div>
        )
      }
    },
    {
      title: "Building Your Bot",
      description: "Use the visual editor to build your bot's conversation flow. Drag nodes from the sidebar and connect them to create your logic.",
      icon: <FiGitBranch className="text-accent" />,
      image: null,
      tips: [
        "Message nodes send text to users",
        "Condition nodes create conversation branches",
        "Code nodes allow custom JavaScript"
      ],
      visual: (
        <div className="relative mt-6">
          <div className="absolute top-4 left-16 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            Drag from here
          </div>
          <div className="absolute top-24 left-48 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            Drop here
          </div>
          
          <div className="flex items-start">
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-primary cursor-move z-10"
            >
              <div className="flex items-center">
                <FiMessageSquare className="mr-2 text-primary" />
                <div className="text-xs font-bold text-primary">Message</div>
              </div>
            </motion.div>
            
            <div className="mx-4 mt-4">
              <div className="w-8 h-1 bg-gray-300"></div>
            </div>
            
            <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
              <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Testing Your Bot",
      description: "Test your bot in real-time as you build. The chat interface lets you interact with your bot immediately.",
      icon: <FiPlay className="text-green-500" />,
      image: null,
      visual: (
        <div className="relative mt-6 bg-gray-800 rounded-xl p-4">
          <div className="flex mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white mr-3">
              <FiMessageSquare size={16} />
            </div>
            <div>
              <div className="font-medium">Your Bot</div>
              <div className="text-xs text-gray-400">Testing Mode</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                Hello! How can I help you today?
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="bg-gray-700 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[80%]">
                What can you do?
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                I can answer questions, provide information, and help with tasks!
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Customization & Settings",
      description: "Personalize your bot with custom settings. Change the name, description, theme color, and more.",
      icon: <FiSettings className="text-purple-500" />,
      image: null,
      visual: (
        <div className="grid grid-cols-3 gap-2 mt-6">
          {['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#f43f5e'].map((color) => (
            <div 
              key={color}
              className="w-10 h-10 rounded-lg cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )
    },
    {
      title: "Advanced Features",
      description: "Extend your bot with advanced features. Add custom JavaScript logic or create your own node types.",
      icon: <FiCode className="text-yellow-500" />,
      image: null,
      visual: (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400">
          <div>function handleMessage(message) {'{'}</div>
          <div className="ml-4">return `You said: ${message}`;</div>
          <div>{'}'}</div>
        </div>
      )
    },
    {
      title: "You're Ready to Go!",
      description: "You've completed the onboarding. Start building your intelligent chatbot now!",
      icon: <FiCheck className="text-green-500" />,
      image: null,
      action: {
        text: "What to do next:",
        element: (
          <div className="mt-4 space-y-3">
            <div className="flex items-center bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg">
              <div className="bg-primary/20 text-primary p-2 rounded-lg mr-3">
                <FiPlus />
              </div>
              <span>Create your first bot</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-secondary/10 to-secondary/5 p-3 rounded-lg">
              <div className="bg-secondary/20 text-secondary p-2 rounded-lg mr-3">
                <FiCode />
              </div>
              <span>Explore developer mode</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg">
              <div className="bg-accent/20 text-accent p-2 rounded-lg mr-3">
                <FiSettings />
              </div>
              <span>Customize your bot</span>
            </div>
          </div>
        )
      }
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restartTour = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-2xl"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
              <motion.div
                initial={{ rotate: -30, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
              >
                <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-3xl" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Onboarding Complete!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 max-w-md mx-auto"
              >
                You're now ready to build advanced chatbots with Intellibotic.
              </motion.p>
            </div>
            
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">What to do next:</h3>
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4">
                      <FiPlus className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Create your first bot</h4>
                      <p className="text-gray-600">Start building from scratch</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="bg-secondary/10 text-secondary p-3 rounded-lg mr-4">
                      <FiCode className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Explore templates</h4>
                      <p className="text-gray-600">Use pre-built templates to get started quickly</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="bg-accent/10 text-accent p-3 rounded-lg mr-4">
                      <FiSettings className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Customize your workspace</h4>
                      <p className="text-gray-600">Adjust settings to your preferences</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartTour}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium flex items-center"
                >
                  <FiPlay className="mr-2 transform rotate-180" />
                  Restart Tour
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-2xl"
          >
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gray-100 p-3 rounded-xl">
                  {steps[currentStep].icon}
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-800 mb-3"
              >
                {steps[currentStep].title}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                {steps[currentStep].description}
              </motion.p>
              
              {steps[currentStep].tips && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6"
                >
                  <h3 className="font-bold text-blue-800 mb-2">Quick Tips:</h3>
                  <ul className="space-y-2">
                    {steps[currentStep].tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-3 mt-1">
                          <FiCheck size={12} />
                        </div>
                        <span className="text-blue-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {steps[currentStep].action && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6"
                >
                  <h3 className="font-bold text-gray-800 mb-2">{steps[currentStep].action.text}</h3>
                  {steps[currentStep].action.element}
                </motion.div>
              )}
              
              {steps[currentStep].visual && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  {steps[currentStep].visual}
                </motion.div>
              )}
              
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center px-5 py-2 rounded-lg ${
                    currentStep === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiChevronLeft className="mr-2" />
                  Previous
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="flex items-center px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg"
                >
                  {currentStep === steps.length - 1 ? "Finish Tour" : "Next Step"}
                  <FiChevronRight className="ml-2" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Skip Button */}
      {!completed && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCompleted(true)}
          className="fixed top-6 right-6 bg-white shadow-lg px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800"
        >
          Skip Tour
        </motion.button>
      )}
    </div>
  );
};

export default Instructions;
