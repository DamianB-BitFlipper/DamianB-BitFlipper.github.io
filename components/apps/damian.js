import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import aboutSections from '../../content/about.json';
import projectsData from '../../content/projects.json';

const SORT_OPTIONS = {
    pinned: 'pinned',
    updated: 'updated',
    stars: 'stars',
    alpha: 'full_name'
};

export class AboutDamian extends Component {
    constructor() {
        super();
        this.state = {
            activeSectionIndex: 0,
        }
    }

    changeSection = (index) => {
        this.setState({ activeSectionIndex: index });
    }

    nextSection = () => {
        if (this.state.activeSectionIndex < aboutSections.length - 1) {
            this.setState({ activeSectionIndex: this.state.activeSectionIndex + 1 });
        }
    }

    prevSection = () => {
        if (this.state.activeSectionIndex > 0) {
            this.setState({ activeSectionIndex: this.state.activeSectionIndex - 1 });
        }
    }

    getIcon = (title) => {
        const map = {
            "About Me": "./themes/system_icons/about.svg",
            "Education": "./themes/system_icons/education.svg",
            "Experience": "./themes/system_icons/experience.svg",
            "Projects": "./themes/system_icons/projects.svg",
            "Resume": "./themes/system_icons/download.svg"
        };
        return map[title] || "./themes/system_icons/about.svg";
    }

    renderNavLinks = () => {
        return (
            <div className="flex flex-col w-full pt-2">
                {aboutSections.map((section, index) => (
                    <div 
                        key={section.id} 
                        onClick={() => this.changeSection(index)}
                        className={(this.state.activeSectionIndex === index ? " bg-ub-orange text-white font-bold" : " text-gray-400 hover:text-gray-200 ") + " cursor-pointer px-4 py-2 flex items-center transition-colors duration-200"}
                    >
                        <img className={"w-4 h-4 mr-2 " + (this.state.activeSectionIndex === index ? "" : "opacity-50")} alt={section.title} src={this.getIcon(section.title)} />
                        <span className="text-sm">{section.title}</span>
                    </div>
                ))}
            </div>
        );
    }

    renderContent = () => {
        const section = aboutSections[this.state.activeSectionIndex];
        if (!section) return null;

        let content;
        if (section.layout === 'projects') {
            content = (
                <ProjectsSection
                    projectsData={projectsData}
                />
            );
        } else if (section.layout === 'resume') {
            content = <ResumeSection source={section.source} />;
        } else if (section.layout === 'contact') {
            content = <ContactSection data={section} />;
        } else if (section.schools) {
            content = <EducationSection data={section} />;
        } else if (section.jobs) {
            content = <ExperienceSection data={section} />;
        } else {
            content = <AboutSection data={section} />;
        }

        return (
            <div
                id="about-content-scroll"
                className="w-full h-full overflow-y-auto bg-gray-100 text-gray-800 windowMainScreen"
            >
                {content}
            </div>
        );
    }


