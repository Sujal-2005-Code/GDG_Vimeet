const Loader = () => {
  return (
    <div className="loader" role="status" aria-live="polite" aria-label="Loading">
      <svg viewBox="0 0 900 200" width="100%" height="200" aria-hidden="true">
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="bmw-text">
          Join GDG ViMEET
        </text>
        <defs>
          <linearGradient id="bmwGradient" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#0066B1" offset="0%" />
            <stop stopColor="#E60C2C" offset="33%" />
            <stop stopColor="#6E6E6E" offset="66%" />
            <stop stopColor="#FFFFFF" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default Loader;

