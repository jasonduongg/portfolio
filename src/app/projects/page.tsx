'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicCapIcon, GlobeAltIcon, DevicePhoneMobileIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeProject, setActiveProject] = useState<number | null>(null);
    const [cursorStyle, setCursorStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
    const [projectCursorStyle, setProjectCursorStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
    const projectRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const projectItemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();

    const categoryList = ['school', 'web', 'mobile'];
    const categoryToIndex: { [key: string]: number } = { school: 0, web: 1, mobile: 2 };

    useEffect(() => {
        const duration = 1000; // 1 second
        const interval = 10; // Update every 10ms
        const steps = duration / interval;
        const increment = 100 / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setPercentage(Math.min(Math.round(currentStep * increment), 100));

            if (currentStep >= steps) {
                clearInterval(timer);
                setIsLoading(false);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeCategory !== null && projectRefs.current[categoryToIndex[activeCategory]]) {
            const el = projectRefs.current[categoryToIndex[activeCategory]];
            if (el) {
                setCursorStyle({
                    top: el.offsetTop,
                    height: el.offsetHeight,
                });
            }
        }
    }, [activeCategory]);

    useEffect(() => {
        if (activeProject !== null && projectItemRefs.current[activeProject]) {
            const el = projectItemRefs.current[activeProject];
            if (el) {
                setProjectCursorStyle({
                    top: el.offsetTop,
                    height: el.offsetHeight,
                });
            }
        }
    }, [activeProject]);

    if (isLoading) {
        return (
            <main className="p-8 min-h-screen bg-black flex items-center justify-center">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-8 border-gray-200 rounded-full animate-spin border-t-white"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                        {percentage}%
                    </div>
                </div>
            </main>
        );
    }

    const placeholderItems = {
        school: [
            {
                title: "Computer Science Project 1",
                role: "Student",
                date: "2023",
                subtitle: "Deep learning coursework project",
                description: "A deep learning project..."
            },
            {
                title: "Data Structures Project",
                role: "Student",
                date: "2023",
                subtitle: "Advanced data structures implementation",
                description: "Implementation of advanced data structures..."
            },
            {
                title: "Web Development Course",
                role: "Student",
                date: "2023",
                subtitle: "Full-stack web development coursework",
                description: "Full-stack development project..."
            },
        ],
        web: [
            {
                title: "Curiocity",
                role: "Lead Fullstack Software Engineer",
                date: "Aug 2024 – Dec 2024",
                subtitle: "Collaborative document editing app for financial analysts",
                description: `
∗ Spearheaded a team of 13 developers to design, develop, and launch a feature-rich document editing app for 25 financial analysts.
∗ Implemented key features such as resource normalization and parsing, file organization, and advanced search capabilities, enabling seamless document management and retrieval streamlining workflows and reducing document processing time by 50%.
∗ Adapted to client requests by incorporating new insights and research, ensuring the product met evolving needs for users.`
            },
            {
                title: "BlackPrint",
                role: "Frontend Software Engineer",
                date: "Jan 2024 – May 2024",
                subtitle: "3D geospatial visualization app for real estate analysis",
                description: `
∗ Engineered a geospatial visualization app using map software to enable 3D semantic segmentation of 1,000+ buildings across various cities, containing property information for real estate agents, enhancing property analysis and decision-making.
∗ Developed codebase for frontend UI by implementing various components, enhancing maintainability for future scalable updates.
∗ Improved response time by 30% and increased user traffic by 20% using NextJS routing, NodeJS, and TypeScript.`
            },
            {
                title: "Payload CMS",
                role: "Fullstack Software Engineer",
                date: "Aug 2023 – Dec 2023",
                subtitle: "Open-source content management system with MongoDB integration",
                description: `
∗ Created a content management system to retrieve files from MongoDB within 100ms, enhancing user experience significantly.
∗ Led frontend development with TypeScript, ReactJS, and reworked API calls by optimizing query efficiency, restructuring endpoints, and reducing redundant data fetching, resulting in 40% faster file retrieval time and improved system performance.
∗ Contributed to an open-source CMS project with 200+ contributors and 8.1k+ users, and successfully implemented key updates.`
            },
            {
                title: "Spoak",
                role: "Frontend Software Engineer",
                date: "Jan 2023 – May 2023",
                subtitle: "AI-powered interior design visualization app",
                description: `
∗ Developed an application showcasing theoretical rooms with furniture generated by AI, including an object removal feature.
∗ Accelerated client's product development by 25%, introducing an image processing feature and enhancing user engagement.
∗ Leveraged Tailwind framework to design a responsive frontend for a database-driven application, ensuring scalability and enhanced user interface functionality.`
            },
            {
                title: "UC Berkeley Space Technologies and Rocketry",
                role: "Web Engineer",
                date: "Aug 2022 – Jan 2023",
                subtitle: "Website overhaul and marketing for student rocketry club",
                description: `
∗ Overhauled the organization's website, refactoring 5,000+ lines of legacy code and creating comprehensive documentation.
∗ Implemented advanced UI/UX elements using HTML, CSS, and JavaScript, significantly improving user navigation.
∗ Orchestrated a marketing campaign raising $10,000, increasing club population by 25% through community engagement.`
            },
            {
                title: "Nanotechnology Unleashed (Jadoo Technologies Inc.)",
                role: "Fullstack Software Engineer",
                date: "Jan 2022 – Dec 2022",
                subtitle: "Data visualization tools for nanotechnology research",
                description: `
∗ Constructed data visualization tools for nanotechnology metrics, adopted by research teams to reduce analysis time by 30%.
∗ Transformed complex data visualizations into intuitive interfaces utilizing React, streamlining navigation efficiency.
∗ Built intuitive simulation systems using advanced algorithms, reducing error resolution times from three days to one day.`
            },
        ],
        mobile: [
            {
                title: "Vera",
                role: "Fullstack Software Engineer Intern",
                date: "Oct 2024 – March 2025",
                subtitle: "Mobile app for international cosmetic tourism",
                description: `
∗ Developed a high-impact platform connecting over 1,000 Korean beauty institutions with global users, integrating real-time chatrooms to facilitate seamless communication and foster a strong, engaged community.
∗ Conducted beta testing with 150 users, gathering feedback to implement improvements to enhance app functionality.
∗ Optimized the platform's user interface, improving overall user engagement by 40% through iterative design improvements.`
            },
        ],
    };

    return (
        <main className="p-8 min-h-screen bg-black relative">
            {/* Logout Button */}
            <button
                className="absolute top-6 right-8 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-orange-500/80 text-white transition shadow"
                onClick={() => router.push('/')}
                title="Logout"
            >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>

            {/* Header with breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl text-white uppercase">PROJECTS</span>
                {activeCategory && (
                    <>
                        <span className="text-4xl text-gray-600">&gt;</span>
                        <span className="text-4xl text-white uppercase">{activeCategory}</span>
                        {activeProject !== null && (
                            <>
                                <span className="text-4xl text-gray-600">&gt;</span>
                                <span className="text-4xl text-white uppercase">
                                    {placeholderItems[activeCategory as keyof typeof placeholderItems][activeProject].title}
                                </span>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="flex gap-8">
                <div className="relative flex flex-col gap-4 shrink-0 items-start">
                    <div className="bg-gray-50/10 w-48 p-4 rounded-lg">
                        {/* Sliding background */}
                        {activeCategory && cursorStyle.height > 0 && (
                            <motion.div
                                className="absolute bg-orange-500/20 rounded-lg"
                                initial={false}
                                animate={{
                                    top: cursorStyle.top,
                                    height: cursorStyle.height,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ width: 'calc(100% - 16px)', left: '8px' }}
                            />
                        )}

                        <motion.button
                            ref={el => { projectRefs.current[0] = el; }}
                            className={`px-2 py-3 text-white shadow transition relative z-10 text-left flex items-center gap-2 hover:text-orange-300 whitespace-nowrap rounded-lg ${activeCategory === 'school' ? 'text-orange-500' : 'text-gray-300'}`}
                            onClick={() => { setActiveCategory('school'); setActiveProject(null); }}
                        >
                            <AcademicCapIcon className="w-5 h-5 mr-1" />
                            School
                        </motion.button>
                        <motion.button
                            ref={el => { projectRefs.current[1] = el; }}
                            className={`px-2 py-3 text-white shadow transition relative z-10 text-left flex items-center gap-2 hover:text-orange-300 whitespace-nowrap rounded-lg ${activeCategory === 'web' ? 'text-orange-500' : 'text-gray-300'}`}
                            onClick={() => { setActiveCategory('web'); setActiveProject(null); }}
                        >
                            <GlobeAltIcon className="w-5 h-5 mr-1" />
                            Web
                        </motion.button>
                        <motion.button
                            ref={el => { projectRefs.current[2] = el; }}
                            className={`px-2 py-3 text-white shadow transition relative z-10 text-left flex items-center gap-2 hover:text-orange-300 whitespace-nowrap rounded-lg ${activeCategory === 'mobile' ? 'text-orange-500' : 'text-gray-300'}`}
                            onClick={() => { setActiveCategory('mobile'); setActiveProject(null); }}
                        >
                            <DevicePhoneMobileIcon className="w-5 h-5 mr-1" />
                            Mobile
                        </motion.button>
                    </div>
                </div>

                {/* Projects Grid */}
                {activeCategory && (
                    <motion.div
                        className="shrink-0 w-84"
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                    >
                        <div className="bg-gray-50/10 p-4 rounded-lg relative">
                            {/* Sliding background for projects */}
                            {activeProject !== null && projectCursorStyle.height > 0 && (
                                <motion.div
                                    className="absolute bg-orange-500/20 rounded-lg"
                                    initial={false}
                                    animate={{
                                        top: projectCursorStyle.top,
                                        height: projectCursorStyle.height,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    style={{ width: 'calc(100% - 16px)', left: '8px' }}
                                />
                            )}
                            <AnimatePresence mode="wait">
                                {activeCategory && (
                                    <motion.div
                                        key={activeCategory}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        transition={{ staggerChildren: 0.08 }}
                                        className="flex flex-col gap-4"
                                        variants={{}}
                                    >
                                        {placeholderItems[activeCategory as keyof typeof placeholderItems].map((project, index) => (
                                            <React.Fragment key={index}>
                                                <motion.div
                                                    ref={el => { projectItemRefs.current[index] = el; }}
                                                    className="px-4 py-3 rounded-lg cursor-pointer relative z-10"
                                                    whileHover={{ scale: 1.01, x: 8 }}
                                                    onClick={() => setActiveProject(index)}
                                                    initial={{ x: -32, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: -32, opacity: 0 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                >
                                                    <h3 className={`text-lg font-semibold mb-1 transition-colors ${activeProject === index ? 'text-orange-500' : 'text-white'}`}>{project.title}</h3>
                                                    <div className="text-gray-400 text-sm italic">{project.subtitle}</div>
                                                </motion.div>
                                                {index < placeholderItems[activeCategory as keyof typeof placeholderItems].length - 1 && (
                                                    <div className="h-px bg-white/10 mx-4" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Project Details Column */}
                {activeCategory && activeProject !== null && (
                    <div className="flex-1 min-w-0">
                        <div className="bg-gray-900/80 p-8 rounded-lg h-full flex items-start">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{placeholderItems[activeCategory as keyof typeof placeholderItems][activeProject].role}</h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-orange-400 font-semibold">{placeholderItems[activeCategory as keyof typeof placeholderItems][activeProject].title}</span>
                                    <span className="text-gray-400">{placeholderItems[activeCategory as keyof typeof placeholderItems][activeProject].date}</span>
                                </div>
                                <p className="text-gray-300 whitespace-pre-wrap font-sans text-base">{placeholderItems[activeCategory as keyof typeof placeholderItems][activeProject].description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}