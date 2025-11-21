import React, { Component, useEffect, useRef, useState } from 'react';
import aboutSections from '../../content/about.json';
import {
    GITHUB_USERNAME,
    PROJECTS_PER_PAGE,
    buildGithubHeaders,
    fetchPinnedRepositories,
    getRestRequestConfig,
} from '../github_api';

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
            pinnedProjects: null,
            pinnedProjectsLoading: false,
            pinnedProjectsError: null,
        }
        this.contentRef = React.createRef();
        this.pinnedFetchController = null;
    }

    componentDidMount() {
        this.prefetchPinnedProjects();
    }

    componentWillUnmount() {
        if (this.pinnedFetchController) {
            this.pinnedFetchController.abort();
        }
    }

    prefetchPinnedProjects = async () => {
        if (this.state.pinnedProjectsLoading) return;
        if (this.pinnedFetchController) {
            this.pinnedFetchController.abort();
        }
        const controller = new AbortController();
        this.pinnedFetchController = controller;
        this.setState({ pinnedProjectsLoading: true, pinnedProjectsError: null });
        try {
            const normalized = await fetchPinnedRepositories({ signal: controller.signal });
            this.setState({ pinnedProjects: normalized, pinnedProjectsLoading: false, pinnedProjectsError: null });
        } catch (error) {
            if (controller.signal.aborted) return;
            this.setState({ pinnedProjectsError: error.message || 'Unable to load pinned repositories.', pinnedProjectsLoading: false });
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
            "About Me": "./themes/Yaru/status/about.svg",
            "Education": "./themes/Yaru/status/education.svg",
            "Experience": "./themes/Yaru/status/experience.svg",
            "Projects": "./themes/Yaru/status/projects.svg",
            "Resume": "./themes/Yaru/status/download.svg"
        };
        return map[title] || "./themes/Yaru/status/about.svg";
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
                    scrollContainerRef={this.contentRef}
                    pinnedData={this.state.pinnedProjects}
                    pinnedLoading={this.state.pinnedProjectsLoading}
                    pinnedError={this.state.pinnedProjectsError}
                    refreshPinned={this.prefetchPinnedProjects}
                />
            );
        } else if (section.layout === 'resume') {
            content = <ResumeSection source={section.source} />;
        } else if (section.schools) {
            content = <EducationSection data={section} />;
        } else if (section.jobs) {
            content = <ExperienceSection data={section} />;
        } else {
            content = <AboutSection data={section} />;
        }

        return (
            <div
                ref={this.contentRef}
                id="about-content-scroll"
                className="w-full h-full overflow-y-auto bg-gray-100 text-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            >
                {content}
            </div>
        );
    }


    renderFooter = () => {
        const isLast = this.state.activeSectionIndex === aboutSections.length - 1;
        const isFirst = this.state.activeSectionIndex === 0;

        return (
            <div className="h-16 bg-[#2c001e] flex items-center justify-between px-4 border-t border-gray-700 shrink-0">
                <div className="w-1/4 flex items-center text-sm text-gray-300">
                    {/* left spacer */}
                </div>
                
                <div className="flex space-x-2 justify-center w-1/2">
                    {aboutSections.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full ${this.state.activeSectionIndex === idx ? 'bg-white' : 'bg-gray-600'}`}
                        />
                    ))}
                </div>

                <div className="flex justify-end w-1/4 space-x-3">
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
                    <div className="hidden md:flex flex-col w-1/4 bg-[#380c2a] border-r border-gray-900 overflow-y-auto">
                        {this.renderNavLinks()}
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col w-full md:w-3/4 bg-white relative overflow-hidden">
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

export const displayAboutDamian = () => {
    return <AboutDamian />;
}

// Sub-components

const AboutSection = ({ data }) => {
    return (
        <div className="flex flex-col items-center w-full p-8 md:p-12 max-w-4xl">
            {data.image && (
                <div className="w-32 md:w-40 mb-6 bg-white p-1 rounded-full shadow-xl">
                    <img className="w-full rounded-full" src={data.image} alt="Profile" onError={(e) => { e.target.src = "./themes/Yaru/system/user-home.png" }} />
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-wide">
                    {data.title === "About Me" ? (
                        <>
                            my name is <span className="font-bold">Damian Barabonkov</span>,
                            <div className="font-normal text-xl md:text-2xl mt-2 text-gray-600">I'm a <span className="text-ub-orange font-bold">Founding AI Engineer!</span></div>
                            <div className="text-lg text-gray-500 mt-2 flex items-center justify-center gap-2" aria-label="Dual citizen">
                                <span role="img" aria-hidden="true" className="text-xl">🇺🇸</span>
                                <span className="text-base leading-none relative bottom-0.5">∪</span>
                                <span role="img" aria-hidden="true" className="text-xl">🇪🇺</span>
                                <span>Citizen</span>
                            </div>
                        </>
                    ) : data.title}
                </h2>
            </div>
            
             <div className="w-24 h-1 bg-ub-orange my-6 rounded opacity-80"></div>

            <div className="w-full text-center md:text-left text-gray-700 text-base md:text-lg leading-relaxed space-y-4">
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

const ProjectsSection = ({ scrollContainerRef, pinnedData, pinnedLoading, pinnedError, refreshPinned }) => {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [reloadToken, setReloadToken] = useState(0);
    const [sortMode, setSortMode] = useState('pinned');
    const [filterLanguage, setFilterLanguage] = useState('All');
    const languageOptions = [
        'ActionScript',
        'C',
        'C++',
        'Cuda',
        'Cython',
        'Dart',
        'Emacs Lisp',
        'Go',
        'HTML',
        'JavaScript',
        'Jupyter Notebook',
        'Makefile',
        'Python',
        'Ruby',
        'Scheme',
        'TeX',
        'TypeScript'
    ];
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


    const buildRequestConfig = () => {
        if (sortMode === 'pinned') {
            return { type: 'pinned' };
        }
        return getRestRequestConfig({ sortMode, filterLanguage, page });
    };

    useEffect(() => {
        let aborted = false;
        const fetchProjects = async () => {
            if (sortMode === 'pinned') {
                if (!pinnedData && !pinnedLoading && typeof refreshPinned === 'function') {
                    refreshPinned();
                }
                return;
            }

            if (!hasMore && page !== 1) {
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const config = buildRequestConfig();
                if (config.type === 'pinned') {
                    return;
                }
                const { url, transform } = config;

                const response = await fetch(url, {
                    headers: buildGithubHeaders()
                });
                if (!response.ok) {
                    throw new Error(`GitHub API responded with ${response.status}`);
                }
                const data = await response.json();
                if (aborted) return;
                const normalized = transform(data);
                setProjects(prev => page === 1 ? normalized : [...prev, ...normalized]);
                setHasMore(normalized.length === PROJECTS_PER_PAGE);
            } catch (err) {
                if (!aborted) {
                    setError(err.message || 'Unable to load projects.');
                }
            } finally {
                if (!aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProjects();
        return () => {
            aborted = true;
        };
    }, [page, reloadToken, sortMode, filterLanguage, pinnedData, pinnedLoading, refreshPinned]);

    useEffect(() => {
        const element = scrollContainerRef?.current;
        const handleScroll = () => {
            if (sortMode === 'pinned') return;
            if (loading || !hasMore) return;
            let scrollTop, clientHeight, scrollHeight;
            if (element) {
                scrollTop = element.scrollTop;
                clientHeight = element.clientHeight;
                scrollHeight = element.scrollHeight;
            } else {
                scrollTop = window.scrollY || document.documentElement.scrollTop;
                clientHeight = window.innerHeight;
                scrollHeight = document.documentElement.scrollHeight;
            }
            if (scrollHeight - (scrollTop + clientHeight) < 200) {
                setPage(prev => prev + 1);
            }
        };

        const target = element || window;
        target.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainerRef?.current, loading, hasMore, sortMode]);

    useEffect(() => {
        if (filterLanguage !== 'All' && sortMode === 'alpha') {
            setSortMode('updated');
        }
    }, [filterLanguage, sortMode]);

    useEffect(() => {
        setProjects([]);
        setPage(1);
        setHasMore(true);
        setReloadToken(token => token + 1);
    }, [sortMode, filterLanguage]);

    const retryFetch = () => {
        setReloadToken(token => token + 1);
    };

    const handleRetry = () => {
        if (isPinnedMode) {
            if (typeof refreshPinned === 'function') {
                refreshPinned();
            }
        } else {
            retryFetch();
        }
    };

    const handleManualLoadMore = () => {
        if (!loading && hasMore && sortMode !== 'pinned') {
            setPage(prev => prev + 1);
        }
    };

    const formatUpdatedAt = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const handleSortChange = (mode) => {
        if (mode === 'alpha' && filterLanguage !== 'All') return;
        if (mode === 'pinned') {
            if (filterLanguage !== 'All') {
                setFilterLanguage('All');
            }
            setSortMode('pinned');
            return;
        }
        setSortMode(mode);
    };

    const handleFilterChange = (language) => {
        if (sortMode === 'pinned') return;
        setFilterLanguage(language);
        setLanguageMenuOpen(false);
    };

    const isPinnedMode = sortMode === 'pinned';
    const visibleProjects = isPinnedMode ? (pinnedData || []) : projects;
    const effectiveLoading = isPinnedMode ? pinnedLoading : loading;
    const effectiveError = isPinnedMode ? pinnedError : error;
    const canLoadMore = !isPinnedMode && hasMore;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
                setLanguageMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            {effectiveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex flex-col gap-3">
                    <span>{effectiveError}</span>
                    <button onClick={handleRetry} className="self-start px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700">
                        Retry
                    </button>
                </div>
            )}

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
                {visibleProjects.length === 0 && effectiveLoading && (
                    <div className="text-gray-500 text-sm">Loading projects...</div>
                )}
                {!effectiveLoading && !effectiveError && visibleProjects.length === 0 && (
                    <div className="text-gray-500 text-sm">No repositories found.</div>
                )}
                {visibleProjects.map(renderProjectCard)}
            </div>
            <div className="flex flex-col items-center gap-3 mt-6">
                {effectiveLoading && visibleProjects.length > 0 && !isPinnedMode && <div className="text-gray-500 text-sm">Loading more projects...</div>}
                {!effectiveLoading && canLoadMore && (
                    <button
                        onClick={handleManualLoadMore}
                        className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Load more projects
                    </button>
                )}
                {!isPinnedMode && !hasMore && visibleProjects.length > 0 && (
                    <div className="text-xs uppercase tracking-wide text-gray-400">You reached the end</div>
                )}
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