    renderFooter = () => {
        const isLast = this.state.activeSectionIndex === aboutSections.length - 1;
        const isFirst = this.state.activeSectionIndex === 0;

        return (
            <div className="bg-[#2c001e] border-t border-gray-700 px-4 py-3 sm:h-16 shrink-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="hidden sm:flex items-center text-sm text-gray-300 sm:w-1/4">
                        {/* left spacer */}
                    </div>

                    <div className="flex justify-center w-full sm:w-1/2 order-1 sm:order-none space-x-2">
                        {aboutSections.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${this.state.activeSectionIndex === idx ? 'bg-white' : 'bg-gray-600'}`}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center sm:justify-end w-full sm:w-1/4 order-2 sm:order-none space-x-3">
                        <button
                            onClick={this.prevSection}
                            disabled={isFirst}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${isFirst ? 'text-gray-500 cursor-not-allowed border border-gray-700' : 'text-white border border-gray-500 hover:border-gray-300 hover:bg-white hover:bg-opacity-5'}`}
                        >
                            Back
                        </button>
                        <button
                            onClick={this.nextSection}
                            disabled={isLast}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${isLast ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-ub-orange text-white hover:bg-opacity-90'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const currentSection = aboutSections[this.state.activeSectionIndex];

        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none relative font-ubuntu overflow-hidden">
                {/* Window Header inside content */}
                <div className="h-12 bg-[#2c001e] flex items-center px-4 border-b border-gray-800 shrink-0">
                    <span className="font-bold text-lg tracking-wide">
                         {currentSection ? `${currentSection.title}` : "Welcome"}
                    </span>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar */}
                    <div className="hidden md:flex flex-col bg-[#380c2a] border-r border-gray-900 overflow-y-auto" style={{ width: '170px', minWidth: '170px' }}>
                        {this.renderNavLinks()}
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col flex-1 bg-white relative overflow-hidden">
                        {this.renderContent()}
                    </div>
                </div>

                {/* Footer */}
                {this.renderFooter()}
            </div>
        );
    }
}

export default AboutDamian;

export const displayAboutDamian = (openApp) => {
    return <AboutDamian />;
}

// Sub-components

const AboutSection = ({ data }) => {
    return (
        <div className="flex flex-col items-center w-full p-8 md:p-12 max-w-4xl">
            {data.image && (
                <div className="w-32 md:w-40 mb-6 bg-white p-1 rounded-full shadow-xl">
                    <img className="w-full rounded-full" src={data.image} alt="Profile" onError={(e) => { e.target.src = "./themes/system_icons/user-home.png" }} />
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900 tracking-wide">
                    {data.title === "About Me" ? (
                        <>
                            my name is <span className="font-bold">Damian Barabonkov</span>,
                            <div className="font-normal text-xl md:text-2xl mt-2 text-gray-600">I'm a <span className="text-ub-orange font-bold">Founding AI Engineer!</span></div>
                            <div className="text-lg text-gray-500 mt-2" aria-label="Dual citizen">🇺🇸 & 🇪🇺 Citizen, living in Berlin</div>
                        </>
                    ) : data.title}
                </h2>
            </div>
            
             <div className="w-24 h-1 bg-ub-orange my-6 rounded opacity-80"></div>

            <div className="w-full text-center md:text-justify text-gray-700 text-base md:text-lg leading-relaxed space-y-4">
                {Array.isArray(data.content) ? (
                    data.content.map((paragraph, idx) => (
                        <p key={idx} className="whitespace-pre-line" dangerouslySetInnerHTML={{__html: parseLinks(paragraph)}}></p>
                    ))
                ) : (
                    data.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="whitespace-pre-line" dangerouslySetInnerHTML={{__html: parseLinks(paragraph)}}></p>
                    ))
                )}
            </div>
        </div>
    );
}

