import React, { Component } from 'react';
import { about, projects as allProjects } from '../ubuntu_data';

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
        if (this.state.activeSectionIndex < about.length - 1) {
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
                {about.map((section, index) => (
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
        const section = about[this.state.activeSectionIndex];
        if (!section) return null;

        let content;
        if (section.layout === 'projects') {
            content = <ProjectsSection />;
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
            <div className="w-full h-full overflow-y-auto bg-gray-100 text-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                 {content}
            </div>
        );
    }


    renderFooter = () => {
        const isLast = this.state.activeSectionIndex === about.length - 1;
        const isFirst = this.state.activeSectionIndex === 0;

        return (
            <div className="h-16 bg-[#2c001e] flex items-center justify-between px-4 border-t border-gray-700 shrink-0">
                <div className="w-1/4 flex items-center text-sm text-gray-300">
                    {/* left spacer */}
                </div>
                
                <div className="flex space-x-2 justify-center w-1/2">
                    {about.map((_, idx) => (
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
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const currentSection = about[this.state.activeSectionIndex];

        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none relative font-ubuntu overflow-hidden">
                {/* Window Header inside content */}
                <div className="h-12 bg-[#2c001e] flex items-center px-4 border-b border-gray-800 shrink-0">
                    <span className="font-bold text-lg tracking-wide">
                         {currentSection ? `Preparing to show ${currentSection.title}` : "Welcome"}
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
                            <div className="font-normal text-xl md:text-2xl mt-2 text-gray-600">I'm a <span className="text-ub-orange font-bold">Software Engineer!</span></div>
                        </>
                    ) : data.title}
                </h2>
            </div>
            
             <div className="w-24 h-1 bg-ub-orange my-6 rounded opacity-80"></div>

            <div className="prose prose-lg text-gray-600 w-full text-center md:text-left leading-loose max-w-none">
                {data.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6" dangerouslySetInnerHTML={{__html: parseLinks(paragraph)}}></p>
                ))}
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

const ProjectsSection = () => {
    return (
        <div className="w-full p-8 md:p-12 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2 text-gray-800 tracking-wide">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allProjects.map((project, index) => (
                     <div key={index} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-6 group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="font-bold text-lg text-gray-900 flex items-center gap-2 group-hover:text-ub-orange transition-colors">
                                {project.title}
                                {project.github && (
                                     <iframe src={`https://ghbtns.com/github-btn.html?user=DamianB-BitFlipper&repo=${project.github.split('/').pop()}&type=star&count=true`} frameBorder="0" scrolling="0" width="90" height="20" title={project.title+"-star"}></iframe>
                                )}
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">{project.category}</span>
                        </div>
                        <p className="text-gray-600 text-sm flex-grow mb-6 leading-relaxed">{project.description}</p>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                             {project.redirect || project.github ? (
                                <a 
                                href={project.redirect || project.github} 
                                target="_blank" 
                                className="inline-flex items-center text-sm font-medium text-ub-orange hover:text-ub-orange-dark transition-colors"
                                rel="noreferrer"
                                >
                                <span className="mr-1">View Project</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                </a>
                            ) : (
                                <span className="text-sm text-gray-400 italic cursor-not-allowed">Internal Project</span>
                            )}
                        </div>
                     </div>
                ))}
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
    return text.replace(linkRegex, '<a href="$2" target="_blank" class="text-ub-orange hover:underline">$1</a>');
}
