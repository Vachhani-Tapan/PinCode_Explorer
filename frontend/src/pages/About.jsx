import { Link } from 'react-router-dom';

export default function About() {
  const steps = [
    {
      num: '01',
      title: 'Choose your entry point',
      desc: 'Open the dashboard for a national overview, or jump into Explore when you want direct filters and search.',
      color: '#FF6B4E',
    },
    {
      num: '02',
      title: 'Drill down geographically',
      desc: 'Move from state to district to taluk, then scan the live table or open a detailed PIN record.',
      color: '#14B8A6',
    },
    {
      num: '03',
      title: 'Export the active slice',
      desc: 'Download the currently filtered subset as CSV when you need to continue analysis outside the app.',
      color: '#F59E0B',
    },
  ];

  const techStack = [
    {
      name: 'React',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
      bg: '#E8F8FE',
    },
    {
      name: 'Node.js',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
      bg: '#E8F5E9',
    },
    {
      name: 'Express',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
      bg: '#F3F4F6',
    },
    {
      name: 'MongoDB',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
      bg: '#E8F5E9',
    },
    {
      name: 'Redux Toolkit',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg',
      bg: '#F0EBFA',
    },
    {
      name: 'Tailwind CSS',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
      bg: '#E8FAFE',
    },
    {
      name: 'Vite',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
      bg: '#F5E9FF',
    },
    {
      name: 'JavaScript',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
      bg: '#FEF9E7',
    },
  ];

  return (
    <div className="space-y-12 fade-in max-w-5xl mx-auto">
      {/* Header */}
      <section>
        <div className="section-label">About</div>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-ink leading-tight tracking-tight">
          A clean interface for India's postal index.
        </h1>
        <p className="mt-4 text-muted text-lg leading-relaxed max-w-2xl">
          This tool wraps 1.5 lakh+ PIN code records in a modern, filterable dashboard — backed by MongoDB Atlas and served through a Node/Express API.
        </p>
      </section>

      {/* How It Works */}
      <section>
        <div className="section-label">How It Works</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-8">Three steps to any record</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(step => (
            <div key={step.num} className="ui-card relative">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: step.color }}
              >
                <span className="text-white font-bold text-sm">{step.num}</span>
              </div>
              <h3 className="text-xl font-extrabold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="ui-card bg-gray-50/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink leading-tight">
              Built as an open, data-forward exploration tool.
            </h2>
            <p className="text-muted mt-3 leading-relaxed max-w-xl">
              Data attribution belongs to India Post. The application layer is designed for developers, researchers, and operators who need clarity without clutter.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link 
              to="/dashboard"
              className="px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-semibold text-ink hover:bg-white hover:border-gray-300 transition-all text-center"
            >
              View Dashboard
            </Link>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-full bg-coral-500 text-sm font-semibold text-white hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-200 transition-all text-center"
            >
              Explore Records
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack — Real Logos */}
      <section>
        <div className="section-label">Stack</div>
        <h2 className="text-2xl font-extrabold text-ink mb-6">Built with</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {techStack.map(tech => (
            <div 
              key={tech.name} 
              className="ui-card flex flex-col items-center justify-center gap-3 py-6 px-4 hover:scale-[1.03] transition-transform"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center p-2.5"
                style={{ backgroundColor: tech.bg }}
              >
                <img 
                  src={tech.logo} 
                  alt={tech.name} 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-semibold text-ink text-center">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
