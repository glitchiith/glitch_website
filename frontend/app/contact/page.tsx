"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import PageHeader  from '@/components/page-header';




const ContactPage = () => {
    const [selectedService, setSelectedService] = useState('DESIGN');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        info: '',
        projectDetails: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.info || formData.info.length < 10) {
            newErrors.info = "Please provide more details about your project";
        }

        if (!formData.projectDetails || formData.projectDetails.length < 20) {
            newErrors.projectDetails = "Please provide detailed project information";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setIsSubmitting(false);

            // Reset form after showing success message
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: '',
                    email: '',
                    info: '',
                    projectDetails: '',
                });
                setErrors({});
            }, 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen text-white">

              <PageHeader title={"Contact"} imageUrl="/images/cannon.png" />
        



            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3803.169003794013!2d78.12045981051538!3d17.594707796730447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbefdc136bffbb%3A0x73414ff6594c9191!2sIndian%20Institute%20of%20Technology%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1752386292561!5m2!1sen!2sin"
                width="100%" height="600" loading="lazy" referrerPolicy="no-referrer-when-downgrade">



            </iframe>




            {/* Contact Info Bar */}
            <div className=" py-6">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-400 text-sm">PHONE NUMBER</p>
                                <p className="text-white font-semibold">+(123) 456 789 00</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-400 text-sm">EMAIL ADDRESS</p>
                                <p className="text-white font-semibold">glitch@iith.ac.in</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-400 text-sm">Hyderabad, India</p>
                                <p className="text-white font-semibold">Glitch Room, IIT Hyderabad</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Form */}
                    <div className='px-18'>
                        <div className="mb-8 ">
                            <p className="text-green-400 text-sm font-semibold mb-2 ">LET'S TALK</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 " >
                                Let's Have A Chat With Us
                            </h1>

                            <h2 className="text-2xl font-bold text-white mb-8 py-4">
                                WHAT CAN WE DO FOR YOU?
                            </h2>

                            {/* Service Selection */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['DESIGN', 'DEVELOPMENT', 'ANIMATION', 'OTHER'].map((service) => (
                                    <button
                                        key={service}
                                        onClick={() => setSelectedService(service)}
                                        className={`px-6 py-3 rounded-sm font-semibold transition-all ${selectedService === service
                                                ? 'bg-green-500 text-black'
                                                : 'bg-transparent border border-gray-600 text-white hover:border-green-500'
                                            }`}
                                    >
                                        {service}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="relative">
                                        <Input
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="bg-transparent border-b-2 border-gray-600 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-green-500 focus:ring-0"
                                        />
                                        <div className="absolute right-0 top-4">
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Input
                                            placeholder="Info"
                                            value={formData.info}
                                            onChange={(e) => handleInputChange('info', e.target.value)}
                                            className="bg-transparent border-b-2 border-gray-600 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-green-500 focus:ring-0"
                                        />
                                        <div className="absolute right-0 top-4">
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.info && <p className="text-red-400 text-sm mt-1">{errors.info}</p>}
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Project details"
                                        value={formData.projectDetails}
                                        onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                                        className="bg-transparent border-b-2 border-gray-600 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-green-500 focus:ring-0 min-h-[120px] resize-none"
                                    />
                                    <div className="absolute right-0 top-4">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.projectDetails && <p className="text-red-400 text-sm mt-1">{errors.projectDetails}</p>}
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`px-8 py-4 font-semibold transition-all duration-300 ${isSubmitting || isSubmitted
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-green-500 text-black hover:bg-green-400'
                                        }`}
                                >
                                    {isSubmitting ? 'SENDING...' : isSubmitted ? 'SENT!' : 'WORKING WITH US'}
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="mt-6 p-4 bg-green-500 text-black rounded-sm">
                                <p className="font-semibold">Thank you for your message. It has been sent.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - 3D Character and Description */}
                    <div className="flex flex-col items-center justify-center text-center">

                        <img src="/images/service-page-contact.png" alt="3D Character" className="w-64 h-64 mb-6" />

                        {/* Description */}
                        <div className="max-w-md">
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Driven by innovation and creativity, we're constantly evolving and expanding our platform
                                to bring you the latest and greatest in gaming. From exciting new releases to classic favorites.
                            </p>



                            {/* Social Media Icons */}
                            <div className="flex justify-center space-x-4 mt-8">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </div>

                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                                    </svg>
                                </div>

                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;