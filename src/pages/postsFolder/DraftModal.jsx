import React from 'react';
import { FaBlog } from 'react-icons/fa';

const DraftModal = ({ isOpen, closeModal, handleDiscard, handleSaveDraft }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-lime-700 hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md text-center mb-4">Save this post as a draft?</p>
                <p className="text-gray-600 mb-4">The post you started will be here when you return.</p>
                <hr className='mb-8' />
                <div className="flex justify-between items-center">
                    <FaBlog className="text-green-500 h-16 w-20 mt-8 mb-8" />
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col">
                    <button onClick={handleDiscard} className="mb-4 p-4 py-3 px-7 w-full leading-6 text-green-50 font-bold text-center bg-gradient-to-r from-green-400 to-blue-600 hover:from-green-500 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 animate-pulse">
                        Discard
                    </button>
                    <button onClick={handleSaveDraft} className="mb-4 p-4 py-3 px-7 w-full leading-6 text-green-50 font-bold text-center bg-gradient-to-r from-green-400 to-blue-600 hover:from-green-500 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105">
                        Save as draft
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DraftModal;
