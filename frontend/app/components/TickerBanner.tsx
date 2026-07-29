export default function TickerBanner() {
  const message = "🔥 GET 50% OFF IN THE BELOW PRODUCT";
  const repeated = Array(10).fill(message).join("   •   ");

  return (
    <div
      id="ticker-banner"
      style={{ backgroundColor: "#111", overflow: "hidden" }}
      className="py-3"
    >
      <div className="ticker-inner flex">
        <span
          style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}
          className="inline-block"
        >
          {repeated}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{repeated}
        </span>
      </div>
    </div>
  );
}
