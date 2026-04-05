export default function StatsCard({ title, value, icon: Icon, colorClass, iconBg }) {
  return (
    <div className="ui-card relative overflow-hidden border-t-[3px]" style={{ borderTopColor: colorClass || '#FF6B4E' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mb-3 mono">{title}</p>
          <p className="text-4xl font-extrabold text-ink mono leading-none">
            {value !== undefined ? value.toLocaleString('en-IN') : '---'}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg || colorClass || '#FF6B4E' }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
