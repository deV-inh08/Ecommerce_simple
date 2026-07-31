interface SimpleChartProps {
  title: string;
  data: { label: string; value: number; percentage?: number }[];
  type: 'bar' | 'donut';
  height?: number;
}

export default function SimpleChart({
  title,
  data,
  type,
  height = 300,
}: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (type === 'bar') {
    return (
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h3
          className="text-lg font-heading font-bold mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          {title}
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            height: `${height}px`,
            gap: '16px',
          }}
        >
          {data.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${(item.value / maxValue) * (height - 40)}px`,
                  backgroundColor: 'var(--primary)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.2s ease',
                }}
              ></div>
              <p
                className="text-xs font-medium mt-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {item.label}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: 'var(--text-dark)' }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Donut Chart
  if (type === 'donut') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = [
      'var(--primary)',
      'var(--primary-light)',
      'var(--accent)',
      'var(--beige-dark)',
    ];

    let cumulativePercentage = 0;
    const segments = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const startAngle = (cumulativePercentage * 360) / 100;
      const endAngle = ((cumulativePercentage + percentage) * 360) / 100;
      cumulativePercentage += percentage;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);

      const largeArc = percentage > 50 ? 1 : 0;

      const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { pathData, color: colors[index % colors.length], ...item };
    });

    return (
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h3
          className="text-lg font-heading font-bold mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <svg
            width={220}
            height={220}
            viewBox="0 0 200 200"
            style={{ flexShrink: 0 }}
          >
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            ))}
            <circle cx="100" cy="100" r="40" fill="#ffffff" />
          </svg>

          <div style={{ flex: 1 }}>
            {segments.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: item.color,
                  }}
                ></div>
                <span className="text-sm" style={{ color: 'var(--text-dark)' }}>
                  {item.label}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}
                >
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
