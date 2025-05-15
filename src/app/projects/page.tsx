/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicCapIcon, GlobeAltIcon, DevicePhoneMobileIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import projectData from '@/data/projects.json';

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

    const categoryList = projectData.categories;
    const categoryToIndex: { [key: string]: number } = { web: 0, mobile: 1, school: 2 };

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

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'school':
                return <AcademicCapIcon className="w-5 h-5 mr-1" />;
            case 'web':
                return <GlobeAltIcon className="w-5 h-5 mr-1" />;
            case 'mobile':
                return <DevicePhoneMobileIcon className="w-5 h-5 mr-1" />;
            default:
                return null;
        }
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
                                <span className="text-4xl text-orange-500 uppercase">
                                    {projectData.projects[activeCategory][activeProject].title}
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

                        {categoryList.map((category, index) => (
                            <React.Fragment key={category}>
                                <motion.button
                                    ref={el => { projectRefs.current[index] = el; }}
                                    className={`px-2 py-3 text-white shadow transition relative z-10 text-left flex items-center gap-2 hover:text-orange-300 whitespace-nowrap rounded-lg ${activeCategory === category ? 'text-orange-500' : 'text-gray-300'}`}
                                    onClick={() => { setActiveCategory(category); setActiveProject(null); }}
                                >
                                    {getCategoryIcon(category)}
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </motion.button>
                                {index < categoryList.length - 1 && (
                                    <div className="h-px bg-white/10 mx-2 my-2" />
                                )}
                            </React.Fragment>
                        ))}
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
                                        {projectData.projects[activeCategory].map((project, index) => (
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
                                                {index < projectData.projects[activeCategory].length - 1 && (
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
                                <h2 className="text-3xl font-bold text-white mb-2">{projectData.projects[activeCategory][activeProject].role}</h2>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <span className="text-orange-400 font-semibold">{projectData.projects[activeCategory][activeProject].title}</span>
                                    <span className="text-gray-400">{projectData.projects[activeCategory][activeProject].date}</span>
                                </div>
                                <p className="text-gray-300 whitespace-pre-wrap font-montserrat text-base">{projectData.projects[activeCategory][activeProject].description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}