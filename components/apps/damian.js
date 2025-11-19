
import React, { Component } from 'react';
import { projects } from '../ubuntu_data';

export class AboutDamian extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about",
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "experience": <Experience />,
            "projects": <Projects />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen));
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        localStorage.setItem("about-section", screen);

        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = () => {
        return (
            <>
                <div id="about" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="about damian" src="./themes/Yaru/status/about.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
                </div>
                <div id="education" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "education" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="damian education" src="./themes/Yaru/status/education.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
                </div>
                <div id="experience" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "experience" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="damian experience" src="./themes/Yaru/status/experience.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Experience</span>
                </div>
                <div id="projects" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "projects" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="damian projects" src="./themes/Yaru/status/projects.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
                </div>
                <div id="resume" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "resume" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="damian resume" src="./themes/Yaru/status/download.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutDamian;

export const displayAboutDamian = () => {
    return <AboutDamian />;
}

function About() {
    return (
        <>
            <div className="w-20 md:w-28 my-4 bg-white rounded-full">
                <img className="w-full rounded-full" src="./damian.jpg" alt="Damian Barabonkov Logo" onError={(e) => { e.target.src = "./themes/Yaru/system/user-home.png" }} />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>my name is <span className="font-bold">Damian Barabonkov</span> ,</div>
                <div className="font-normal ml-1">I'm a <span className="text-pink-600 font-bold">Software Engineer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
            </div>
            <div className="prose prose-invert text-gray-200 px-4 md:px-12 w-full text-center md:text-left">
                <p className="text-lg font-medium">
                  Software Engineer — Bachelors and Masters in Computer Science, MIT
                </p>
                
                <p className="mt-2">
                  I am a machine learning engineer at <a href="https://www.quantco.com/" target="_blank" className="text-ub-orange hover:underline">QuantCo</a>. 
                  Before QuantCo, I studied Computer Science and Engineering (6-3) at MIT. 
                  My computing interests focus around systems programming, software design and performance engineering.
                </p>
                
                <p className="mt-2">
                  I proudly contribute to the open-source community. Projects that I have written, open-sourced and actively maintain include 
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-sm mx-1">groupstorm</code>, 
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-sm mx-1">algopytest</code> and 
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-sm mx-1">conda-comply</code>. 
                  I have also opened issues and written bug patches to Pandas, Pyarrow and Eigen.
                </p>
    
                <p className="mt-2">
                  Aside from computer science, teaching has always been important to me. All throughout university, 
                  I have taught and assisted various courses such as: graduate level Theory of Computation, 
                  undergraduate level Computability and Complexity Theory, Software Performance Engineering and Computation Structures.
                </p>
            </div>
        </>
    )
}

function Education() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Education
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Massachusetts Institute of Technology
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2020 - 2021 • Cambridge, MA, USA</div>
                    <div className=" text-sm md:text-base">Masters of Engineering (MEng) in Computer Science</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">GPA &nbsp; 5.0/5.0</div>
                    <div className="text-sm mt-1">Thesis: <a href="https://pdos.csail.mit.edu/papers/barabonkov-meng.pdf" target="_blank" className="text-ub-orange hover:underline">Guarda</a> — A web application firewall for WebAuthn transaction authentication</div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Massachusetts Institute of Technology
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2016 - 2020 • Cambridge, MA, USA</div>
                    <div className=" text-sm md:text-base">Bachelor of Science in Computer Science and Engineering</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">GPA &nbsp; 4.9/5.0</div>
                </li>
            </ul>
            
            <div className=" font-medium relative text-2xl mt-8 mb-4">
                Teaching Engagements
                 <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className="space-y-3 text-gray-300 w-10/12 ml-4">
                <li><strong>Computability and Complexity Theory (6.045)</strong> — TA, 2021</li>
                <li><strong>Theory of Computation (18.404)</strong> — TA, 2020</li>
                <li><strong>Software Performance Engineering (6.172)</strong> — Curriculum Developer / TA, 2018-2019</li>
                <li><strong>Computation Structures (6.004)</strong> — Lab Assistant, 2019</li>
                <li><strong>Physics II: Electricity and Magnetism (8.02)</strong> — TA, 2018</li>
            </ul>
        </>
    )
}

function Experience() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Experience
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        QuantCo Inc.
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2021 - Present • Berlin, DE</div>
                    <div className=" text-sm md:text-base font-semibold">Software Engineer</div>
                    <div className="mt-2 text-gray-300 text-sm">
                        <div>
                            <strong className="block text-white">Lead client-facing machine learning product</strong>
                            <ul className="list-disc list-inside pl-2">
                                <li>Project interactively displays machine learning predictions to client</li>
                                <li>Collaborate and coordinate with multi-disciplinary team</li>
                                <li>Orchestrate containerized backend systems for high availability</li>
                            </ul>
                        </div>
                        <div className="mt-2">
                            <strong className="block text-white">Develop internal feature engineering framework</strong>
                            <ul className="list-disc list-inside pl-2">
                                <li>Handles pricing models for two large German car insurers (5% market share)</li>
                                <li>Increased productivity with 10x performance gain in incremental computations</li>
                                <li>Open-source contributions to Pandas, Numpy, Kartothek</li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        QuantCo Inc.
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2020 • Karlsruhe, DE (Remote)</div>
                    <div className=" text-sm md:text-base font-semibold">Machine Learning Engineer</div>
                    <div className="mt-2 text-gray-300 text-sm">
                       <p>Optimized data pipelines of Python machine learning framework, improving speed by 470%.</p>
                    </div>
                </li>
                 <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Singapore — MIT Alliance for Research and Technology
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2019 • Singapore</div>
                    <div className=" text-sm md:text-base font-semibold">Supply Chain Researcher</div>
                </li>
                 <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Facebook Inc.
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2018 • Menlo Park, CA</div>
                    <div className=" text-sm md:text-base font-semibold">Performance and Capacity Engineer</div>
                </li>
            </ul>
        </>
    )
}

function Projects() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>

            {
                projects.map((project, index) => {
                    return (
                        <div key={index} className="flex w-full flex-col px-4">
                            <div className="w-full py-2 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-default">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2 font-bold">{project.title}</div>
                                        { project.github && 
                                            <iframe src={`https://ghbtns.com/github-btn.html?user=DamianB-BitFlipper&repo=${project.github.split('/').pop()}&type=star&count=true`} frameBorder="0" scrolling="0" width="150" height="20" title={project.title+"-star"}></iframe>
                                        }
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.category}</div>
                                </div>
                                <div className=" tracking-normal leading-tight text-sm font-light mt-2 text-gray-100">
                                    {project.description}
                                </div>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                   {project.redirect || project.github ? (
                                        <a 
                                        href={project.redirect || project.github} 
                                        target="_blank" 
                                        className="inline-flex items-center gap-1 text-ub-orange hover:underline font-medium"
                                        rel="noreferrer"
                                        >
                                        Install / Code
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Internal Project</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

function Resume() {
    return (
        <iframe className="h-full w-full" src="./public/assets/pdf/DamianBarabonkovCV.pdf" title="Damian Barabonkov Resume" frameBorder="0"></iframe>
    )
}
