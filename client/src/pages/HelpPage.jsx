// src/pages/HelpPage.jsx
import React from 'react';

// A reusable component for displaying each FAQ item in its own card.
const FAQItem = ({ question, answer }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700/50">
    <h2 className="text-xl font-semibold text-white">{question}</h2>
    <p className="mt-2 text-gray-400">{answer}</p>
  </div>
);

const HelpPage = () => {
  // Storing FAQ data in an array for easier management and mapping.
  const faqs = [
    {
      question: "What is a Kanban Board?",
      answer: "A Kanban board is a visual tool to help you manage tasks and workflows. It uses cards, columns, and a central board to track work as it moves from a 'To Do' state to 'Done'."
    },
    {
      question: "How do I create a new Board?",
      answer: "From your main dashboard, find and click the 'Create New Board' button. A modal will appear where you can enter the new board's title and other details."
    },
    {
      question: "What is the purpose of a Column (List)?",
      answer: "Columns represent the various stages of your workflow, such as 'To Do', 'In Progress', and 'Completed'. You can move cards (which represent tasks) between these columns as you make progress."
    },
    {
      question: "How can I invite team members to my Board?",
      answer: "As the board owner, open the board you wish to share and look for an option to invite or add members. This functionality is typically available within the board's settings or menu."
    },
    {
      question: "Can I archive completed cards?",
      answer: "Yes, you can archive cards to clean up your board without permanently deleting them. Archived items can be viewed and restored at any time from the board's archive section."
    }
  ];

  return (
    <div className="w-full flex flex-col flex-grow p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-0">
      <div className="max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Help & Resources
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Frequently Asked Questions about using the platform.
          </p>
        </header>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;