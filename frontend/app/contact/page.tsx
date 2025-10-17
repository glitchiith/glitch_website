"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/page-header';

// ...existing code...

type ContactFormData = {
    name: string;
    email: string;
    info: string;
    projectDetails: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const ContactPage = () => {
    const [selectedService, setSelectedService] = useState<string>('DESIGN');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        info: '',
        projectDetails: '',
    });
    const [errors, setErrors] = useState<ContactFormErrors>({});

    const validateForm = () => {
        const newErrors: ContactFormErrors = {};

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

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();

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

    // ...existing code...
    return (
        <div className="min-h-screen text-white">
            <PageHeader title={"Contact"} imageUrl="/images/cannon.png" />
            {/* rest of component unchanged */}
        </div>
    );
};

export default ContactPage;