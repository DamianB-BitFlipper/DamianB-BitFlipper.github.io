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
            <div className="w-full h-full overflow-y-auto bg-white p-6 text-gray-900">
                 {content}
            </div>
        );
    }

    renderFooter = () => {
        const isLast = this.state.activeSectionIndex === about.length - 1;
        const isFirst = this.state.activeSectionIndex === 0;

        return (
            <div className="h-16 bg-[#2c001e] flex items-center justify-between px-4 border-t border-gray-700 shrink-0">
                <div className="w-1/4">
                   {/* Placeholder for Quit button - functionally purely decorative unless we can close */}
                   <button className="text-gray-300 text-sm hover:text-white px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors">
                       Quit
                   </button>
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
                <div className="w-32 md:w-40 mb-6 bg-white rounded-full shadow-lg">
                    <img className="w-full rounded-full" src={data.image} alt="Profile" onError={(e) => { e.target.src = "./themes/Yaru/system/user-home.png" }} />
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    {data.title === "About Me" ? (
                        <>
                            my name is <span className="font-bold">Damian Barabonkov</span>,
                            <div className="font-normal text-xl md:text-2xl mt-2">I'm a <span className="text-ub-orange font-bold">Software Engineer!</span></div>
                        </>
                    ) : data.title}
                </h2>
            </div>
            
             <div className="w-24 h-1 bg-ub-orange my-6 rounded"></div>

            <div className="prose prose-lg text-gray-600 w-full text-center md:text-left leading-relaxed">
                {data.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4" dangerouslySetInnerHTML={{__html: parseLinks(paragraph)}}></p>
                ))}
            </div>
        </div>
    );
}

const EducationSection = ({ data }) => {
    return (
        <div className="w-full p-8 md:p-12 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-2">{data.title}</h2>
            <ul className="space-y-8">
                {data.schools.map((school, idx) => (
                    <li key={idx} className="flex flex-col">
                        <div className="text-xl font-bold text-gray-800">{school.name}</div>
                        <div className="text-sm text-gray-500 mb-1">{school.date}</div>
                        <div className="text-lg text-gray-700">{school.degree}</div>
                        {school.gpa && <div className="text-sm font-bold text-ub-orange mt-1">GPA: {school.gpa}</div>}
                        {school.description && <div className="text-sm text-gray-600 mt-2" dangerouslySetInnerHTML={{__html: parseLinks(school.description)}} />}
                    </li>
                ))}
            </ul>

            {data.teaching && (
                <>
                    <h3 className="text-2xl font-bold mt-12 mb-6 border-b border-gray-200 pb-2">Teaching Engagements</h3>
                    <ul className="space-y-3 text-gray-600 list-disc pl-5">
                        {data.teaching.map((item, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
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
             <h2 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-2">{data.title}</h2>
             <ul className="space-y-10">
                {data.jobs.map((job, idx) => (
                    <li key={idx} className="relative pl-6 border-l-2 border-gray-200 hover:border-ub-orange transition-colors duration-300">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-ub-orange"></div>
                        <div className="text-xl font-bold text-gray-800">{job.name}</div>
                        <div className="text-sm text-gray-500 mb-1">{job.date}</div>
                        <div className="text-lg font-semibold text-gray-700 mb-3">{job.role}</div>
                        
                        {job.description && (
                             <div className="space-y-4">
                                {Array.isArray(job.description) ? (
                                    job.description.map((descGroup, dIdx) => (
                                        <div key={dIdx}>
                                            {descGroup.title && <div className="font-bold text-gray-800 mb-1">{descGroup.title}</div>}
                                            {descGroup.items && (
                                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                    {descGroup.items.map((item, iIdx) => (
                                                        <li key={iIdx} dangerouslySetInnerHTML={{__html: parseLinks(item)}} />
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                ) : null}
                             </div>
                        )}
                    </li>
                ))}
             </ul>
        </div>
    );
}

const ProjectsSection = () => {
    return (
        <div className="w-full p-8 md:p-12 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-2">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allProjects.map((project, index) => (
                     <div key={index} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                {project.title}
                                {project.github && (
                                     <iframe src={`https://ghbtns.com/github-btn.html?user=DamianB-BitFlipper&repo=${project.github.split('/').pop()}&type=star&count=true`} frameBorder="0" scrolling="0" width="90" height="20" title={project.title+"-star"}></iframe>
                                )}
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{project.category}</span>
                        </div>
                        <p className="text-gray-600 text-sm flex-grow mb-4">{project.description}</p>
                        <div className="mt-auto pt-2 border-t border-gray-100">
                             {project.redirect || project.github ? (
                                <a 
                                href={project.redirect || project.github} 
                                target="_blank" 
                                className="inline-flex items-center text-sm font-medium text-ub-orange hover:underline"
                                rel="noreferrer"
                                >
                                View Project
                                </a>
                            ) : (
                                <span className="text-sm text-gray-400 italic">Internal Project</span>
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
        <div className="w-full h-full flex flex-col">
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
