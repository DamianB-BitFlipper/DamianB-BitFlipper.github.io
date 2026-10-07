import Head from 'next/head';

const github = 'https://github.com/DamianB-BitFlipper';

export default function Home() {
  return <>
    <Head>
      <title>Damian Barabonkov — Systems & AI Engineer</title>
      <meta name="description" content="Leading sandboxing at Prime Intellect. Building fault-tolerant AI infrastructure from the ground up with Go, Rust, Linux, and secure microVMs." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#f8f7f4" />
      <meta property="og:title" content="Damian Barabonkov — Systems & AI Engineer" />
      <meta property="og:description" content="Sandboxing at Prime Intellect. Distributed systems, virtualization, and performance engineering in Go and Rust." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.damianb.dev/damian_headshot_clean.jpg" />
      <meta name="twitter:card" content="summary" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </Head>
    <main className="profile">
      <header className="site-header"><a className="wordmark" href="/" aria-label="Damian Barabonkov home">db<span>.</span></a><nav aria-label="Profile links"><a href={github}>GitHub ↗</a><a href="https://x.com/damian_b">X ↗</a><a href="https://www.linkedin.com/in/damian-barabonkov-5286a2290">LinkedIn ↗</a><a href="/files/Damian_Barabonkov_Resume.pdf">Résumé ↗</a></nav></header>
      <div className="profile-header">
        <div><h1>Damian<br />Barabonkov<span>.</span></h1><p className="subtitle">Leading Sandboxing at Prime Intellect</p><p className="location">San Francisco</p></div>
        <img src="/damian_headshot_clean.jpg" alt="Damian Barabonkov" width="160" height="188" />
      </div>
      <div className="bio">
        <p>I lead sandboxing at <a href="https://www.primeintellect.ai/">Prime Intellect</a>, where I designed and built the <a href="https://www.primeintellect.ai/blog/sandboxes">sandboxing platform</a>: a distributed control plane that schedules workloads across bare-metal CPU and GPU workers, and a node runtime that launches and supervises secure microVMs.</p>
        <p>I build fault-tolerant systems in Go and Rust, working deep in Linux, virtualization, networking, storage, and performance engineering. I own the platform end to end, taking reinforcement learning and agent workloads from design to production.</p>
        <p>Previously, I was the founding AI engineer at <a href="https://www.ellamind.com/">ellamind</a>, building <a href="https://www.ellamind.com/products/elluminate">elluminate</a> from zero to one, with earlier engineering roles at <a href="https://www.quantco.com/">QuantCo</a> and Facebook. I hold a BSc and MEng in Computer Science from MIT.</p>
        <h2>Selected work</h2>
        <ul className="projects">
          <li><a href="https://github.com/cloud-hypervisor/cloud-hypervisor/pulls?q=is%3Apr+state%3Aclosed+author%3ADamianB-BitFlipper">Cloud Hypervisor</a>, contributions including userfaultfd, VFIO BAR mapping, PCIe topology, and ARM snapshotting.</li>
          <li><a href={`${github}/dynamic-load-bench`}>dynamic-load-bench</a>, a memory bandwidth and latency benchmark, included in Phoronix and used at Intel.</li>
          <li><a href={`${github}/JS-OS`}>JS-OS</a>, a learning project to build a Unix-like OS, with multitasking, filesystems, device drivers and a window manager.</li>
        </ul>
        <p className="contact">Feel free to email me at <span className="email-address">dbctl [at] pm [dot] me</span>.</p>
      </div>
    </main>
  </>;
}
