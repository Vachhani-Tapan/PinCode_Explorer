export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted font-medium">
            India PIN Code Explorer
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-[0.2em] mono">
            <span>React</span>
            <span className="text-coral-400">•</span>
            <span>Express</span>
            <span className="text-coral-400">•</span>
            <span>MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