const EducationSection = ({ data }) => {
    return (
        <div className="w-full p-8 md:p-12 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">{data.title}</h2>
            <ul className="space-y-6">
                {data.schools.map((school, idx) => (
                    <li key={idx} className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm transition-colors">
                        <div className="text-xl font-bold text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500 mb-2 font-mono">{school.date}</div>
                        <div className="text-lg text-gray-700">{school.degree}</div>
                        {school.gpa && <div className="text-sm font-bold text-ub-orange mt-2">GPA: {school.gpa}</div>}
                        {school.description && <div className="text-sm text-gray-600 mt-3 italic" dangerouslySetInnerHTML={{__html: parseLinks(school.description)}} />}
                    </li>
                ))}
            </ul>

            {data.teaching && (
                <>
                    <h3 className="text-2xl font-bold mt-12 mb-6 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">Teaching Engagements</h3>
                    <ul className="grid grid-cols-1 gap-3">
                        {data.teaching.map((item, idx) => (
                            <li key={idx} className="bg-white p-3 rounded border border-gray-200 text-gray-700 text-sm md:text-base shadow-sm" dangerouslySetInnerHTML={{__html: item}} />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

const ExperienceSection = ({ data }) => {
    return (
        <div className="w-full p-8 md:p-12 max-w-4xl">
             <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">{data.title}</h2>
             <ul className="space-y-8">
                {data.jobs.map((job, idx) => (
                    <li key={idx} className="relative pl-8 border-l-2 border-gray-300 hover:border-ub-orange transition-colors duration-300 group">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-50 border-4 border-gray-300 group-hover:border-ub-orange transition-colors duration-300"></div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 group-hover:border-gray-300 shadow-sm transition-all">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                                <div className="text-xl font-bold text-gray-900">{job.name}</div>
                                <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block w-fit mt-1 md:mt-0">{job.date}</div>
                            </div>
                            <div className="text-lg font-medium text-ub-orange mb-4">{job.role}</div>
                            
                            {job.description && (
                                 <div className="space-y-4">
                                    {Array.isArray(job.description) ? (
                                        job.description.map((descGroup, dIdx) => (
                                            <div key={dIdx}>
                                                {descGroup.title && <div className="font-bold text-gray-800 mb-2">{descGroup.title}</div>}
                                                {descGroup.items && (
                                                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                                        {descGroup.items.map((item, iIdx) => (
                                                            <li key={iIdx} className="leading-relaxed" dangerouslySetInnerHTML={{__html: parseLinks(item)}} />
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : null}
                                 </div>
                            )}
                        </div>
                    </li>
                ))}
             </ul>
        </div>
    );
}

const ContactSection = ({ data }) => {
    return (
        <div className="w-full p-8 md:p-12 max-w-3xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">{data.title}</h2>
            <div className="flex flex-col gap-4">
                {data.contacts?.map((contact, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 flex flex-col lg:flex-row items-start lg:items-center gap-3 hover:border-ub-orange transition-all">
                        {contact.href ? (
                            <a href={contact.href} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:border-ub-orange shrink-0">
                                <img src={contact.icon} alt={contact.label} className="w-9 h-9 object-contain" />
                            </a>
                        ) : (
                            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 shrink-0">
                                <img src={contact.icon} alt={contact.label} className="w-9 h-9 object-contain" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">{contact.label}</div>
                            {contact.href ? (
                                <a href={contact.href} target="_blank" rel="noreferrer" className="text-lg font-semibold text-ub-orange hover:underline break-all">
                                    {contact.value}
                                </a>
                            ) : (
                                <div className="text-lg font-semibold text-gray-800 break-words">{contact.value}</div>
                            )}
                            {contact.caption && <div className="text-xs text-gray-500 mt-1">{contact.caption}</div>}
                        </div>
                        {contact.href && (
                            <a href={contact.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-ub-orange transition-colors">
                                Open
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h10m0 0v10m0-10L5 19" />
                                </svg>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const ProjectsSection = ({ projectsData }) => {
    const [sortMode, setSortMode] = useState('pinned');
    const [filterLanguage, setFilterLanguage] = useState('All');
    const languageMenuRef = useRef(null);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

    const languageColors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Go: '#00ADD8',
        Rust: '#dea584',
        Java: '#b07219',
        C: '#555555',
        'C++': '#f34b7d',
        'C#': '#178600',
        Shell: '#89e051',
        Ruby: '#701516',
        PHP: '#4F5D95',
        Kotlin: '#A97BFF',
        Swift: '#F05138',
        HTML: '#e34c26',
        CSS: '#563d7c'
    };

    const getLanguageStyles = (language) => {
        const background = languageColors[language] || '#e5e7eb';
        const textColor = languageColors[language] ? '#1f2937' : '#4b5563';
        return { backgroundColor: `${background}1A`, borderColor: background, color: textColor };
    };

    const pinnedNames = useMemo(() => {
        const nodes = projectsData?.data?.user?.pinnedItems?.nodes || [];
        return nodes.map(node => node?.name).filter(Boolean);
    }, [projectsData]);

    const repositoryNodes = useMemo(() => {
        return projectsData?.data?.user?.repositories?.nodes || [];
    }, [projectsData]);

    const pinnedNameSet = useMemo(() => new Set(pinnedNames), [pinnedNames]);

    const normalizedProjects = useMemo(() => {
        return repositoryNodes.map(node => {
            const identifier = node?.id || node?.url || node?.name;
            return {
                id: identifier,
                name: node?.name || 'Untitled',
                description: node?.description || '',
                stargazers_count: typeof node?.stargazerCount === 'number' ? node.stargazerCount : 0,
                language: node?.primaryLanguage?.name,
                updated_at: node?.updatedAt || '',
                html_url: node?.url,
                homepage: node?.homepageUrl,
                topics: (node?.repositoryTopics?.nodes || []).map(topicNode => topicNode?.topic?.name || topicNode?.name).filter(Boolean),
                pinned: pinnedNameSet.has(node?.name)
            };
        });
    }, [repositoryNodes, pinnedNameSet]);

    const parseTimestamp = (value) => {
        const date = new Date(value);
        const time = date.getTime();
        return Number.isNaN(time) ? 0 : time;
    };

    const pinnedProjects = useMemo(() => {
        if (!pinnedNames.length) {
            return normalizedProjects.filter(project => project.pinned);
        }
        const lookup = new Map();
        normalizedProjects.forEach(project => {
            if (!lookup.has(project.name)) {
                lookup.set(project.name, project);
            }
        });
        const ordered = [];
        pinnedNames.forEach(name => {
            if (lookup.has(name)) {
                ordered.push(lookup.get(name));
            }
        });
        return ordered;
    }, [normalizedProjects, pinnedNames]);

    const languageOptions = useMemo(() => {
        const unique = new Set();
        normalizedProjects.forEach(project => {
            if (project.language) {
                unique.add(project.language);
            }
        });
        return Array.from(unique).sort((a, b) => a.localeCompare(b));
    }, [normalizedProjects]);

    const sortedProjects = useMemo(() => {
        if (sortMode === 'pinned') return [];
        const filtered = normalizedProjects.filter(project => filterLanguage === 'All' || project.language === filterLanguage);
        const list = [...filtered];
        if (sortMode === 'updated') {
            list.sort((a, b) => parseTimestamp(b.updated_at) - parseTimestamp(a.updated_at));
        } else if (sortMode === 'stars') {
            list.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        } else if (sortMode === 'alpha') {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }
        return list;
    }, [normalizedProjects, sortMode, filterLanguage]);

    useEffect(() => {
        if (filterLanguage !== 'All' && sortMode === 'alpha') {
            setSortMode('updated');
        }
    }, [filterLanguage, sortMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
                setLanguageMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatUpdatedAt = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const handleSortChange = (mode) => {
        if (mode === 'alpha' && filterLanguage !== 'All') return;
        if (mode === 'pinned' && filterLanguage !== 'All') {
            setFilterLanguage('All');
        }
        setSortMode(mode);
    };

    const handleFilterChange = (language) => {
        if (sortMode === 'pinned') return;
        setFilterLanguage(language);
        setLanguageMenuOpen(false);
    };

    const isPinnedMode = sortMode === 'pinned';
    const visibleProjects = isPinnedMode ? pinnedProjects : sortedProjects;


    const renderProjectCard = (project) => (
        <div key={project.id} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex justify-between items-start mb-3 gap-3">
                <div className="font-bold text-lg text-gray-900 flex flex-col gap-2 group-hover:text-ub-orange transition-colors">
                    <span className="break-all leading-tight">{project.name}</span>
                    {project.stargazers_count > 0 && (
                        <div className="flex items-center text-xs text-gray-700 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .587l3.668 7.568L24 9.75l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.598 0 9.75l8.332-1.595z" />
                            </svg>
                            {project.stargazers_count}
                        </div>
                    )}
                </div>
                {project.language && (
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap"
                        style={getLanguageStyles(project.language)}
                    >
                        {project.language}
                    </span>
                )}
            </div>
            <p className="text-gray-600 text-sm flex-grow mb-4 leading-relaxed">
                {project.description || 'No description provided yet.'}
            </p>
            {project.topics && project.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.topics.map(topic => (
                        <span key={`${project.id}-${topic}`} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                            #{topic}
                        </span>
                    ))}
                </div>
            )}
            <div className="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Updated {formatUpdatedAt(project.updated_at)}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <a
                        href={project.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-ub-orange font-medium hover:text-ub-orange-dark"
                    >
                        <span className="mr-1">View on GitHub</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <span className="mr-1">Project Website</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full p-8 md:p-12 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">Projects</h2>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'pinned', label: 'Pinned' },
                        { id: 'updated', label: 'Updated At' },
                        { id: 'stars', label: 'Stars' },
                        { id: 'alpha', label: 'Alphabetical' }
                    ].map(option => {
                        const isDisabled = option.id === 'alpha' && filterLanguage !== 'All';
                        const isActive = sortMode === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSortChange(option.id)}
                                disabled={isDisabled}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${isActive ? 'bg-ub-orange text-white border-ub-orange' : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                <div className="relative" ref={languageMenuRef}>
                    <button
                        type="button"
                        onClick={() => setLanguageMenuOpen(open => !open)}
                        disabled={isPinnedMode}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 transition-colors ${isPinnedMode ? 'opacity-50 cursor-not-allowed' : 'hover:border-ub-orange hover:text-ub-orange'}`}
                    >
                        <span>Language:</span>
                        <span className="font-semibold">{filterLanguage}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {languageMenuOpen && !isPinnedMode && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-ub-orange border border-ub-orange rounded-lg shadow-xl z-20 overflow-hidden max-h-72 flex flex-col">
                            <div className="overflow-y-scroll language-menu" style={{ scrollbarWidth: 'auto' }}>
                                <style>{`
                                    .language-menu::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .language-menu::-webkit-scrollbar-track {
                                        background: rgba(0,0,0,0.05);
                                    }
                                    .language-menu::-webkit-scrollbar-thumb {
                                        background: #e95420;
                                        border-radius: 9999px;
                                    }
                                `}</style>
                                <button
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-ub-orange hover:text-white ${filterLanguage === 'All' ? 'bg-ub-orange text-white font-semibold' : ''}`}
                                    onClick={() => handleFilterChange('All')}
                                >
                                    All
                                </button>
                                {languageOptions.map(lang => (
                                    <button
                                        key={lang}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-ub-orange hover:text-white ${filterLanguage === lang ? 'bg-ub-orange text-white font-semibold' : ''}`}
                                        onClick={() => handleFilterChange(lang)}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleProjects.length === 0 && (
                    <div className="text-gray-500 text-sm">No repositories found.</div>
                )}
                {visibleProjects.map(renderProjectCard)}
            </div>
        </div>
    );
}


const ResumeSection = ({ source }) => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-50">
            <iframe className="flex-grow w-full" src={source} title="Resume" frameBorder="0"></iframe>
        </div>
    );
}


// Helper to parse markdown-style links [text](url)
function parseLinks(text) {
    if (!text) return text;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const codeRegex = /`([^`]+)`/g;

    let formatted = text.replace(
        linkRegex,
        '<a href="$2" target="_blank" class="text-ub-orange underline hover:text-ub-orange-dark">$1</a>'
    );

    formatted = formatted.replace(
        codeRegex,
        '<code class="px-1 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm border border-gray-200">$1</code>'
    );

    return formatted;
}
