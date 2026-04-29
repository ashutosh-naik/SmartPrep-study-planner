import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full mx-auto animate-scale-in border border-[#E6E6E6] overflow-hidden`}>
                <div className="flex items-center justify-between p-6 border-b border-[#E6E6E6]">
                    <h3 className="text-[16px] font-bold text-[#111111] uppercase tracking-widest">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-[#F1F1F1] rounded-lg transition-all">
                        <X size={20} className="#6B6B6B" />
                    </button>
                </div>
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
